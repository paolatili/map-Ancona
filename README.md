# Ancona → UNIVPM map (transit route + highlighted places)

Small static web app showing:
- A Google map of Ancona
- Transit directions from the city center to Università Politecnica delle Marche on Via Brecce Bianche
- Preference for bus lines 46 or 1/4 when available
- Example restaurants/bars/cafés as markers with category toggles

## Preview

- Left panel: choose origin, set route preference, toggle categories, and open the same trip in Google Maps
- Right: interactive Google Map with the chosen route (preferred route in bold color, alternatives in lighter color)

Use any static HTTP server (avoid file://). For example with Python:
```
python3 -m http.server 8000
```
Then open:
```
http://localhost:8000/
```

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

lsof -ti:8000 | xargs kill -9; cd /Users/paolatili/PycharmProjects/map && python3 -m http.server 8000
