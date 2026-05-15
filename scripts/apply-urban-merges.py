import json
import math
from copy import deepcopy
from datetime import datetime, timezone
from pathlib import Path

try:
    from shapely.geometry import mapping, shape
    from shapely.ops import unary_union
    from shapely.validation import make_valid
except Exception:  # pragma: no cover - fallback keeps the script usable without shapely
    mapping = None
    shape = None
    unary_union = None
    make_valid = None


ROOT = Path(__file__).resolve().parents[1]
AREAS_PATH = ROOT / "data" / "urban-areas.json"
BOUNDARIES_PATH = ROOT / "data" / "urban-area-boundaries.json"
SQUARE_METERS_PER_SQUARE_MILE = 2_589_988.110336

MERGE_GROUPS = [
    {
        "geoid": "40000USBA001",
        "tigerGeoid": "BA001",
        "name": "San Francisco Urban Area",
        "components": [
            "40000US78904",  # San Francisco--Oakland
            "40000US79039",  # San Jose
            "40000US19504",  # Concord--Walnut Creek
            "40000US50533",  # Livermore--Pleasanton--Dublin
            "40000US90028",  # Vallejo
            "40000US02683",  # Antioch
            "40000US36271",  # Half Moon Bay
            "40000US24256",  # Discovery Bay
        ],
    },
    {
        "geoid": "40000US63217",
        "tigerGeoid": "63217",
        "name": "New York Urban Area",
        "components": [
            "40000US63217",  # New York--Jersey City--Newark
            "40000US75313",  # Riverhead
            "40000US25658",  # East Hampton North
            "40000US58420",  # Montauk
        ],
    },
    {
        "geoid": "40000USLA001",
        "tigerGeoid": "LA001",
        "name": "Los Angeles Urban Area",
        "components": [
            "40000US51445",  # Los Angeles--Long Beach--Anaheim
            "40000US75340",  # Riverside--San Bernardino
            "40000US57709",  # Mission Viejo--Lake Forest--Laguna Niguel
            "40000US87004",  # Temecula--Murrieta--Menifee
            "40000US38215",  # Hemet
            "40000US87490",  # Thousand Oaks
            "40000US82144",  # Simi Valley
            "40000US79309",  # Santa Clarita
            "40000US66673",  # Oxnard--San Buenaventura
            "40000US12754",  # Camarillo
        ],
    },
    {
        "geoid": "40000USCHI01",
        "tigerGeoid": "CHI01",
        "name": "Chicago Urban Area",
        "components": [
            "40000US16264",  # Chicago
            "40000US76474",  # Round Lake Beach--McHenry--Grayslake
        ],
    },
    {
        "geoid": "40000USDAL01",
        "tigerGeoid": "DAL01",
        "name": "Dallas Urban Area",
        "components": [
            "40000US22042",  # Dallas--Fort Worth--Arlington
            "40000US52695",  # McKinney--Frisco
            "40000US23500",  # Denton--Lewisville
            "40000US23513",  # Denton Southwest
            "40000US57034",  # Midlothian
            "40000US30439",  # Forney
            "40000US87166",  # Terrell
            "40000US17533",  # Cleburne
            "40000US37980",  # Heartland
        ],
    },
    {
        "geoid": "40000USHOU01",
        "tigerGeoid": "HOU01",
        "name": "Houston Urban Area",
        "components": [
            "40000US40429",  # Houston
            "40000US87300",  # The Woodlands--Conroe
            "40000US46639",  # Lake Conroe Eastshore
            "40000US46666",  # Lake Conroe Westshore
        ],
    },
    {
        "geoid": "40000US23824",
        "tigerGeoid": "23824",
        "name": "Detroit Urban Area",
        "components": [
            "40000US23824",  # Detroit
            "40000US83332",  # South Lyon--Hamburg--Genoa
        ],
    },
    {
        "geoid": "40000US17668",
        "tigerGeoid": "17668",
        "name": "Cleveland Urban Area",
        "components": [
            "40000US17668",  # Cleveland
            "40000US51364",  # Lorain--Elyria
        ],
    },
    {
        "geoid": "40000US03817",
        "tigerGeoid": "03817",
        "name": "Atlanta Urban Area",
        "components": [
            "40000US03817",  # Atlanta
            "40000US32194",  # Gainesville
            "40000US96130",  # Winder
        ],
    },
    {
        "geoid": "40000US77770",
        "tigerGeoid": "77770",
        "name": "St. Louis Urban Area",
        "components": [
            "40000US77770",  # St. Louis
            "40000US01765",  # Alton
        ],
    },
    {
        "geoid": "40000US80389",
        "tigerGeoid": "80389",
        "name": "Seattle Urban Area",
        "components": [
            "40000US80389",  # Seattle--Tacoma
            "40000US09946",  # Bremerton
            "40000US65242",  # Olympia--Lacey
            "40000US55333",  # Marysville
            "40000US58369",  # Monroe
            "40000US25237",  # Duvall
            "40000US82675",  # Snoqualmie
            "40000US63514",  # North Bend
            "40000US85573",  # Sultan
            "40000US34470",  # Granite Falls
            "40000US81415",  # Shelton
            "40000US97642",  # Yelm
        ],
    },
    {
        "geoid": "40000US69184",
        "tigerGeoid": "69184",
        "name": "Phoenix Urban Area",
        "components": [
            "40000US69184",  # Phoenix--Mesa--Scottsdale
            "40000US69192",  # Phoenix West--Goodyear--Avondale
            "40000US68499",  # Peoria
            "40000US11134",  # Buckeye
            "40000US11139",  # Buckeye North
            "40000US33960",  # Goodyear South
            "40000US30073",  # Florence West
            "40000US29980",  # Florence East
            "40000US75092",  # Rio Verde
            "40000US33742",  # Gold Canyon
        ],
    },
    {
        "geoid": "40000US23527",
        "tigerGeoid": "23527",
        "name": "Denver Urban Area",
        "components": [
            "40000US23527",  # Denver--Aurora
            "40000US46126",  # Lafayette--Erie--Louisville
            "40000US09298",  # Boulder
            "40000US30755",  # Fort Lupton
            "40000US76528",  # Roxborough Park
            "40000US28441",  # Evergreen
            "40000US14563",  # Castle Rock
            "40000US87269",  # The Pinery
            "40000US29775",  # Firestone--Frederick
            "40000US51175",  # Longmont
        ],
    },
    {
        "geoid": "40000US78499",
        "tigerGeoid": "78499",
        "name": "Salt Lake City Urban Area",
        "components": [
            "40000US78499",  # Salt Lake City
            "40000US72559",  # Provo--Orem
            "40000US64945",  # Ogden--Layton
            "40000US25480",  # Eagle Mountain
            "40000US10243",  # Brigham City
            "40000US68170",  # Payson--Santaquin
        ],
    },
]

