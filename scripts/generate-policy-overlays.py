import io
import json
import os
import re
import ssl
import urllib.error
import urllib.request
import xml.etree.ElementTree as ET
import zipfile
from datetime import datetime, timezone


ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
OUT_PATH = os.path.join(ROOT, "data", "policy-overlays.json")

UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/124 Safari/537.36"

STATE_NAME_TO_FIPS = {
    "Alabama": "01",
    "Alaska": "02",
    "Arizona": "04",
    "Arkansas": "05",
    "California": "06",
    "Colorado": "08",
    "Connecticut": "09",
    "Delaware": "10",
    "District of Columbia": "11",
    "Florida": "12",
    "Georgia": "13",
    "Hawaii": "15",
    "Idaho": "16",
    "Illinois": "17",
    "Indiana": "18",
    "Iowa": "19",
    "Kansas": "20",
    "Kentucky": "21",
    "Louisiana": "22",
    "Maine": "23",
    "Maryland": "24",
    "Massachusetts": "25",
    "Michigan": "26",
    "Minnesota": "27",
    "Mississippi": "28",
    "Missouri": "29",
    "Montana": "30",
    "Nebraska": "31",
    "Nevada": "32",
    "New Hampshire": "33",
    "New Jersey": "34",
    "New Mexico": "35",
    "New York": "36",
    "North Carolina": "37",
    "North Dakota": "38",
    "Ohio": "39",
    "Oklahoma": "40",
    "Oregon": "41",
    "Pennsylvania": "42",
    "Rhode Island": "44",
    "South Carolina": "45",
    "South Dakota": "46",
    "Tennessee": "47",
    "Texas": "48",
    "Utah": "49",
    "Vermont": "50",
    "Virginia": "51",
    "Washington": "53",
    "West Virginia": "54",
    "Wisconsin": "55",
    "Wyoming": "56",
}
FIPS_TO_STATE_NAME = {value: key for key, value in STATE_NAME_TO_FIPS.items()}
STATE_ABBR_TO_FIPS = {
    "AL": "01",
    "AK": "02",
    "AZ": "04",
    "AR": "05",
    "CA": "06",
    "CO": "08",
    "CT": "09",
    "DE": "10",
    "DC": "11",
    "FL": "12",
    "GA": "13",
    "HI": "15",
    "ID": "16",
    "IL": "17",
    "IN": "18",
    "IA": "19",
    "KS": "20",
    "KY": "21",
    "LA": "22",
    "ME": "23",
    "MD": "24",
    "MA": "25",
    "MI": "26",
    "MN": "27",
    "MS": "28",
    "MO": "29",
    "MT": "30",
    "NE": "31",
    "NV": "32",
    "NH": "33",
    "NJ": "34",
    "NM": "35",
    "NY": "36",
    "NC": "37",
    "ND": "38",
    "OH": "39",
    "OK": "40",
    "OR": "41",
    "PA": "42",
    "RI": "44",
    "SC": "45",
    "SD": "46",
    "TN": "47",
    "TX": "48",
    "UT": "49",
    "VT": "50",
    "VA": "51",
    "WA": "53",
    "WV": "54",
    "WI": "55",
    "WY": "56",
}


def fetch_bytes(url, referer=None, accept="*/*"):
    headers = {"User-Agent": UA, "Accept": accept}
    if referer:
        headers["Referer"] = referer
    request = urllib.request.Request(url, headers=headers)
    try:
        with urllib.request.urlopen(request, timeout=60) as response:
            return response.read()
    except (ssl.SSLError, urllib.error.URLError):
        with urllib.request.urlopen(request, timeout=60, context=ssl._create_unverified_context()) as response:
            return response.read()


def fetch_json(url, referer=None):
    return json.loads(fetch_bytes(url, referer=referer, accept="application/json,text/plain,*/*").decode("utf-8"))


def slug(value):
    return re.sub(r"(^-|-$)", "", re.sub(r"[^a-z0-9]+", "-", str(value).lower()))


def number_or_none(value):
    if value is None or value == "":
        return None
    text = str(value).replace(",", "").replace(" ", "")
    try:
        return float(text)
    except ValueError:
        return None


def strip_html(value):
    return re.sub(r"\s+", " ", re.sub(r"<[^>]+>", " ", str(value or ""))).strip()


def overlay(id_, title, group, source_name, source_url, description="", value_type="category", **extra):
    item = {
        "id": id_,
        "title": title,
        "group": group,
        "sourceType": "policy-state",
        "sourceName": source_name,
        "sourceUrl": source_url,
        "description": description,
        "valueType": value_type,
        "values": {},
    }
    item.update(extra)
    return item


