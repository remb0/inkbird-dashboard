"""Routing contracts and rendered condition tests; not a substitute for HA tests."""
from ast import literal_eval
from pathlib import Path
import re
from types import SimpleNamespace
import unittest

from jinja2 import Environment, StrictUndefined
import yaml

PACKAGE = yaml.safe_load((Path(__file__).resolve().parents[1] / "packages/inkbird_bbq.yaml").read_text(encoding="utf-8"))
SEQUENCE = PACKAGE["script"]["bbq_notify"]["sequence"]
SPEECH = SEQUENCE[-1]["then"][1]
TV = SEQUENCE[-2]["then"][1]


class RoutingTests(unittest.TestCase):
    def render(self, template, values, available=()):
        env = Environment(undefined=StrictUndefined)
        env.filters["bitwise_and"] = lambda a, b: a & b
        env.filters["regex_match"] = lambda value, pattern: __import__("re").match(pattern, value) is not None
        env.globals.update(
            has_value=lambda entity: entity in available,
            is_state=lambda entity, state: values.get(entity) == state,
            state_attr=lambda entity, attr: 512,
        )
        return env.from_string(template).render(**values).strip() == "True"

    def alexa(self, **changes):
        values = {"engine": "Alexa (native)", "speaker": "media_player.test_echo", "alexa_speaker": True}
        values.update(changes)
        return self.render(SPEECH["choose"][1]["conditions"], values,
                           available=("media_player.test_echo",))

    def test_native_alexa(self):
        self.assertTrue(self.alexa())
        action = SPEECH["choose"][1]["sequence"][0]
        self.assertEqual(action["action"], "notify.alexa_media")
        self.assertEqual(action["data"]["data"], {"type": "announce", "method": "speak"})
        self.assertNotIn("continue_on_error", action)

    def test_alexa_rejects_other_engine(self):
        self.assertFalse(self.alexa(engine="tts.example"))

    def test_alexa_rejects_other_player(self):
        self.assertFalse(self.alexa(alexa_speaker=False))

    def test_alexa_rejects_unavailable_player(self):
        self.assertFalse(self.alexa(speaker="media_player.offline"))

    def test_generic_tts(self):
        values = {"engine": "tts.example", "speaker": "media_player.test", "alexa_speaker": False}
        self.assertTrue(self.render(SPEECH["choose"][2]["conditions"], values, available=("tts.example", "media_player.test")))
        values["alexa_speaker"] = True
        self.assertFalse(self.render(SPEECH["choose"][2]["conditions"], values, available=("tts.example", "media_player.test")))

    def test_unavailable_tts_is_rejected(self):
        self.assertFalse(self.render(SPEECH["choose"][2]["conditions"],
            {"engine": "tts.example", "speaker": "media_player.test", "alexa_speaker": False},
            available=("media_player.test",)))

    def test_persistent_first_and_visible_failure(self):
        self.assertEqual(SEQUENCE[0]["action"], "persistent_notification.create")
        self.assertEqual(SPEECH["default"][0]["action"], "persistent_notification.create")
        self.assertTrue(SPEECH["default"][-1]["error"])

    def test_tv_config_validation(self):
        values = {"tv_entity": "media_player.test_tv", "tv_service": "test_tv"}
        self.assertTrue(self.render(TV["choose"][0]["conditions"], values,
            available=("media_player.test_tv",)))
        values["tv_service"] = "notify.test_tv"
        self.assertFalse(self.render(TV["choose"][0]["conditions"], values))

    def test_tv_off_is_skipped_without_turning_on(self):
        branch = TV["choose"][0]["sequence"][0]
        self.assertFalse(self.render(branch["if"], {"tv_entity": "media_player.test_tv", "media_player.test_tv": "off"}))
        self.assertNotIn("media_player.turn_on", str(SEQUENCE))
        self.assertNotIn("media_player.volume_set", str(SEQUENCE))
        self.assertNotIn("media_player.select_source", str(SEQUENCE))

    def test_new_helpers_do_not_reset_on_restart(self):
        for domain, key in [("input_boolean", "bbq_tv_alerts"), ("input_text", "bbq_tv_entity"), ("input_text", "bbq_tv_notify_service")]:
            self.assertNotIn("initial", PACKAGE[domain][key])

    def test_no_unsupported_service_template_helper(self):
        self.assertNotIn("has_service(", str(PACKAGE))

    def refresh(self, selected_speaker="none", selected_engine="none", alexa=True):
        class States:
            media_player = [SimpleNamespace(entity_id="media_player.test_echo", state="idle"),
                            SimpleNamespace(entity_id="media_player.offline", state="unavailable")]
            tts = [SimpleNamespace(entity_id="tts.example", state="unknown")]

            def __call__(self, entity):
                return {"input_select.bbq_tts_speaker": selected_speaker,
                        "input_select.bbq_tts_engine": selected_engine}[entity]

        env = Environment(undefined=StrictUndefined)
        env.tests["match"] = lambda value, pattern: re.match(pattern, value) is not None
        env.globals.update(states=States(), integration_entities=lambda _: ["media_player.test_echo"] if alexa else [])
        return [literal_eval(env.from_string(step["data"]["options"]).render().strip())
                for step in PACKAGE["script"]["bbq_refresh_media_targets"]["sequence"]]

    def test_refresh_discovers_alexa_without_openai(self):
        self.assertEqual(self.refresh(), [["none", "media_player.test_echo"], ["none", "Alexa (native)"]])

    def test_refresh_preserves_selected_offline_targets(self):
        speakers, engines = self.refresh("media_player.offline", "tts.example", alexa=False)
        self.assertIn("media_player.offline", speakers)
        self.assertEqual(engines, ["none", "tts.example"])
        self.assertEqual(self.refresh(selected_engine="Alexa (native)", alexa=False)[1], ["none", "Alexa (native)"])

    def test_refresh_deduplicates_current_target(self):
        self.assertEqual(self.refresh("media_player.test_echo")[0].count("media_player.test_echo"), 1)


if __name__ == "__main__":
    unittest.main()