DISPLAY_NAME_OVERRIDES = {
    "40000US51755": "Louisville Urban Area",
    "40000US61273": "Nashville Urban Area",
}


def round_or_none(value, places=1):
    if value is None or not math.isfinite(value):
        return None
    return round(value, places)


def simple_urban_name(name):
    base = str(name or "").replace(" Urban Area", "")
    first = base.split("--", 1)[0].split(",", 1)[0].strip()
    return f"{first} Urban Area" if first else name


def display_urban_name(area):
    return DISPLAY_NAME_OVERRIDES.get(area.get("geoid")) or simple_urban_name(area.get("name"))


def apply_display_names(areas_payload, boundaries):
    areas_by_geoid = {}
    for area in areas_payload.get("areas", []):
        name = DISPLAY_NAME_OVERRIDES.get(area.get("geoid"))
        if not name:
            continue
        area.setdefault("originalName", area.get("name"))
        area["name"] = name
        area.setdefault("aliases", [])
        area["aliases"] = sorted({*area["aliases"], area.get("originalName"), area.get("tigerName")})
        areas_by_geoid[area["geoid"]] = area

    for feature in boundaries.get("features", []):
        geoid = f"40000US{feature.get('properties', {}).get('GEOID')}"
        area = areas_by_geoid.get(geoid)
        if area:
            feature.setdefault("properties", {})["NAME"] = area["name"]

    return bool(areas_by_geoid)