def make_binary_overlay(id_, title, group, source_name, source_url, states, yes_color, description=""):
    item = overlay(
        id_,
        title,
        group,
        source_name,
        source_url,
        description=description,
        value_type="category",
        categories=[
            {"value": "yes", "label": "Yes", "color": yes_color},
            {"value": "no", "label": "No", "color": "#d7dbe0"},
        ],
    )
    yes_fips = set(states)
    for fips, name in FIPS_TO_STATE_NAME.items():
        item["values"][fips] = {
            "value": "yes" if fips in yes_fips else "no",
            "label": "Yes" if fips in yes_fips else "No",
            "state": name,
        }
    return item


def guttmacher_overlays():
    source_url = "https://states.guttmacher.org/policies/"
    states_payload = fetch_json(
        "https://states.guttmacher.org/policies/admin/api/collections/get/states/?populate=1",
        referer=source_url,
    )
    filters_payload = fetch_json(
        "https://states.guttmacher.org/policies/admin/api/collections/get/filters/?populate=1&sort[_o]=1",
        referer=source_url,
    )
    states = states_payload.get("entries", [])
    environment_categories = [
        {"value": "Most Restrictive", "label": "Most Restrictive", "color": "#6f1d6a"},
        {"value": "Very Restrictive", "label": "Very Restrictive", "color": "#9c2f77"},
        {"value": "Restrictive", "label": "Restrictive", "color": "#c45d7f"},
        {"value": "Some Restrictions/Protections", "label": "Some Restrictions/Protections", "color": "#d8a94d"},
        {"value": "Protective", "label": "Protective", "color": "#6aa76f"},
        {"value": "Very Protective", "label": "Very Protective", "color": "#2c8b73"},
        {"value": "Most Protective", "label": "Most Protective", "color": "#0f6f60"},
    ]
    env = overlay(
        "guttmacher_abortion_policy_environment",
        "Abortion policy environment (Guttmacher)",
        "Abortion policy",
        "Guttmacher Institute",
        source_url,
        "State abortion-policy environment categories from Guttmacher's interactive policy map.",
        categories=environment_categories,
    )

    filter_state_ids = {}
    for state in states:
        fips = STATE_NAME_TO_FIPS.get(state.get("state", ""))
        if not fips:
            continue
        value = state.get("environment_type", "").replace("restrictions/protections", "Restrictions/Protections")
        env["values"][fips] = {"value": value, "label": value, "state": state.get("state")}
        for item in state.get("filters") or []:
            filter_state_ids.setdefault(item.get("_id"), set()).add(fips)

    results = [env]
    for item in filters_payload.get("entries", []):
        group = (item.get("filter_group") or [""])[0]
        if not group:
            continue
        title = f"{item.get('filter_title', '').strip()} (Guttmacher)"
        color = "#1b8a5a" if group == "protections" else "#b2182b" if group == "restrictions" else "#d95f02"
        results.append(
            make_binary_overlay(
                f"guttmacher_{slug(group)}_{slug(item.get('filter_title'))}",
                title,
                "Abortion policy",
                "Guttmacher Institute",
                source_url,
                filter_state_ids.get(item.get("_id"), set()),
                color,
                strip_html(item.get("filter_info", "")),
            )
        )
    return results


