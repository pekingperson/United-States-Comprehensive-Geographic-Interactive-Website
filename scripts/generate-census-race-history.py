"""Build small, key-free race-history shards from public Census downloads.

Run with Python + pandas + openpyxl (and xlrd for the older city workbooks).
Source downloads are cached outside the deployed data directory.
"""

import argparse
import csv
import io
import json
import math
import re
import struct
import sys
import time
import urllib.request
import zlib
import zipfile
from collections import Counter, defaultdict
from concurrent.futures import ThreadPoolExecutor
from pathlib import Path

import pandas as pd

ROOT = Path(__file__).resolve().parents[1]
CACHE = ROOT / "reports" / "census-history-cache"
OUTPUT = ROOT / "data" / "census-race-history"
sys.path.insert(0, str(ROOT / "reports" / "census-import-deps"))
MCDC = "https://mcdc.missouri.edu/data/"
WP56 = "https://www2.census.gov/library/working-papers/2002/demo/pop-twps0056/"
FIELDS = ["year", "source", "total", "white", "black", "native", "asian", "pacific",
          "other", "multiple", "hispanic", "whiteNonHispanic", "asianPacific", "nativeOther"]
STATES = [(row.split(":")[0], row.split(":")[1], row.split(":")[2]) for row in
          "01:al:Alabama 02:ak:Alaska 04:az:Arizona 05:ar:Arkansas 06:ca:California "
          "08:co:Colorado 09:ct:Connecticut 10:de:Delaware 11:dc:District_of_Columbia "
          "12:fl:Florida 13:ga:Georgia 15:hi:Hawaii 16:id:Idaho 17:il:Illinois "
          "18:in:Indiana 19:ia:Iowa 20:ks:Kansas 21:ky:Kentucky 22:la:Louisiana "
          "23:me:Maine 24:md:Maryland 25:ma:Massachusetts 26:mi:Michigan 27:mn:Minnesota "
          "28:ms:Mississippi 29:mo:Missouri 30:mt:Montana 31:ne:Nebraska 32:nv:Nevada "
          "33:nh:New_Hampshire 34:nj:New_Jersey 35:nm:New_Mexico 36:ny:New_York "
          "37:nc:North_Carolina 38:nd:North_Dakota 39:oh:Ohio 40:ok:Oklahoma 41:or:Oregon "
          "42:pa:Pennsylvania 44:ri:Rhode_Island 45:sc:South_Carolina 46:sd:South_Dakota "
          "47:tn:Tennessee 48:tx:Texas 49:ut:Utah 50:vt:Vermont 51:va:Virginia "
          "53:wa:Washington 54:wv:West_Virginia 55:wi:Wisconsin 56:wy:Wyoming 72:pr:Puerto_Rico".split()]
LEVELS = {"010": 0, "020": 1, "030": 1, "040": 2, "050": 5, "060": 10,
          "140": 11, "150": 12, "160": 7, "252": 5, "310": 5, "330": 3,
          "400": 5, "500": 4, "610": 5, "620": 5, "795": 7, "860": 5, "970": 7}


def download(url: str) -> Path:
    path = CACHE / re.sub(r"[^A-Za-z0-9_.-]", "_", url.removeprefix("https://"))
    if path.exists():
        return path
    CACHE.mkdir(parents=True, exist_ok=True)
    for attempt in range(3):
        try:
            request = urllib.request.Request(url, headers={"User-Agent": "UnitedStatesInteractiveMap/1.0"})
            with urllib.request.urlopen(request, timeout=120) as response:
                content = response.read()
            path.write_bytes(content)
            return path
        except Exception:
            if attempt == 2:
                raise
            time.sleep(2 * (attempt + 1))
    raise RuntimeError(url)


def range_bytes(url: str, byte_range: str) -> bytes:
    request = urllib.request.Request(url, headers={"Range": f"bytes={byte_range}", "User-Agent": "UnitedStatesInteractiveMap/1.0"})
    with urllib.request.urlopen(request, timeout=120) as response:
        if response.status != 206:
            raise ValueError("Server did not honor the partial archive request")
        return response.read()