def weighted_average(areas, key, weight_key):
    total = 0
    weighted = 0
    for area in areas:
        value = area.get("metrics", {}).get(key)
        weight = area.get("metrics", {}).get(weight_key)
        if value is None or weight is None:
            continue
        total += weight
        weighted += value * weight
    return None if total <= 0 else weighted / total


def sum_metric(areas, key):
    values = [area.get("metrics", {}).get(key) for area in areas]
    numeric = [value for value in values if isinstance(value, (int, float))]
    return sum(numeric) if numeric else None


def merge_metrics(areas):
    population = sum_metric(areas, "population")
    households = sum_metric(areas, "households")
    housing_units = sum_metric(areas, "housingUnits")
    poverty_count = sum_metric(areas, "povertyCount")
    foreign_born = sum_metric(areas, "foreignBorn")
    workers = sum_metric(areas, "workers")
    male = sum_metric(areas, "male")
    female = sum_metric(areas, "female")

    race_counts = {}
    for key in ["white", "black", "native", "asian", "pacific", "other", "multiracial", "hispanic"]:
        total = 0
        for area in areas:
            share = area.get("metrics", {}).get("race", {}).get(key)
            pop = area.get("metrics", {}).get("population")
            if share is not None and pop is not None:
                total += pop * share / 100
        race_counts[key] = total

    return {
        "population": round(population) if population is not None else None,
        "medianAge": round_or_none(weighted_average(areas, "medianAge", "population"), 1),
        "male": round(male) if male is not None else None,
        "female": round(female) if female is not None else None,
        "perCapitaIncome": round_or_none(weighted_average(areas, "perCapitaIncome", "population"), 0),
        "medianHouseholdIncome": round_or_none(weighted_average(areas, "medianHouseholdIncome", "households"), 0),
        "povertyRate": round_or_none((poverty_count / population) * 100 if poverty_count is not None and population else None, 1),
        "povertyCount": round(poverty_count) if poverty_count is not None else None,
        "households": round(households) if households is not None else None,
        "personsPerHousehold": round_or_none(population / households if population and households else None, 2),
        "housingUnits": round(housing_units) if housing_units is not None else None,
        "medianHomeValue": round_or_none(weighted_average(areas, "medianHomeValue", "housingUnits"), 0),
        "highSchoolRate": round_or_none(weighted_average(areas, "highSchoolRate", "population"), 1),
        "bachelorsRate": round_or_none(weighted_average(areas, "bachelorsRate", "population"), 1),
        "foreignBornRate": round_or_none((foreign_born / population) * 100 if foreign_born is not None and population else None, 1),
        "foreignBorn": round(foreign_born) if foreign_born is not None else None,
        "workers": round(workers) if workers is not None else None,
        "commuteUnder30Rate": round_or_none(weighted_average(areas, "commuteUnder30Rate", "workers"), 1),
        "race": {
            key: round_or_none((count / population) * 100 if population else None, 1)
            for key, count in race_counts.items()
        },
    }


def merge_center(areas):
    weighted_lon = 0
    weighted_lat = 0
    total = 0
    for area in areas:
        center = area.get("center") or []
        population = area.get("metrics", {}).get("population")
        if len(center) >= 2 and population:
            weighted_lon += center[0] * population
            weighted_lat += center[1] * population
            total += population
    if total <= 0:
        return areas[0].get("center")
    return [round(weighted_lon / total, 7), round(weighted_lat / total, 7)]


def primary_area(areas):
    return max(areas, key=lambda area: area.get("metrics", {}).get("population") or 0)


def combine_geometry(features):
    geometries = [feature.get("geometry") for feature in features if feature.get("geometry")]
    if not geometries:
        return None

    if shape and unary_union and mapping:
        shaped = []
        for geometry in geometries:
            item = shape(geometry)
            if not item.is_valid:
                item = make_valid(item) if make_valid else item.buffer(0)
            shaped.append(item)
        union = unary_union(shaped)
        return mapping(union)

    polygons = []
    for geometry in geometries:
        if geometry.get("type") == "Polygon":
            polygons.append(geometry.get("coordinates", []))
        elif geometry.get("type") == "MultiPolygon":
            polygons.extend(geometry.get("coordinates", []))
    return {"type": "MultiPolygon", "coordinates": polygons}