def crr_overlays():
    source_url = "https://reproductiverights.org/maps/abortion-laws-by-state/"
    payload = fetch_json("https://reproductiverights.org/wp-json/crr-maps/v1/map-data?type=us-arf", referer=source_url)
    data = payload["data"]
    posts = data.get("post_data") or []
    primary = data.get("primary_filter", {})
    status_categories = [
        {"value": opt["label"], "label": opt["label"], "color": {
            "Illegal": "#4b1f66",
            "Hostile": "#c44e73",
            "Not Protected": "#ef8a43",
            "Protected": "#e3c32d",
            "Expanded Access": "#2c9f78",
        }.get(opt["label"], "#9aa0a6")}
        for opt in primary.get("options", [])
    ]
    status = overlay(
        "crr_abortion_law_status",
        "Abortion law status (Center for Reproductive Rights)",
        "Abortion policy",
        "Center for Reproductive Rights",
        source_url,
        "After Roe Fell state abortion-law status categories.",
        categories=status_categories,
    )

    state_terms = {}
    for post in posts:
        fips = str(post.get("state_id") or "").zfill(2)
        if fips not in FIPS_TO_STATE_NAME:
            continue
        label = post.get("status_label", "")
        status["values"][fips] = {"value": label, "label": label, "state": post.get("name"), "note": strip_html(post.get("description"))}
        for taxonomy, ids in (post.get("filter_terms") or {}).items():
            for term_id in ids or []:
                state_terms.setdefault((taxonomy, int(term_id)), set()).add(fips)

    results = [status]
    for taxonomy, info in (data.get("tax_data") or {}).items():
        taxonomy_label = info.get("label", taxonomy)
        for term in (info.get("terms") or {}).values():
            if term.get("has_children"):
                continue
            title = f"{term.get('chip_label') or term.get('label')} - {taxonomy_label} (Center for Reproductive Rights)"
            term_group = "Abortion policy"
            if "protections" in taxonomy:
                color = "#1b8a5a"
            elif "restrictions" in taxonomy:
                color = "#b2182b"
            else:
                color = "#d95f02"
            results.append(
                make_binary_overlay(
                    f"crr_{slug(taxonomy)}_{slug(term.get('slug') or term.get('label'))}_{term.get('id')}",
                    title,
                    term_group,
                    "Center for Reproductive Rights",
                    source_url,
                    state_terms.get((taxonomy, int(term.get("id"))), set()),
                    color,
                    strip_html(info.get("description", "")),
                )
            )
    return results


def ecpm_death_penalty_overlays():
    source_url = "https://www.ecpm.org/en/worldmap/"
    data = fetch_json("https://www.ecpm.org/app/mu-plugins/ecpm_webmap_graphic_chart/public/data/data.json", referer=source_url)
    rows = [row for row in data if re.match(r"^US-[A-Z]{2}$", str(row.get("iso", "")))]
    status_labels = {
        1: "Retentionist",
        2: "Moratorium on executions",
        3: "Abolitionist for ordinary crimes",
        4: "Abolitionist",
    }
    status_colors = {
        1: "#d84e28",
        2: "#f57f22",
        3: "#d0ce28",
        4: "#38beac",
    }
    status_categories = [
        {"value": status_labels[key], "label": status_labels[key], "color": status_colors[key]}
        for key in [1, 2, 3, 4]
    ]

    status = overlay(
        "ecpm_death_penalty_status_us_states",
        "Death penalty worldwide status - U.S. states (ECPM)",
        "Death penalty",
        "ECPM",
        source_url,
        "U.S. state portion of ECPM's world death penalty map.",
        categories=status_categories,
    )
    dpic_status = overlay(
        "dpic_death_penalty_status",
        "Death penalty status (DPIC)",
        "Death penalty",
        "Death Penalty Information Center",
        "https://deathpenaltyinfo.org/resources/high-school/state-by-state-data/interactive-us-maps",
        "State death-penalty status shown in the DPIC interactive U.S. maps.",
        categories=status_categories,
    )
    death_row = overlay(
        "dpic_people_on_death_row",
        "People on death row (DPIC)",
        "Death penalty",
        "Death Penalty Information Center",
        "https://deathpenaltyinfo.org/resources/high-school/state-by-state-data/interactive-us-maps",
        "People currently sentenced to death by state.",
        value_type="number",
        textFormat="integer",
        colorScheme="SpectralBlueYellowRed",
    )
    executions = overlay(
        "dpic_executions_2024",
        "Executions in 2024 (DPIC)",
        "Death penalty",
        "Death Penalty Information Center",
        "https://deathpenaltyinfo.org/resources/high-school/state-by-state-data/interactive-us-maps",
        "Executions carried out in 2024 by state.",
        value_type="number",
        textFormat="integer",
        colorScheme="SpectralBlueYellowRed",
    )
    death_sentences = overlay(
        "dpic_death_sentences_2024",
        "Death sentences in 2024 (DPIC)",
        "Death penalty",
        "Death Penalty Information Center",
        "https://deathpenaltyinfo.org/resources/high-school/state-by-state-data/interactive-us-maps",
        "Death sentences imposed in 2024 by state.",
        value_type="number",
        textFormat="integer",
        colorScheme="SpectralBlueYellowRed",
    )
    last_execution = overlay(
        "dpic_last_execution_year",
        "Last execution year (DPIC)",
        "Death penalty",
        "Death Penalty Information Center",
        "https://deathpenaltyinfo.org/resources/high-school/state-by-state-data/interactive-us-maps",
        "Most recent execution year by state.",
        value_type="number",
        textFormat="year",
        colorScheme="SpectralBlueYellowRed",
    )

    for row in rows:
        abbr = row["iso"].split("-")[1]
        fips = STATE_ABBR_TO_FIPS.get(abbr) or STATE_NAME_TO_FIPS.get(row.get("placenameen", "").replace(" (US)", ""))
        if not fips:
            continue
        status_value = status_labels.get(int(row.get("status") or 0), "Not available")
        for target in [status, dpic_status]:
            target["values"][fips] = {"value": status_value, "label": status_value, "state": FIPS_TO_STATE_NAME[fips]}
        for target, column in [
            (death_row, "peopleindeathrow2024"),
            (executions, "executionsnumber2024"),
            (death_sentences, "condemnations2024"),
            (last_execution, "lastexecutiondate"),
        ]:
            value = number_or_none(row.get(column))
            if value is not None:
                target["values"][fips] = {"value": value, "label": str(int(value)), "state": FIPS_TO_STATE_NAME[fips]}

    return [dpic_status, death_row, executions, death_sentences, last_execution, status]