def archive_directory(url: str) -> dict:
    tail = range_bytes(url, "-65536")
    end = tail.rfind(b"PK\x05\x06")
    size, offset = struct.unpack_from("<II", tail, end + 12)
    directory = range_bytes(url, f"{offset}-{offset + size - 1}")
    files, position = {}, 0
    while directory[position:position + 4] == b"PK\x01\x02":
        values = struct.unpack_from("<4s6H3I5H2I", directory, position)
        name_length, extra, comment = values[10:13]
        name = directory[position + 46:position + 46 + name_length].decode()
        files[name] = {"size": values[8], "offset": values[16], "crc": values[7], "method": values[4]}
        position += 46 + name_length + extra + comment
    return files


def archive_file(url: str, name: str, directory: dict) -> Path:
    path = CACHE / f"archive_{name}"
    if path.exists():
        return path
    entry = directory[name]
    content = range_bytes(url, f"{entry['offset']}-{entry['offset'] + entry['size'] + 4095}")
    name_length, extra = struct.unpack_from("<HH", content, 26)
    start = 30 + name_length + extra
    compressed = content[start:start + entry["size"]]
    unpacked = zlib.decompress(compressed, -15) if entry["method"] == 8 else compressed
    if zlib.crc32(unpacked) != entry["crc"]:
        raise ValueError(f"Archive checksum mismatch: {name}")
    CACHE.mkdir(parents=True, exist_ok=True)
    path.write_bytes(unpacked)
    return path


def count(value):
    if value == "-":
        return 0
    if not isinstance(value, (int, float)) or not math.isfinite(value) or value < 0:
        return None
    if value != round(value):
        raise ValueError(f"Non-integer population: {value}")
    return int(value)


def text(value) -> str:
    return str(value).strip() if pd.notna(value) else ""


def full_geoid(level: str, code: str):
    code = re.sub(r"[- .]", "", code)
    if level not in LEVELS or len(code) != LEVELS[level]:
        return None
    if code and not re.fullmatch(r"[0-9]+[RT]?", code):
        return None
    return f"{level}00US{code}"


def sas_geoid(row: dict):
    if text(row.get("geocomp")) not in ("", "00"):
        return None
    raw = text(row.get("geoid"))
    if raw:
        match = re.fullmatch(r"(\d{3})(?:0000|C200|Z200)US(.*)", raw)
        return full_geoid(*match.groups()) if match else None
    level = text(row.get("sumlev", row.get("slvl")))
    code = text(row.get("geocode")) or text(row.get("esriid"))
    if level == "860":
        code = text(row.get("zcta5")) or code
    if level == "010":
        code = ""
    return full_geoid(level, code)


def pack(year: int, source: str, **values) -> list:
    result = [year, source] + [values.get(field) for field in FIELDS[2:]]
    total = values.get("total")
    if total is None:
        raise ValueError(f"Missing population: {year} {source}")
    if any(value is not None and (value < 0 or value > total) for value in result[3:]):
        raise ValueError(f"Population outside its universe: {result}")
    if values.get("meta"):
        result.append(values["meta"])
    return result


def numeric(value):
    """ASCII Census count, not a missing/suppressed cell."""
    value = str(value).strip()
    return int(value) if value.isdigit() else None


def fixed_geography(line: str, year: int):
    """Positions are one-based in the Census SF1 technical documentation."""
    def field(start, length):
        return line[start - 1:start - 1 + length].strip()

    level = field(9, 3)
    if field(12, 2) != "00" or field(14, 3) != "000" or level not in LEVELS:
        return None
    state = field(30 if year == 2000 else 28, 2)
    county = field(32 if year == 2000 else 30, 3)
    codes = {"010": "", "020": field(26, 1), "030": field(27, 1), "040": state,
             "050": state + county, "060": state + county + field(37, 5),
             "140": state + county + field(56 if year == 2000 else 55, 6),
             "150": state + county + field(56 if year == 2000 else 55, 7),
             "160": state + field(46, 5),
             "252": field(78 if year == 2000 else 77, 4) + field(89 if year == 2000 else 88, 1)}
    if year == 2010:
        codes.update({"310": field(113, 5), "330": field(125, 3), "400": field(145, 5),
                      "500": state + field(154, 2), "610": state + field(156, 3),
                      "620": state + field(159, 3), "860": field(172, 5),
                      "970": state + field(194, 5)})
    geoid = full_geoid(level, codes.get(level, ""))
    return (field(19, 7), geoid, field(201 if year == 2000 else 227, 90)) if geoid else None


