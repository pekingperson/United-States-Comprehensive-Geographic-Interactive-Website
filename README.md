# United States Comprehensive Geographic Interactive Website

Interactive United States geography viewer combining Census Reporter profiles, Census Dots population tiles, Opportunity Atlas overlays, policy overlays, and expanded local profile data.

## Open The Website

After this repository is published with GitHub Pages, open:

https://pekingperson.github.io/United-States-Comprehensive-Geographic-Interactive-Website/

The GitHub Pages version runs as a static website. The local server version enables the full proxy-backed experience, including Census Reporter base tiles, live school/offical lookup endpoints, and optional Google Maps satellite/3D tiles.

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