def shared_strings(zip_file):
    ns = {"a": "http://schemas.openxmlformats.org/spreadsheetml/2006/main"}
    if "xl/sharedStrings.xml" not in zip_file.namelist():
        return []
    root = ET.fromstring(zip_file.read("xl/sharedStrings.xml"))
    result = []
    for si in root.findall("a:si", ns):
        result.append("".join((t.text or "") for t in si.iter("{http://schemas.openxmlformats.org/spreadsheetml/2006/main}t")))
    return result


def column_number(reference):
    match = re.match(r"([A-Z]+)", reference)
    total = 0
    for char in match.group(1):
        total = total * 26 + ord(char) - 64
    return total - 1


def sheet_rows(zip_file, path, strings):
    ns = {"a": "http://schemas.openxmlformats.org/spreadsheetml/2006/main"}
    root = ET.fromstring(zip_file.read(path))
    rows = []
    for row in root.findall(".//a:row", ns):
        cells = {}
        for cell in row.findall("a:c", ns):
            idx = column_number(cell.attrib["r"])
            value_node = cell.find("a:v", ns)
            value = ""
            if value_node is not None:
                value = value_node.text or ""
                if cell.attrib.get("t") == "s":
                    value = strings[int(value)]
            cells[idx] = value
        if cells:
            rows.append([cells.get(i, "") for i in range(max(cells) + 1)])
    return rows