def modern_counts(row, year):
    # SF1 2000 file 01: P1[1], P2[6], P3[71], P4[73].
    # SF1 2010 file 03: P3[8], P4[3], P5[17]. DHC 2020 file 05 adds P1[1], P2[4].
    start = 12 if year == 2000 else (10 if year == 2020 else 5)
    total = numeric(row[start])
    race_start = start + (2 if year == 2000 else 1)
    keys = ["white", "black", "native", "asian", "pacific", "other", "multiple"]
    values = dict(zip(keys, (numeric(cell) for cell in row[race_start:race_start + 7])))
    ethnicity_start = start + 71 if year == 2000 else start + 8
    values.update(total=total, hispanic=numeric(row[ethnicity_start + (1 if year == 2000 else 2)]),
                  whiteNonHispanic=numeric(row[ethnicity_start + (4 if year == 2000 else 5)]))
    if any(values[key] is None for key in keys) or sum(values[key] for key in keys) != total:
        raise ValueError(f"Race categories do not reconcile: {year} {row[:5]} {values}")
    return values


def import_national(year, urban_update=False):
    if year == 2020:
        url = "https://www2.census.gov/programs-surveys/decennial/2020/data/demographic-and-housing-characteristics-file/National/us2020.dhc.zip"
        extension, segment = "dhc", 5
    else:
        extension, segment = ("ur1" if urban_update else "sf1"), 3
        folder = "Urban_Rural_Update/" if urban_update else ""
        url = f"https://www2.census.gov/census_2010/04-Summary_File_1/{folder}National/us2010.{extension}.zip"
    directory = archive_directory(url)
    geography = {}
    with archive_file(url, f"usgeo{year}.{extension}", directory).open(encoding="latin1") as source:
        for line in source:
            if year == 2020:
                cells = line.rstrip().split("|")
                if cells[4:6] != ["00", "000"]:
                    continue
                match = re.fullmatch(r"(\d{3})[A-Z0-9]{2}00US(.*)", cells[8])
                geoid = full_geoid(*match.groups()) if match else None
                item = (cells[7], geoid, cells[87]) if geoid else None
            else:
                item = fixed_geography(line, year)
            if item and (not urban_update or item[1].startswith("400")):
                geography[item[0]] = item[1:]
    entries = []
    path = archive_file(url, f"us{segment:05}{year}.{extension}", directory)
    with path.open(encoding="latin1", newline="") as source:
        for row in csv.reader(source, delimiter="|" if year == 2020 else ","):
            area = geography.get(row[4])
            if area:
                entries.append((*area, pack(year, f"sf{year}", **modern_counts(row, year))))
    print(f"{year} official national file: {len(entries):,} records", flush=True)
    return entries


def archive_lines(archive):
    for name in archive.namelist():
        if name.upper().startswith("STF1A"):
            with archive.open(name) as source:
                yield from source


def import_sf1990(state):
    fips, abbr, _ = state
    archive = zipfile.ZipFile(download(f"https://www2.census.gov/census_1990/STF1A_ASCII/90STF1A-{abbr.upper()}.ZIP"))
    entries = []
    with archive:
        source = archive_lines(archive)
        for raw in source:
            line = raw.decode("latin1")
            level = line[10:13]
            if line[13:18] != "00000" or line[24:28] != "0001" or level not in ("040", "050", "060", "140", "150", "160", "500"):
                continue
            county, tract = line[71:74], line[51:57].replace(" ", "0")
            code = {"040": fips, "050": fips + county, "060": fips + county + line[79:84],
                    "140": fips + county + tract, "150": fips + county + tract + line[50:51],
                    "160": fips + line[115:120], "500": fips + line[57:59]}[level]
            geoid = full_geoid(level, code)
            if not geoid:
                continue
            values = dict(zip(["white", "black", "native", "asianPacific", "other"],
                              [numeric(line[i:i + 9]) for i in range(381, 426, 9)]))
            total = numeric(line[300:309])
            if any(value is None for value in values.values()) or sum(values.values()) != total:
                raise ValueError(f"1990 race reconciliation failed: {geoid}")
            values.update(total=total, hispanic=numeric(line[651:660]), whiteNonHispanic=numeric(line[705:714]))
            entries.append((geoid, line[191:257].strip(), pack(1990, "sf1990", **values)))
    print(f"1990 {abbr}: {len(entries):,} records", flush=True)
    return entries


