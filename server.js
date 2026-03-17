/* Simple Express server for Render Web Service
 * - Serves static files from project root
 * - Exposes /api/config.js that injects window.GMAPS_API_KEY from env
 */
const express = require('express');
const path = require('path');

const app = express();
const ROOT_DIR = __dirname;
const PORT = process.env.PORT || 3000;

/* Inject Google Maps API key into a JS assignment before static middleware */
app.get('/api/config.js', (req, res) => {
  const key = process.env.GMAPS_API_KEY || '';
  res.type('application/javascript; charset=utf-8').send(
    `// Provided by server at ${new Date().toISOString()}
window.GMAPS_API_KEY = ${JSON.stringify(key)};`
  );
});

/* Static assets (index.html, styles.css, app.js, data/, etc.) */
app.use(express.static(ROOT_DIR, {
  extensions: ['html'], // allow / to resolve to index.html
  setHeaders: (res, filePath) => {
    // Cache only immutable assets lightly; keep HTML un-cached
    if (/\.(css|js|png|jpe?g|gif|svg|webp|ico|json)$/i.test(filePath)) {
      res.setHeader('Cache-Control', 'public, max-age=600');
    } else {
      res.setHeader('Cache-Control', 'no-cache');
    }
  }
}));


/* Fallback: serve index.html for any other GET (keeps relative asset paths working) */
app.get('*', (req, res) => {
  res.sendFile(path.join(ROOT_DIR, 'index.html'));
});

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`[map-ancona] Serving on http://localhost:${PORT}`);
});