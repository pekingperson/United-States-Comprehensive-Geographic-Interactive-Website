# Reliable Census profiles

## Failure and fix

The shared profile loader previously depended entirely on `api.censusreporter.org` for every non-urban geography. During the October 14 investigation, that service returned HTTP 403 and 429 responses without `Access-Control-Allow-Origin`. Browsers reported these as `Failed to fetch`, and the app discarded the entire profile.

Profiles now load the committed `data/census-profiles/` archive first. This works on ordinary static hosting, including GitHub Pages; no API key, third-party proxy, or server is required for profile statistics. The live Census Reporter loader remains a fallback when a saved record is missing or a local file cannot load. Optional officials/school-detail failures can no longer replace valid Census statistics with an error page.

## Data and coverage

The archive contains **461,012 profiles in 7,340 small shards**, approximately 163 MB total. A visitor downloads the index and only the shard needed for the selected geography, not the whole dataset. The browser keeps a bounded cache and deduplicates simultaneous requests. Failed or malformed files are evicted so retrying can recover.

All estimates use **ACS 2024 5-year (2020–2024)**, explicitly labeled in the profile and race/ethnicity selector. This pins the default profile to a consistent published release instead of relying on the remote API's changing `latest` selection. Historical census navigation remains independent. Existing custom merged-urban-area calculations are retained.

Sources:

- [U.S. Census Bureau ACS 2024 table-based Summary File](https://www2.census.gov/programs-surveys/acs/summary_file/2024/table-based-SF/).
- [Geography names and identifiers](https://www2.census.gov/programs-surveys/acs/summary_file/2024/table-based-SF/documentation/Geos20245YR.txt).
- [Official 5-year estimate tables](https://www2.census.gov/programs-surveys/acs/summary_file/2024/table-based-SF/data/5YRData/).

Included summary levels: nation, region, division, state, county, county subdivision, place, metro/micro area, combined statistical area, urban area, congressional district, both state legislative chambers, ZIP tabulation area, tract, block group, PUMA, reservation, and elementary/secondary/unified school districts.

The archive stores the estimate columns used by this app, not complete tables or margins of error. Unpublished tables, blank cells, and Census negative suppression codes remain unavailable; they are never replaced with zero or another geography's values. Genuine zeros remain zero. Other Census vintages are never merged into a saved record. Boundaries and optional third-party details have separate loaders and still require their respective services.

## Refresh and validation

```powershell
npm run census-profile-data
npm run test:map
```

The generator streams official bulk files with at most two downloads at once, caches inputs in ignored `reports/census-profile-cache/`, and rejects missing columns and duplicate geographies. `manifest.json` records the release, source, selected columns, shard list, and coverage counts. Regenerate and ship the manifest and shards together; update the dataset version in the helper and HTML entry points when changing a published dataset.

Regression tests cover every saved record, all profile variables, all mapped geography types, suppressed/zero values, malformed files, interrupted downloads, API outages, and optional-details isolation. Browser checks cover Cupertino and one profile from each of the 19 map boundary types, plus historical census arrows without changes to other sections.