def import_sf2000(state):
    _, abbr, name = state
    base = f"https://www2.census.gov/census_2000/datasets/Summary_File_1/{name}/"
    geography = {}
    archive = zipfile.ZipFile(download(f"{base}{abbr}geo_uf1.zip"))
    with archive.open(archive.namelist()[0]) as source:
        for raw in source:
            item = fixed_geography(raw.decode("latin1"), 2000)
            if item:
                geography[item[0]] = item[1:]
    entries = []
    archive = zipfile.ZipFile(download(f"{base}{abbr}00001_uf1.zip"))
    with archive.open(archive.namelist()[0]) as source:
        for row in csv.reader(io.TextIOWrapper(source, encoding="latin1")):
            area = geography.get(row[4])
            if area:
                entries.append((*area, pack(2000, "sf2000", **modern_counts(row, 2000))))
    print(f"2000 {abbr}: {len(entries):,} records", flush=True)
    return entries


def import_sas(year: int, path: str) -> list:
    frame = pd.read_sas(download(MCDC + path), format="sas7bdat", encoding="latin1")
    frame.columns = frame.columns.str.lower()
    entries = []
    for row in frame.to_dict("records"):
        geoid = sas_geoid(row)
        if not geoid:
            continue
        values = {"total": count(row.get("totpop"))}
        columns = {"white": "white1", "black": "black1", "native": "indian", "asian": "asian1",
                   "pacific": "hawnpi1", "other": "other1", "multiple": "multrace",
                   "hispanic": "hisppop", "whiteNonHispanic": "white_non_hisp"}
        if year in (1990, 2000):
            columns["whiteNonHispanic"] = "white_non_hispanic"
        if year == 1980:
            columns = {"white": "white", "black": "black", "asianPacific": "asianpi",
                       "nativeOther": "otherrac", "hispanic": "hispanic"}
        values.update({key: count(row.get(column)) for key, column in columns.items()})
        if values["total"] is None:
            continue
        entries.append((geoid, text(row.get("areaname", row.get("zipname"))), pack(year, f"mcdc{year}", **values)))
    print(f"{year} {path}: {len(entries):,} records", flush=True)
    return entries


def import_wp56(table: int, geoid: str) -> list:
    frame = pd.read_excel(download(f"{WP56}table{table:02}.xlsx"), header=None)
    name = re.sub(r"^Table \d+\.\s*|\s*- Race and Hispanic Origin:.*$", "", text(frame.iloc[0, 0]))
    entries, years, current = [], set(), None
    for row in frame.itertuples(index=False, name=None):
        label = text(row[0])
        if label == "PERCENT":
            break
        if current and current[0] == 1970 and re.match(r"^\.\s*5% sample", label):
            add_sample_ethnicity(current, row[1], row[7], row[8])
        match = re.match(r"^(1[789]\d0)(?:\b|/)", label)
        if not match:
            continue
        year = int(match[1])
        if year in years:
            continue  # First complete-count series; alternate universes remain in linked source.
        years.add(year)
        values = dict(zip(["total", "white", "black", "native", "asianPacific", "other",
                           "hispanic", "whiteNonHispanic"], map(count, row[1:9])))
        if year <= 1880:
            # These columns switch to free/enslaved Black population, NOT Hispanic origin.
            values.update(other=None, hispanic=None, whiteNonHispanic=None)
        current = pack(year, f"wp56-{table:02}", **values)
        entries.append((geoid, name, current))
    if table in (16, 26):
        entries.extend(transposed_state_history(frame, geoid, name, table))
    print(f"WP56 table {table:02}: {len(entries)} censuses", flush=True)
    return entries


