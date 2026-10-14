# Race & ethnicity census history

Each profile's Race & Ethnicity card has previous/next controls and a year selector. The default remains the profile's current ACS estimate. Selecting a census changes only this card, not the population headline, other statistics, map layer, or profile URL. The selection is retained while that geography's profile rerenders.

## Coverage and interpretation

This is a bundled, key-free archive of **available verified records**, not a claim that every historical Census publication has been digitized here. The selector lists only years actually included for that geography. A missing year/category is not zero. Exact coverage counts by summary level and year are generated in `data/census-race-history/manifest.json`.

- Nation, regions, divisions, and states: historical tables back to the earliest year published in Census Working Paper 56 (1790 where available), followed by 2000, 2010, and 2020.
- Selected large cities: the earlier city series in Working Paper 76, followed by modern summary files. Other places generally have 1990–2020; matching places also have 1980.
- Counties: 1980–2020 where the archive has a matching code. County subdivisions, tracts, and block groups have 1990–2020 where codes match.
- ZIP Code Tabulation Areas: 2000–2020. Whole-ZCTA records are used, never just a ZCTA's state portion.
- Metropolitan areas, combined statistical areas, urban areas, school districts, legislative districts, PUMAs, and reservation/trust-land areas: only the matching published census records present in these sources. Modern metro codes are not falsely matched to the incompatible pre-2003 MSA codes.
- Custom merged urban areas are explicitly excluded from history rather than presenting one component as the combined total.

Earlier county/tract/small-place records outside these sources still need verified digitization or an additional historical extract. New and retired codes are not automatically treated as the same boundary. Selected city-name/code transitions in Working Paper 76 are explicitly noted as historical city series, not reconstructed current-boundary counts.

Historical race rows include Hispanic residents; ethnicity is displayed separately to avoid treating overlapping categories as mutually exclusive. Before 2000, many tables combine Asian/Pacific Islander populations and do not have the modern multiple-race category. Historical classification, territorial extent, and population exclusions differ substantially. Source links and comparability notes stay beside the chart.

The 1970 Hispanic-origin figures come from the 5% sample when available and use the sample's denominator or published percentage. They are labeled separately from full-count race totals. Earlier Hispanic-origin proxies retain the source's historical definition. Alaska's 1929 and 1939 enumerations retain their actual years. Alaska/Hawaii's transposed pre-1960 tables are parsed separately, including their historical race categories.

## Sources

- [Census Working Paper 56: nation, regions, divisions, states](https://www.census.gov/library/working-papers/2002/demo/POP-twps0056.html), individual `tableNN.xlsx` tables.
- [Census Working Paper 76: selected cities](https://www.census.gov/library/working-papers/2005/demo/POP-twps0076.html), state `xxTab.xls` tables.
- [1990 STF1A ASCII state archives](https://www2.census.gov/census_1990/STF1A_ASCII/), all archive parts, first logical segment, full-geography/total-population records. Race P6, Hispanic origin P8, non-Hispanic White P10.
- [2000 Summary File 1](https://www2.census.gov/census_2000/datasets/Summary_File_1/), geographic header plus segment 01: P3 and P4. State files provide tract/block-group coverage.
- [2010 Summary File 1](https://www2.census.gov/census_2010/04-Summary_File_1/), national geographic header and segment 03: P3, P4, P5; Urban/Rural Update for urban areas.
- [2020 Demographic and Housing Characteristics File](https://www2.census.gov/programs-surveys/decennial/2020/data/demographic-and-housing-characteristics-file/), national geographic header and segment 05: P3, P4, P5.
- [Missouri Census Data Center](https://mcdc.missouri.edu/applications/uexplore.html), a Census State Data Center partner: `dhc2020x`, `sf12010x`, `census_2000/sf12000x`, `census_1990/stf901x2`, and full-count `census_1980/stf801`. These add detailed-geography extracts and the older STF1 national file.

## Rebuilding and validation

Run `python scripts/generate-census-race-history.py` with pandas, openpyxl, and xlrd. The first run downloads substantial public source archives; subsequent runs reuse `reports/census-history-cache/`. The optional project-local `reports/census-import-deps/` is supported for xlrd. Neither folder belongs in deployment or source control. No API key, login, or runtime external data service is needed for historical charts.

`--refresh-archives` reuses generated modern extracts while refreshing official files and historical tables. `--refresh-tables` reuses the summary files and refreshes only the older workbooks. `--small` is a development subset and must not replace the full production dataset.

National ZIP members are retrieved using ordinary HTTP byte ranges and verified against their ZIP CRC, avoiding multi-gigabyte downloads of unrelated tables. The generator reconciles official race-category sums against each record's total population.

The version-1 manifest describes packed record fields. Records may include an optional metadata object after those fields for sample universes and historical notes. Tract/block-group files are sharded by county; other files use the first two geography-code characters (or `us` for the nation). Requests are deduplicated, failed requests can be retried, and stale responses cannot overwrite another profile.

Run `npm run test:map` to check navigation, isolated rerenders, failures/retries, missing categories, sample denominators, known historical totals, every generated record, and every HTML entry point.

Run `npm run test:census-importer` to check the source-file layouts, multi-part 1990 archives, whole-geography filtering, ambiguous place-name handling, and early tables whose columns have different meanings.
