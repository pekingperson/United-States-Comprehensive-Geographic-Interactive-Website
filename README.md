# United States Comprehensive Geographic Interactive Website

Interactive United States geography viewer combining Census Reporter profiles, Census Dots population tiles, Opportunity Atlas overlays, policy overlays, and expanded local profile data.

## Open The Website

After this repository is published with GitHub Pages, open:

https://pekingperson.github.io/United-States-Comprehensive-Geographic-Interactive-Website/

The GitHub Pages version runs as a static website with Esri's public World Light Gray base and reference tiles. The map background and place labels do not require an API key. The local server version enables the full proxy-backed experience, including Census Reporter base tiles, live school/offical lookup endpoints, and optional Google Maps satellite/3D tiles.

## Ancestry Overlay

Select **Ancestry → An American Mosaic** in the Opportunity Atlas overlay dropdown. The map shows the most commonly reported detailed ancestry or identity, with county colors at national zoom and census tract detail when zoomed in. Click a tract for its full list of nonzero estimates, percentages, and identity search.

The overlay uses 2024 ACS 5-year data in Web Mercator with 13 regional colors. American is grouped with Northern & Western Europe. East Asia and Southeast Asia are separate; Vietnamese is grouped with East Asia. Estimates can overlap, so percentages do not sum to 100%.

The national index and all 52 state breakdown files are bundled for GitHub Pages. Refresh them with `npm run ancestry-data`.

Boundary polygons use vector rendering to stay sharp while zooming. If Census Reporter tiles are unavailable or rate-limited, the overlay loads matching ACS 2024 boundaries directly from Census TIGERweb. Run `npm run test:map` for loading/projection regression checks. For a visual fallback check, serve the project locally and open `tests/boundary-fallback.html`, which deliberately uses an unavailable primary tile URL.

## Run Locally

Install Node.js, then run:

```powershell
npm run serve
```

Open:

```text
http://127.0.0.1:4173
```

## Optional Google Maps Views

Google Satellite and Google 3D require a Google Maps Platform key with Map Tiles API access. Start the local server with:

```powershell
$env:GOOGLE_MAPS_API_KEY="your-key-here"
npm run serve
```

Do not commit `.env` files or API keys to this repository.

## Data Refresh

Regenerate Census Reporter urban-area data and merged urban areas with:

```powershell
npm run data
```

The generated `data/` files are committed so the website can open without running the data build step.

## School District Data

School district profiles use the committed manual cache first, then official public data from the Urban Institute Education Data API. Those official fields come from NCES CCD, CRDC, EDFacts, and SAIPE datasets. Niche and US News profile links are shown for current third-party ratings and rankings; their proprietary grade/review/ranking tables should only be added to the manual cache when licensed or manually verified for reuse.