def add_sample_ethnicity(record, universe, hispanic, white, shares=None):
    hispanic, white, universe = count(hispanic), count(white), count(universe)
    if hispanic is None or (universe is None and not shares):
        return
    record[10:12] = [hispanic, white]
    meta = record[14] if len(record) > 14 else {}
    meta.update(ethnicitySample=True)
    if universe is not None:
        meta["ethnicityTotal"] = universe
    if shares:
        meta["ethnicityShares"] = shares
    if len(record) == 14:
        record.append(meta)


def transposed_state_history(frame, geoid, name, table):
    """Alaska/Hawaii pre-1960 tables put census years in columns, unlike the other 63 tables."""
    rows = list(frame.itertuples(index=False, name=None))
    start = next(i for i, row in enumerate(rows) if text(row[0]) == "Race" and i > 5)
    entries = []
    for column, heading in enumerate(rows[start][1:], 1):
        match = re.match(r"^(18\d0|19\d[09])", text(heading))
        if not match:
            continue
        values, extra = {}, []
        for row in rows[start + 1:]:
            label, value = text(row[0]), count(row[column])
            if label.startswith("."):
                continue
            label = re.sub(r"\s+", " ", label)
            key = next((key for prefix, key in [("Total", "total"), ("White", "white"), ("Black", "black"),
                                                ("American Indian", "native"), ("Asian and Pacific", "asianPacific"),
                                                ("Not elsewhere", "other")] if label.startswith(prefix)), None)
            if key:
                values[key] = value
            elif value is not None and label.startswith(("Mexican", "Puerto Rican")):
                extra.append({"label": label.split("/")[0].strip() + " (historical race category)", "count": value})
        meta = {"notes": ["Historical territorial census; categories and territory differ from today's state. See the source footnotes."]}
        if extra:
            meta["extraRaces"] = extra
        if table == 16 and int(match[0]) in (1929, 1939):
            meta["notes"].append("Alaska's census was conducted one year before the corresponding national census.")
        entries.append((geoid, name, pack(int(match[0]), f"wp56-{table:02}", meta=meta, **values)))
    return entries


def place_key(name):
    name = name.lower().split(",")[0]
    name = re.sub(r"\([^)]*\)|\d+\s*$", "", name)
    name = re.sub(r"\b(?:city|town|village|borough|municipality|cdp|balance|consolidated|government|corporation)\b", "", name)
    return re.sub(r"[^a-z]", "", name)


def place_lookup(entries):
    candidates = defaultdict(set)
    for geoid, name, _ in entries:
        if geoid.startswith("160"):
            candidates[(geoid[7:9], place_key(name))].add(geoid)
    return {key: next(iter(ids)) for key, ids in candidates.items() if len(ids) == 1}