def merged_area_from_components(group, components):
    land = sum((area.get("landSquareMiles") or 0) for area in components)
    metrics = merge_metrics(components)
    population = metrics.get("population")
    primary = primary_area(components)
    aliases = []
    for area in components:
        aliases.extend([area.get("name"), area.get("tigerName"), simple_urban_name(area.get("name"))])

    return {
        "geoid": group["geoid"],
        "tigerGeoid": group["tigerGeoid"],
        "name": group["name"],
        "tigerName": group["name"],
        "center": merge_center(components),
        "landSquareMiles": round_or_none(land, 1),
        "density": round_or_none(population / land if population and land else None, 1),
        "metrics": metrics,
        "hasCensusReporterData": False,
        "isMergedUrbanArea": True,
        "componentGeoids": group["components"],
        "componentNames": [area["name"] for area in components],
        "primaryGeoid": primary.get("geoid"),
        "primaryName": primary.get("name"),
        "aliases": sorted({alias for alias in aliases if alias}),
    }


def update_existing_merged_area(group, area):
    updated = deepcopy(area)
    updated["name"] = group["name"]
    updated["tigerName"] = group["name"]
    updated["isMergedUrbanArea"] = True
    updated["hasCensusReporterData"] = False
    updated["componentGeoids"] = group["components"]
    updated.setdefault("primaryGeoid", group["components"][0])
    updated.setdefault("primaryName", (updated.get("componentNames") or [updated.get("name")])[0])
    updated.setdefault("componentNames", [])
    updated.setdefault("aliases", [])
    updated["aliases"] = sorted({*updated["aliases"], area.get("name"), area.get("tigerName"), group["name"]})
    return updated


def extend_existing_merged_area(group, existing_area, new_components):
    merged = merged_area_from_components(group, [existing_area, *new_components])
    existing_names = existing_area.get("componentNames") or [existing_area.get("name")]
    new_names = [area.get("name") for area in new_components]
    aliases = set(merged.get("aliases") or [])
    aliases.update(existing_area.get("aliases") or [])
    aliases.update([existing_area.get("name"), existing_area.get("tigerName")])
    for area in new_components:
        aliases.update([area.get("name"), area.get("tigerName"), simple_urban_name(area.get("name"))])

    merged["componentNames"] = list(dict.fromkeys([name for name in [*existing_names, *new_names] if name]))
    merged["primaryGeoid"] = existing_area.get("primaryGeoid") or existing_area.get("geoid")
    merged["primaryName"] = existing_area.get("primaryName") or existing_area.get("name")
    merged["aliases"] = sorted({alias for alias in aliases if alias})
    return merged


def merged_feature_from_components(group, component_features):
    geometry = combine_geometry(component_features)
    if not geometry:
        return None
    return {
        "type": "Feature",
        "geometry": geometry,
        "properties": {
            "GEOID": group["tigerGeoid"],
            "NAME": group["name"],
            "full_geoid": group["geoid"],
            "COMPONENT_GEOIDS": ",".join(group["components"]),
        },
    }


def update_existing_merged_feature(group, feature):
    updated = deepcopy(feature)
    updated.setdefault("properties", {})
    updated["properties"]["GEOID"] = group["tigerGeoid"]
    updated["properties"]["NAME"] = group["name"]
    updated["properties"]["full_geoid"] = group["geoid"]
    updated["properties"]["COMPONENT_GEOIDS"] = ",".join(group["components"])
    return updated


def extend_existing_merged_feature(group, existing_feature, new_component_features):
    merged = merged_feature_from_components(group, [existing_feature, *new_component_features])
    return merged or update_existing_merged_feature(group, existing_feature)


