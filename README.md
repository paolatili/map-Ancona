# Ancona → UNIVPM map (transit route + highlighted places)

Small static web app showing:
- A Google map of Ancona
- Transit directions from the city center to Università Politecnica delle Marche on Via Brecce Bianche
- Preference for bus lines 46 or 1/4 when available
- Example restaurants/bars/cafés as markers with category toggles

## Preview

- Left panel: choose origin, set route preference, toggle categories, and open the same trip in Google Maps
- Right: interactive Google Map with the chosen route (preferred route in bold color, alternatives in lighter color)

## Requirements

- A Google Maps JavaScript API key with billing enabled
  - Enable “Maps JavaScript API” in Google Cloud Console
  - Restrict the key by HTTP referrer (e.g., http://localhost:8000 and your production domain)

## Setup

1) Copy the example config and add your API key:
```
cp config.js config.js
# then edit config.js and paste your key
```

2) Optional: update the destination if desired  
The app targets: “Via Brecce Bianche, 60131 Ancona (Università Politecnica delle Marche)”.

3) Optional: update example places  
Edit `data/pois.json` (array of objects):
```json
[
  {
    "name": "Place name",
    "category": "Restaurant | Bar | Cafe",
    "address": "Street, CAP Ancona",
    "description": "Short description",
    "link": "https://example.com (optional)",
    "lat": 43.6,          // optional if you provide address
    "lng": 13.5           // optional if you provide address
  }
]
```
- If `lat`/`lng` are provided, they are used directly. Otherwise, the app geocodes `address` (counts toward API usage).
- Categories control marker color and visibility toggles.

## Run locally

Use any static HTTP server (avoid file://). For example with Python:
```
python3 -m http.server 8000
```
Then open:
```
http://localhost:8000/
```

If you haven’t added an API key, the page will show a notice and a “View in Google Maps” button still works.

## Using the app

- Origin selector: defaults to “Piazza Cavour”. You can switch to “Stazione Ancona” or “Piazza Roma”.
- Prefer route: “Prefer bus 46” or “Prefer bus 1/4” tries to pick an alternative that includes that line if available.
- Directions list: shows walking and bus steps with stops and headsigns.
- View in Google Maps: opens the same trip in Google Maps with “Transit” and “Bus” preselected.
- Categories: toggle markers for Restaurants, Bars, Cafés.

## Notes and behavior

- The app asks Google Directions for transit with bus mode and alternative routes.
- It parses route steps to detect lines “46” and “1/4”:
  - If you set a preference, it picks the first route containing that line.
  - Otherwise it prefers routes containing 46, then containing 1/4, else falls back to the first route.
- Preferred route is drawn thicker and in color (blue/green), alternatives thinner and gray.
- If Directions returns no routes, the side panel indicates that and you can use the “View in Google Maps” link.

## Deployment

- Works on any static host (e.g., GitHub Pages, Netlify, Vercel static, simple Nginx/Apache).
- Make sure your API key’s referrer restrictions include the deployed domain (e.g., https://yourdomain/*).

## Security

- Do not commit your real `config.js`. Consider adding it to `.gitignore`.
- Lock down the key to development and production domains only.

## Project structure

```
.
├─ index.html         # UI skeleton and containers
├─ styles.css         # Layout and basic theming
├─ app.js             # Map, directions, POIs, UI bindings
├─ config.js  # Template for your API key
├─ config.js          # (ignored) your real API key (create from example)
└─ data/
   └─ pois.json       # Example places (replace with your list)
```

## Troubleshooting

- Blank map + notice: you likely didn’t set `config.js` or the key is invalid.
- “Failed to load Google Maps API”: check network, API key validity, and referrer restrictions.
- Markers not showing for an address: try adding `lat`/`lng` directly or verify the address text.
- Directions differ from expected lines: the app can’t force “46”/“1/4” but will prefer those if alternatives include them. Use the “View in Google Maps” link for live schedules.


lsof -ti:8000 | xargs kill -9; cd /Users/paolatili/PycharmProjects/map && python3 -m http.server 8000