def import_wp76(state, lookup):
    fips, abbr, _ = state
    url = f"https://www2.census.gov/library/working-papers/2005/demo/pop-twps0076/{abbr}tab.xls"
    workbook = pd.ExcelFile(download(url))
    entries, unmatched = [], set()
    # Workbook spellings, duplicate place names, and renamed/consolidated city codes.
    # Their historical boundaries are explicitly identified in each record's notes.
    aliases = {("02", "juneau"): "16000US0236400", ("06", "sanbernadino"): "16000US0665000",
               ("12", "jacksonville"): "16000US1235000", ("13", "columbus"): "16000US1319000",
               ("15", "kailua"): "16000US1523150", ("18", "indianapolis"): "16000US1836003",
               ("21", "lexington"): "16000US2146027", ("30", "butte"): "16000US3011397",
               ("40", "muscogee"): "16000US4050050", ("47", "nashville"): "16000US4752006",
               ("48", "mesquite"): "16000US4847892"}
    for sheet in workbook.sheet_names:
        frame = workbook.parse(sheet, header=None)
        geoid, name, current = None, "", None
        for row in frame.itertuples(index=False, name=None):
            label = text(row[0])
            if len(row) < 17:
                continue
            if current and current[0] == 1970 and re.match(r"^\.\s*5% sample", label):
                shares = {field: float(row[column]) for field, column in [("hispanic", 14), ("whiteNonHispanic", 16)]
                          if isinstance(row[column], (int, float)) and math.isfinite(row[column])}
                add_sample_ethnicity(current, row[1], row[13], row[15], shares)
            match = re.match(r"^(1[789]\d0|1929|1939)(?:\b|/)", label)
            if match:
                year = int(match[1])
                if not geoid or count(row[1]) is None:
                    continue
                values = dict(zip(["total", "white", "black", "native", "asianPacific", "other", "hispanic", "whiteNonHispanic"],
                                  (count(row[i]) for i in range(1, 17, 2))))
                if year <= 1880:
                    values.update(other=None, hispanic=None, whiteNonHispanic=None)
                if not any(values[key] is not None for key in ("white", "black", "native", "asianPacific")):
                    continue
                # First full-count series only; alternate boundaries/estimates are in the source.
                if any(g == geoid and r[0] == year for g, _, r in entries):
                    continue
                if (fips, place_key(name)) in aliases:
                    values["meta"] = {"notes": [f"Historical city series: {name.rstrip(' 0123456789')}. Census-era city limits and consolidation definitions apply; see the source footnotes."]}
                current = pack(year, f"wp76-{abbr}", **values)
                entries.append((geoid, name, current))
            elif label and all(not text(value) for value in row[1:]):
                candidate = aliases.get((fips, place_key(label))) or lookup.get((fips, place_key(label)))
                if candidate:
                    geoid, name, current = candidate, label, None
                elif not label.startswith((".", "Table", "(", "Source", "Footnote", "Internet")):
                    geoid, current = None, None
                    if len(label) < 60 and not label[0].isdigit():
                        unmatched.add(label)
    print(f"WP76 {abbr}: {len(entries)} records; unmatched headings: {sorted(unmatched)}", flush=True)
    return entries


def import_sf1980(lookup):
    frame = pd.read_sas(download(MCDC + "census_1980/stf801/us.sas7bdat"), format="sas7bdat", encoding="latin1")
    entries = []
    for row in frame.to_dict("records"):
        level, state, name = text(row["SUMRYLVL"]), text(row["STATE"]), text(row["AREANAME"])
        codes = {"01": ("010", ""), "02": ("020", text(row["REGION"])), "03": ("030", text(row["DIVISION"])),
                 "04": ("040", state), "11": ("050", state + text(row["COUNTY"])),
                 "33": ("500", state + text(row["CONDIST"]))}
        geoid = lookup.get((state, place_key(name))) if level == "27" else full_geoid(*codes.get(level, ("", "")))
        if not geoid:
            continue
        race = [count(row[f"T7I{i}"]) for i in range(1, 16)]
        values = {"total": count(row["T1I1"]), "white": race[0], "black": race[1], "native": sum(race[2:5]),
                  "asianPacific": sum(race[5:14]), "other": race[14], "hispanic": count(row["T9I1"]),
                  "whiteNonHispanic": race[0] - count(row["T9I2"])}
        if sum(race) != values["total"]:
            raise ValueError(f"1980 race reconciliation failed: {geoid}")
        entries.append((geoid, name, pack(1980, "sf1980", **values)))
    print(f"1980 full-count STF1: {len(entries):,} records", flush=True)
    return entries


def shard_for(geoid: str) -> str:
    level, code = geoid[:3], geoid[7:]
    prefix = code[:5] if level in ("140", "150") else code[:2]
    return f"{level}/{prefix or 'us'}.json"