def cato_overlays():
    source_url = "https://www.freedominthe50states.org/"
    workbook = fetch_bytes(
        "https://cdn.freedominthe50states.org/download/2023/Freedom_In_The_50_States_2023.xlsx",
        referer=source_url,
        accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,*/*",
    )
    with zipfile.ZipFile(io.BytesIO(workbook)) as zip_file:
        strings = shared_strings(zip_file)
        fiscal_rows = sheet_rows(zip_file, "xl/worksheets/sheet1.xml", strings)
        regulatory_rows = sheet_rows(zip_file, "xl/worksheets/sheet2.xml", strings)
        personal_rows = sheet_rows(zip_file, "xl/worksheets/sheet3.xml", strings)
        abortion_rows = sheet_rows(zip_file, "xl/worksheets/sheet4.xml", strings)
        rows = sheet_rows(zip_file, "xl/worksheets/sheet5.xml", strings)

    headers = rows[0]
    header_index = {header: idx for idx, header in enumerate(headers)}
    year_idx = header_index["Year"]
    latest_year = max(int(row[year_idx]) for row in rows[1:] if str(row[year_idx]).isdigit())
    latest_rows = [row for row in rows[1:] if str(row[year_idx]) == str(latest_year)]

    columns = [
        ("Fiscal Policy", "fprank"),
        ("Regulatory Policy", "rprank"),
        ("Personal Freedom", "pfrank"),
        ("Economic Freedom", "efrank"),
        ("Overall Freedom", "ofrank"),
    ]
    results = []
    for score_col, rank_col in columns:
        score = overlay(
            f"cato_{slug(score_col)}_score",
            f"{score_col} score (Cato Institute)",
            "Freedom in the 50 States",
            "Cato Institute",
            source_url,
            f"{latest_year} Freedom in the 50 States score.",
            value_type="number",
            textFormat="score",
            colorScheme="SpectralRedYellowBlue",
        )
        rank = overlay(
            f"cato_{slug(score_col)}_rank",
            f"{score_col} rank (Cato Institute)",
            "Freedom in the 50 States",
            "Cato Institute",
            source_url,
            f"{latest_year} Freedom in the 50 States rank. Rank 1 is most free.",
            value_type="number",
            textFormat="rank",
            colorScheme="SpectralRedYellowBlue",
            reverseScale=True,
        )
        for row in latest_rows:
            state = row[header_index["State"]]
            fips = STATE_NAME_TO_FIPS.get(state)
            if not fips:
                continue
            score_value = number_or_none(row[header_index[score_col]])
            rank_value = number_or_none(row[header_index[rank_col]])
            if score_value is not None:
                score["values"][fips] = {"value": score_value, "label": f"{score_value:.3f}", "state": state}
            if rank_value is not None:
                rank["values"][fips] = {"value": rank_value, "label": f"#{int(rank_value)}", "state": state}
        results.extend([score, rank])

    def cato_title(value):
        text = re.sub(r"\s+", " ", str(value or "").strip())
        if text.isupper():
            text = text.title()
        return text.replace("Rtw", "RTW").replace("Right-To-Work", "Right-to-Work")

    existing_score_titles = {score_col for score_col, _rank_col in columns}
    for column, title in enumerate(headers):
        if column <= 11:
            continue
        title = cato_title(title)
        if not title or "victim cost" in title.lower():
            continue
        item = overlay(
            f"cato_{slug(title)}_score",
            f"{title} score (Cato Institute)",
            "Freedom in the 50 States",
            "Cato Institute",
            source_url,
            f"{latest_year} Freedom in the 50 States score.",
            value_type="number",
            textFormat="score",
            colorScheme="SpectralRedYellowBlue",
        )
        for row in latest_rows:
            state = row[header_index["State"]]
            fips = STATE_NAME_TO_FIPS.get(state)
            if not fips or column >= len(row):
                continue
            value = number_or_none(row[column])
            if value is not None:
                item["values"][fips] = {"value": value, "label": f"{value:.3f}", "state": state}
        if item["values"]:
            results.append(item)

    def latest_rows_from_dimension_sheet(sheet):
        header_row_index = next(
            index
            for index, row in enumerate(sheet)
            if len(row) > 1 and row[0] == "State" and row[1] == "Year"
        )
        data_rows = [
            row
            for row in sheet[header_row_index + 1 :]
            if len(row) > 1 and row[0] in STATE_NAME_TO_FIPS and str(row[1]).isdigit()
        ]
        latest = max(int(row[1]) for row in data_rows)
        return [row for row in data_rows if int(row[1]) == latest], latest

    for sheet_name, sheet in [
        ("Fiscal policy", fiscal_rows),
        ("Regulatory policy", regulatory_rows),
        ("Personal freedom", personal_rows),
        ("Abortion freedom", abortion_rows),
    ]:
        sheet_latest_rows, sheet_latest_year = latest_rows_from_dimension_sheet(sheet)
        sheet_headers = sheet[0]
        code_row = sheet[1]
        for column, raw_title in enumerate(sheet_headers):
            title = cato_title(raw_title)
            code_cell = code_row[column] if column < len(code_row) else ""
            if column <= 1 or not title or code_cell or len(title) > 90:
                continue
            if "notes" in title.lower() or title in existing_score_titles:
                continue
            item = overlay(
                f"cato_{slug(title)}_score",
                f"{title} score (Cato Institute)",
                "Freedom in the 50 States",
                "Cato Institute",
                source_url,
                f"{sheet_latest_year} {sheet_name} category score from Freedom in the 50 States.",
                value_type="number",
                textFormat="score",
                colorScheme="SpectralRedYellowBlue",
            )
            for row in sheet_latest_rows:
                state = row[0]
                fips = STATE_NAME_TO_FIPS.get(state)
                if not fips or column >= len(row):
                    continue
                value = number_or_none(row[column])
                if value is not None:
                    item["values"][fips] = {"value": value, "label": f"{value:.3f}", "state": state}
            if item["values"]:
                results.append(item)
    return results


def main():
    overlays = []
    overlays.extend(ecpm_death_penalty_overlays())
    overlays.extend(guttmacher_overlays())
    overlays.extend(crr_overlays())
    overlays.extend(cato_overlays())
    payload = {
        "generatedAt": datetime.now(timezone.utc).isoformat(),
        "projection": "EPSG:3857",
        "note": "State-level policy overlays rendered onto OpenLayers/Census Reporter vector tiles in Web Mercator.",
        "overlays": overlays,
    }
    os.makedirs(os.path.dirname(OUT_PATH), exist_ok=True)
    with open(OUT_PATH, "w", encoding="utf-8") as handle:
        json.dump(payload, handle, indent=2, ensure_ascii=False)
        handle.write("\n")
    print(f"Wrote {len(overlays)} overlays to {OUT_PATH}")


if __name__ == "__main__":
    main()