def main():
    areas_payload = json.loads(AREAS_PATH.read_text(encoding="utf-8"))
    boundaries = json.loads(BOUNDARIES_PATH.read_text(encoding="utf-8"))
    areas_by_geoid = {area["geoid"]: area for area in areas_payload["areas"]}
    features_by_geoid = {
        f"40000US{feature.get('properties', {}).get('GEOID')}": feature
        for feature in boundaries.get("features", [])
    }

    merged_areas = []
    merged_features = []
    consumed_component_geoids = set()
    generated_merge_geoids = set()

    for group in MERGE_GROUPS:
        components = [areas_by_geoid[geoid] for geoid in group["components"] if geoid in areas_by_geoid]
        all_components_available = len(components) == len(group["components"])

        if all_components_available:
            component_features = [
                features_by_geoid[geoid] for geoid in group["components"] if geoid in features_by_geoid
            ]
            merged_areas.append(merged_area_from_components(group, components))
            merged_feature = merged_feature_from_components(group, component_features)
            if merged_feature:
                merged_features.append(merged_feature)
            consumed_component_geoids.update(group["components"])
            generated_merge_geoids.add(group["geoid"])
            continue

        existing_area = areas_by_geoid.get(group["geoid"])
        if existing_area:
            existing_feature = features_by_geoid.get(group["geoid"])
            new_components = [area for area in components if area.get("geoid") != group["geoid"]]
            new_component_features = [
                features_by_geoid[area["geoid"]]
                for area in new_components
                if area["geoid"] in features_by_geoid
            ]

            if new_components:
                merged_areas.append(extend_existing_merged_area(group, existing_area, new_components))
                if existing_feature:
                    merged_features.append(extend_existing_merged_feature(group, existing_feature, new_component_features))
                consumed_component_geoids.update(area["geoid"] for area in new_components)
            else:
                merged_areas.append(update_existing_merged_area(group, existing_area))
                if existing_feature:
                    merged_features.append(update_existing_merged_feature(group, existing_feature))
            generated_merge_geoids.add(group["geoid"])
            continue

        missing = ", ".join(geoid for geoid in group["components"] if geoid not in areas_by_geoid)
        raise KeyError(f"Cannot build {group['name']}; missing component urban areas: {missing}")

    renamed_areas = []
    for area in areas_payload["areas"]:
        if area["geoid"] in consumed_component_geoids or area["geoid"] in generated_merge_geoids:
            continue
        renamed = deepcopy(area)
        renamed["originalName"] = area.get("name")
        renamed["name"] = display_urban_name(area)
        renamed.setdefault("aliases", [])
        renamed["aliases"] = sorted({*renamed["aliases"], area.get("name"), area.get("tigerName")})
        renamed_areas.append(renamed)

    renamed_areas.extend(merged_areas)
    renamed_areas.sort(key=lambda area: area.get("metrics", {}).get("population") or 0, reverse=True)
    areas_payload["areas"] = renamed_areas
    areas_payload["count"] = len(renamed_areas)
    areas_payload["generatedAt"] = datetime.now(timezone.utc).isoformat()
    areas_payload.setdefault("source", {})["localMerges"] = "scripts/apply-urban-merges.py"
    areas_payload["mergedUrbanAreas"] = [
        {
            "geoid": group["geoid"],
            "name": group["name"],
            "components": group["components"],
        }
        for group in MERGE_GROUPS
    ]

    filtered_features = [
        feature
        for feature in boundaries.get("features", [])
        if f"40000US{feature.get('properties', {}).get('GEOID')}" not in consumed_component_geoids
        and f"40000US{feature.get('properties', {}).get('GEOID')}" not in generated_merge_geoids
    ]
    for feature in filtered_features:
        geoid = f"40000US{feature.get('properties', {}).get('GEOID')}"
        area = next((item for item in renamed_areas if item["geoid"] == geoid), None)
        if area:
            feature.setdefault("properties", {})["NAME"] = area["name"]
    boundaries["features"] = filtered_features + merged_features

    AREAS_PATH.write_text(json.dumps(areas_payload, separators=(",", ":")) + "\n", encoding="utf-8")
    BOUNDARIES_PATH.write_text(json.dumps(boundaries, separators=(",", ":")) + "\n", encoding="utf-8")
    print(f"Wrote {len(renamed_areas)} urban areas and {len(boundaries['features'])} boundaries")


if __name__ == "__main__":
    main()