def write_data(entries: list) -> None:
    old_manifest = OUTPUT / "manifest.json"
    old_files = json.loads(old_manifest.read_text(encoding="utf-8"))["files"] if old_manifest.exists() else []
    shards = defaultdict(dict)
    for geoid, name, record in entries:
        area = shards[shard_for(geoid)].setdefault(geoid, {"name": name, "records": {}})
        area["records"][record[0]] = record
    coverage = Counter()
    for path, areas in shards.items():
        for geoid, area in areas.items():
            area["records"] = sorted(area["records"].values(), key=lambda r: r[0])
            for record in area["records"]:
                coverage[f"{geoid[:3]}:{record[0]}"] += 1
        destination = OUTPUT / path
        destination.parent.mkdir(parents=True, exist_ok=True)
        destination.write_text(json.dumps(areas, ensure_ascii=False, separators=(",", ":")) + "\n", encoding="utf-8")
    manifest = {"version": 1, "fields": FIELDS, "files": sorted(shards), "coverage": dict(sorted(coverage.items()))}
    (OUTPUT / "manifest.json").write_text(json.dumps(manifest, indent=2) + "\n", encoding="utf-8")
    for obsolete in set(old_files) - set(shards):
        target = (OUTPUT / obsolete).resolve()
        if re.fullmatch(r"\d{3}/(?:\d{1,5}|us)\.json", obsolete) and target.is_relative_to(OUTPUT.resolve()):
            target.unlink(missing_ok=True)  # Only our previously generated shards; reproducible from the archives.
    print(f"Saved {sum(len(s) for s in shards.values()):,} geographies in {len(shards)} shards", flush=True)


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--small", action="store_true", help="Only national/state/county and historical summary tables")
    parser.add_argument("--refresh-archives", action="store_true", help="Reuse generated modern extracts; refresh official archives and historical tables")
    parser.add_argument("--refresh-tables", action="store_true", help="Reuse generated Census files; refresh the older historical summary tables only")
    args = parser.parse_args()
    jobs = []
    for year, folder in [(2020, "dhc2020x"), (2010, "sf12010x")]:
        datasets = ["usstcnty", "usregdiv"]
        if not args.small:
            datasets += ["usplaces", "uscousubs", "ustracts", "usschools", "usmetros",
                         "uscdsldspumas" if year == 2020 else "uscdsldspumas2012",
                         "uszctas" if year == 2020 else "uszips860"]
            if year == 2020:
                datasets += ["usuas"]
            datasets += [f"{abbr}bgs150" for _, abbr, _ in STATES]
        jobs.extend((year, f"{folder}/{dataset}.sas7bdat") for dataset in datasets)
    jobs += [(1990, "census_1990/stf901x2/us.sas7bdat")]
    if not args.small:
        jobs.append((2000, "census_2000/sf12000x/us.sas7bdat"))
    entries = []
    if args.refresh_archives or args.refresh_tables:
        manifest = json.loads((OUTPUT / "manifest.json").read_text(encoding="utf-8"))
        for file in manifest["files"]:
            for geoid, area in json.loads((OUTPUT / file).read_text(encoding="utf-8")).items():
                entries.extend((geoid, area["name"], record) for record in area["records"]
                               if (not record[1].startswith(("wp56", "wp76")) if args.refresh_tables
                                   else record[0] >= 2000 or record[1] == "mcdc1990"))
        jobs = []
    with ThreadPoolExecutor(max_workers=2) as pool:
        for result in pool.map(lambda job: import_sas(*job), jobs):
            entries.extend(result)
        if not args.small and not args.refresh_tables:
            for result in pool.map(import_sf1990, STATES[:51]):
                entries.extend(result)
            for result in pool.map(import_sf2000, STATES):
                entries.extend(result)
            for result in pool.map(import_national, [2010, 2020]):
                entries.extend(result)
            entries.extend(import_national(2010, urban_update=True))
        if not args.small:
            lookup = place_lookup(entries)
            if not args.refresh_tables:
                entries.extend(import_sf1980(lookup))
            for result in pool.map(lambda state: import_wp76(state, lookup), STATES[:51]):
                entries.extend(result)
        historical = [(1, "01000US")]
        historical += [(i + 1, f"02000US{i}") for i in range(1, 5)]
        historical += [(i + 5, f"03000US{i}") for i in range(1, 10)]
        historical += [(i + 15, f"04000US{state}") for i, (state, _, _) in enumerate(STATES[:51])]
        for result in pool.map(lambda job: import_wp56(*job), historical):
            entries.extend(result)
    write_data(entries)


if __name__ == "__main__":
    main()
