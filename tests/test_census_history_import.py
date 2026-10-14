"""Regression fixtures for historical Census file layouts; no network required."""

import contextlib
import importlib.util
import io
from pathlib import Path
import unittest
from unittest.mock import patch
import zipfile

SCRIPT = Path(__file__).resolve().parents[1] / "scripts" / "generate-census-race-history.py"
SPEC = importlib.util.spec_from_file_location("census_history_import", SCRIPT)
history = importlib.util.module_from_spec(SPEC)
SPEC.loader.exec_module(history)


def fixed_line(fields, length=800):
    """Fixture offsets are zero-based; the importer uses the published one-based layout."""
    result = list(" " * length)
    for start, value in fields.items():
        result[start:start + len(value)] = value
    return "".join(result)


class HistoryImporterTests(unittest.TestCase):
    def test_geoid_filters_partial_geographies(self):
        self.assertEqual(history.sas_geoid({"geoid": "860Z200US43064", "geocomp": "00"}), "86000US43064")
        self.assertIsNone(history.sas_geoid({"geoid": "8710000US3943064", "geocomp": "00"}))
        self.assertIsNone(history.sas_geoid({"geoid": "1400000US39159050601", "geocomp": "01"}))
        self.assertEqual(history.full_geoid("252", "2430R"), "25200US2430R")
        self.assertIsNone(history.full_geoid("140", "391590506"))

    def test_2000_and_2010_state_and_tract_offsets(self):
        for year, state_start, county_start, tract_start in [(2000, 29, 31, 55), (2010, 27, 29, 54)]:
            with self.subTest(year=year):
                line = fixed_line({8: "140", 11: "00", 13: "000", 18: "0000042",
                                   state_start: "39", county_start: "159", tract_start: "050601"})
                self.assertEqual(history.fixed_geography(line, year)[:2], ("0000042", "14000US39159050601"))
                self.assertIsNone(history.fixed_geography(line[:11] + "01" + line[13:], year))

    def test_modern_table_offsets_and_reconciliation(self):
        for year, start, race_start, hispanic, white_non_hispanic in [(2000, 12, 14, 84, 87),
                                                                   (2010, 5, 6, 15, 18),
                                                                   (2020, 10, 11, 20, 23)]:
            with self.subTest(year=year):
                row = ["0"] * 160
                row[start] = "100"
                row[race_start:race_start + 7] = ["50", "20", "5", "10", "0", "5", "10"]
                row[hispanic], row[white_non_hispanic] = "15", "45"
                values = history.modern_counts(row, year)
                self.assertEqual((values["white"], values["multiple"], values["hispanic"], values["whiteNonHispanic"]), (50, 10, 15, 45))
                row[race_start] = "51"
                with self.assertRaises(ValueError):
                    history.modern_counts(row, year)

    def test_1990_multipart_archive_and_integer_tract_codes(self):
        fields = {10: "140", 13: "00000", 24: "0001", 51: "0506  ", 71: "159", 191: "Census Tract 506",
                  300: "000000100", 381: "000000070", 390: "000000020", 399: "000000005",
                  408: "000000004", 417: "000000001", 651: "000000008", 705: "000000065"}
        first = fixed_line(fields)
        second = fixed_line({**fields, 10: "150", 50: "2", 51: "050601"})
        wrong_segment = first[:24] + "0002" + first[28:]
        partial_area = first[:13] + "01000" + first[18:]
        archive = io.BytesIO()
        with zipfile.ZipFile(archive, "w") as output:
            output.writestr("README.TXT", "Not a data file")
            output.writestr("STF1A.F02", second + "\n" + wrong_segment + "\n")
            output.writestr("STF1A.F01", first + "\n" + partial_area + "\n")
        archive.seek(0)
        with patch.object(history, "download", return_value=archive), contextlib.redirect_stdout(io.StringIO()):
            entries = history.import_sf1990(("39", "oh", "Ohio"))
        self.assertEqual({entry[0] for entry in entries}, {"14000US39159050600", "15000US391590506012"})
        self.assertTrue(all(entry[2][2] == 100 and entry[2][10:12] == [8, 65] for entry in entries))

    def test_missing_counts_are_not_zero_and_sample_metadata_is_preserved(self):
        self.assertEqual(history.count("-"), 0)
        self.assertIsNone(history.count("NA"))
        self.assertIsNone(history.count(float("nan")))
        with self.assertRaises(ValueError):
            history.count(1.5)
        record = history.pack(1970, "wp56-01", total=100, white=80, black=20)
        history.add_sample_ethnicity(record, 125, 10, 75)
        self.assertEqual(record[10:12], [10, 75])
        self.assertEqual(record[14], {"ethnicitySample": True, "ethnicityTotal": 125})

    def test_ambiguous_city_names_are_not_matched(self):
        records = [("16000US1523150", "Kailua CDP, Hawaii", []), ("16000US1523000", "Kailua CDP, Hawaii", []),
                   ("16000US5363000", "Seattle city, Washington", [])]
        lookup = history.place_lookup(records)
        self.assertNotIn(("15", "kailua"), lookup)
        self.assertEqual(lookup[("53", "seattle")], "16000US5363000")

    def test_pre_1880_columns_do_not_become_hispanic_counts(self):
        frame = history.pd.DataFrame([
            ["Table 1. United States - Race and Hispanic Origin:", None, None, None, None, None, None, None, None],
            ["1860", 100, 80, 20, None, None, 20, 5, 15],
            ["PERCENT", None, None, None, None, None, None, None, None],
        ])
        with patch.object(history, "download", return_value=Path("fixture.xlsx")), \
                patch.object(history.pd, "read_excel", return_value=frame), contextlib.redirect_stdout(io.StringIO()):
            record = history.import_wp56(1, "01000US")[0][2]
        self.assertEqual(record[2:5], [100, 80, 20])
        self.assertEqual([record[8], record[10], record[11]], [None, None, None])


if __name__ == "__main__":
    unittest.main()
