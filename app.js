/* =========================================================
   Ancona Explorer — app.js
   - Three.js animated particle/star background
   - Google Maps with dark/light style + transit routing
   - Geolocation support for origin
   - POI cards and markers by category (places + attractions)
   - Tab navigation: Route / Places / Sights
   - Light / Dark theme toggle
   ========================================================= */

(function () {
  'use strict';

  /* ────── Constants ────── */
  const DESTINATION_TEXT = 'Universita\' Ingegneria, 60131 Ancona AN, Italy';
  const DEFAULT_CENTER   = { lat: 43.612, lng: 13.512 };
  const DEFAULT_ZOOM     = 14;

  /* ── Dark map style ── */
  const MAP_STYLE_DARK = [
    { elementType: 'geometry',   stylers: [{ color: '#0d1b2e' }] },
    { elementType: 'labels.text.fill',   stylers: [{ color: '#7fa1c3' }] },
    { elementType: 'labels.text.stroke', stylers: [{ color: '#0d1b2e' }] },
    { featureType: 'road', elementType: 'geometry', stylers: [{ color: '#1e3050' }] },
    { featureType: 'road', elementType: 'geometry.stroke', stylers: [{ color: '#152844' }] },
    { featureType: 'road', elementType: 'labels.text.fill', stylers: [{ color: '#5a8cbf' }] },
    { featureType: 'road.highway', elementType: 'geometry', stylers: [{ color: '#1f4a80' }] },
    { featureType: 'road.highway', elementType: 'geometry.stroke', stylers: [{ color: '#0f2944' }] },
    { featureType: 'road.highway', elementType: 'labels.text.fill', stylers: [{ color: '#8ab4d8' }] },
    { featureType: 'water', elementType: 'geometry', stylers: [{ color: '#0a1929' }] },
    { featureType: 'water', elementType: 'labels.text.fill', stylers: [{ color: '#2a5a80' }] },
    { featureType: 'poi',  elementType: 'labels.icon', stylers: [{ visibility: 'off' }] },
    { featureType: 'poi',  elementType: 'labels.text', stylers: [{ visibility: 'off' }] },
    { featureType: 'poi',  elementType: 'geometry', stylers: [{ color: '#0e2040' }] },
    { featureType: 'poi.business', stylers: [{ visibility: 'off' }] },
    { featureType: 'poi.attraction', stylers: [{ visibility: 'off' }] },
    { featureType: 'poi.government', stylers: [{ visibility: 'off' }] },
    { featureType: 'poi.medical', stylers: [{ visibility: 'off' }] },
    { featureType: 'poi.place_of_worship', stylers: [{ visibility: 'off' }] },
    { featureType: 'poi.school', stylers: [{ visibility: 'off' }] },
    { featureType: 'poi.sports_complex', stylers: [{ visibility: 'off' }] },
    { featureType: 'poi.park', elementType: 'geometry', stylers: [{ color: '#0a2a1a' }] },
    { featureType: 'poi.park', elementType: 'labels.text.fill', stylers: [{ color: '#2a6a4a' }] },
    { featureType: 'poi.park', elementType: 'labels.icon', stylers: [{ visibility: 'off' }] },
    { featureType: 'transit', elementType: 'geometry', stylers: [{ color: '#10233a' }] },
    { featureType: 'transit.station', elementType: 'labels.text.fill', stylers: [{ color: '#4a8fba' }] },
    { featureType: 'landscape', elementType: 'geometry', stylers: [{ color: '#0d1b2e' }] },
    { featureType: 'administrative', elementType: 'geometry', stylers: [{ color: '#1a3558' }] },
    { featureType: 'administrative', elementType: 'labels.text.fill', stylers: [{ color: '#6a9fc0' }] },
    { featureType: 'administrative.country', elementType: 'labels.text.fill', stylers: [{ color: '#9db8cf' }] },
  ];

  /* ── Light map style ── */
  const MAP_STYLE_LIGHT = [
    { elementType: 'geometry', stylers: [{ color: '#f5f7fa' }] },
    { elementType: 'labels.text.fill', stylers: [{ color: '#5a6a7a' }] },
    { elementType: 'labels.text.stroke', stylers: [{ color: '#f5f7fa' }] },
    { featureType: 'road', elementType: 'geometry', stylers: [{ color: '#ffffff' }] },
    { featureType: 'road', elementType: 'geometry.stroke', stylers: [{ color: '#dde4ee' }] },
    { featureType: 'road', elementType: 'labels.text.fill', stylers: [{ color: '#6a7a8a' }] },
    { featureType: 'road.highway', elementType: 'geometry', stylers: [{ color: '#e8eef8' }] },
    { featureType: 'road.highway', elementType: 'geometry.stroke', stylers: [{ color: '#c8d4e8' }] },
    { featureType: 'road.highway', elementType: 'labels.text.fill', stylers: [{ color: '#555555' }] },
    { featureType: 'water', elementType: 'geometry', stylers: [{ color: '#a8d4f0' }] },
    { featureType: 'water', elementType: 'labels.text.fill', stylers: [{ color: '#4a88aa' }] },
    { featureType: 'poi',  elementType: 'labels.icon', stylers: [{ visibility: 'off' }] },
    { featureType: 'poi',  elementType: 'labels.text', stylers: [{ visibility: 'off' }] },
    { featureType: 'poi',  elementType: 'geometry', stylers: [{ color: '#eaeff5' }] },
    { featureType: 'poi.business', stylers: [{ visibility: 'off' }] },
    { featureType: 'poi.attraction', stylers: [{ visibility: 'off' }] },
    { featureType: 'poi.government', stylers: [{ visibility: 'off' }] },
    { featureType: 'poi.medical', stylers: [{ visibility: 'off' }] },
    { featureType: 'poi.place_of_worship', stylers: [{ visibility: 'off' }] },
    { featureType: 'poi.school', stylers: [{ visibility: 'off' }] },
    { featureType: 'poi.sports_complex', stylers: [{ visibility: 'off' }] },
    { featureType: 'poi.park', elementType: 'geometry', stylers: [{ color: '#d4edda' }] },
    { featureType: 'poi.park', elementType: 'labels.text.fill', stylers: [{ color: '#2d7a2d' }] },
    { featureType: 'poi.park', elementType: 'labels.icon', stylers: [{ visibility: 'off' }] },
    { featureType: 'transit', elementType: 'geometry', stylers: [{ color: '#e4eaf4' }] },
    { featureType: 'transit.station', elementType: 'labels.text.fill', stylers: [{ color: '#557799' }] },
    { featureType: 'landscape', elementType: 'geometry', stylers: [{ color: '#f0f4fa' }] },
    { featureType: 'administrative', elementType: 'geometry', stylers: [{ color: '#d8e0ee' }] },
    { featureType: 'administrative', elementType: 'labels.text.fill', stylers: [{ color: '#556677' }] },
  ];

  /* Category marker colors — dark / light variants */
const CAT_COLORS = {
  Restaurant: { dark: '#ffb38a', light: '#f97316' },
  Bar:        { dark: '#c4b5fd', light: '#7c3aed' },
  Cafe:       { dark: '#f7d68a', light: '#b7791f' },
  Attraction: { dark: '#a7f3d0', light: '#059669' },
};

  /* ────── Theme State ────── */
  let currentTheme = (function () {
    try { return localStorage.getItem('ancona-theme') || 'dark'; } catch (e) { return 'dark'; }
  })();

  /* ────── App State ────── */
  let map, directionsService, directionsRenderer, geocoder;
  let poiDirectionsRenderer = null;
  let poiAltPolylines = [];
  let poiMarkers = [];
  let userLocationLatLng = null;
  let preferredLine = null;
  let allPois = [];
  let openInfoWindow = null;
  let activeFilter = 'all';
  let lastRouteRoutes = null;
  let currentRouteIdx = 0;
  let pickMode = false;
  let activePoi = null;      /* POI currently shown as destination */
  let ttDirection   = 'to-uni'; /* 'to-uni' | 'from-uni' */
  let routeDirection = 'to-uni'; /* 'to-uni' | 'from-uni' — Route tab swap */

  /* ────── DOM refs ────── */
  const elNoKey          = document.getElementById('no-key');
  const elOriginSelect   = document.getElementById('origin-select');
  const elLocateBtn      = document.getElementById('locate-btn');
  const elPrefer46       = document.getElementById('prefer-46');
  const elPrefer14       = document.getElementById('prefer-14');
  const elClearPref      = document.getElementById('clear-preference');
  const elOpenGMaps      = document.getElementById('open-in-gmaps');
  const elStepsList      = document.getElementById('steps-list');
  const elPlacesList     = document.getElementById('places-list');
  const elAttrList       = document.getElementById('attractions-list');
  const elToast          = document.getElementById('location-toast');
  const elNoKeyGMaps     = document.getElementById('no-key-gmaps');
  const elBgCanvas       = document.getElementById('bg-canvas');
  const elPickMapBtn     = document.getElementById('pick-map-btn');

  /* ══════════════════════════════════
     THEME MANAGEMENT
     ══════════════════════════════════ */
  function applyTheme(theme) {
    currentTheme = theme;
    document.documentElement.setAttribute('data-theme', theme);
    try { localStorage.setItem('ancona-theme', theme); } catch (e) { /* ignore */ }

    const btn = document.getElementById('theme-toggle');
    if (btn) btn.textContent = theme === 'dark' ? '☀️' : '🌙';

    if (map) {
      map.setOptions({ styles: theme === 'dark' ? MAP_STYLE_DARK : MAP_STYLE_LIGHT });
    }

    /* Refresh all markers with correct color for theme */
    poiMarkers.forEach(marker => {
      const poi = marker.__poi;
      if (!poi) return;
      const colorSet = CAT_COLORS[poi.category] || { dark: '#8a98b8', light: '#6678a0' };
      const color = theme === 'dark' ? colorSet.dark : colorSet.light;
      marker.setIcon({
        url: svgDataUrl(emojiCircleSvg(poi.emoji || '📍', color)),
        anchor: new google.maps.Point(20, 20),
        scaledSize: new google.maps.Size(40, 40),
      });
    });
  }

  function toggleTheme() {
    applyTheme(currentTheme === 'dark' ? 'light' : 'dark');
  }

  /* ══════════════════════════════════════════
     THREE.JS — Animated star / particle field
     ══════════════════════════════════════════ */
  function initThreeBackground() {
    if (!window.THREE) return;

    const renderer = new THREE.WebGLRenderer({ canvas: elBgCanvas, alpha: true, antialias: false });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000, 0);

    const scene  = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 2000);
    camera.position.z = 700;

    /* Stars */
    const N_STARS = 800;
    const positions = new Float32Array(N_STARS * 3);
    for (let i = 0; i < N_STARS; i++) {
      positions[i * 3]     = (Math.random() - 0.5) * 2000;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 2000;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 1200;
    }

    const starGeo  = new THREE.BufferGeometry();
    starGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const starMat  = new THREE.PointsMaterial({
      color: 0x6dd5fa,
      size: 1.8,
      sizeAttenuation: true,
      transparent: true,
      opacity: 0.55,
    });
    const starField = new THREE.Points(starGeo, starMat);
    scene.add(starField);

    /* Floating orb */
    const sphereGeo = new THREE.SphereGeometry(120, 24, 24);
    const sphereMat = new THREE.MeshBasicMaterial({
      color: 0x1a4080,
      wireframe: true,
      transparent: true,
      opacity: 0.12,
    });
    const sphere = new THREE.Mesh(sphereGeo, sphereMat);
    sphere.position.set(350, -120, -300);
    scene.add(sphere);

    /* Torus ring */
    const torusGeo = new THREE.TorusGeometry(80, 1.5, 12, 80);
    const torusMat = new THREE.MeshBasicMaterial({
      color: 0x4f8ef7,
      transparent: true,
      opacity: 0.15,
    });
    const torus = new THREE.Mesh(torusGeo, torusMat);
    torus.position.set(-260, 150, -200);
    torus.rotation.x = 1.2;
    scene.add(torus);

    window.addEventListener('resize', () => {
      renderer.setSize(window.innerWidth, window.innerHeight);
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
    });

    let t = 0;
    function animate() {
      requestAnimationFrame(animate);
      t += 0.0006;
      starField.rotation.y = t * 0.15;
      starField.rotation.x = t * 0.05;
      sphere.rotation.y  += 0.002;
      sphere.rotation.x  += 0.001;
      torus.rotation.z   += 0.003;
      torus.rotation.y   += 0.001;
      renderer.render(scene, camera);
    }
    animate();
  }

  /* ══════════════════════════════════
     GOOGLE MAPS LOADER
     ══════════════════════════════════ */
  function loadGoogleMaps(apiKey) {
    return new Promise((resolve, reject) => {
      if (window.google && window.google.maps) { resolve(); return; }
      const cbName = '__gmCb__' + Math.random().toString(36).slice(2);
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${encodeURIComponent(apiKey)}&callback=${cbName}`;
      script.async = true;
      script.defer = true;
      window[cbName] = () => { delete window[cbName]; resolve(); };
      script.onerror = () => reject(new Error('Failed to load Google Maps JS API'));
      document.head.appendChild(script);
    });
  }

  /* ══════════════════════════════════
     MAP INIT
     ══════════════════════════════════ */
 /* function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
      center: DEFAULT_CENTER,
      zoom: DEFAULT_ZOOM,
      styles: currentTheme === 'dark' ? MAP_STYLE_DARK : MAP_STYLE_LIGHT,
      mapTypeControl: false,
      streetViewControl: false,
      fullscreenControl: true,
      fullscreenControlOptions: { position: google.maps.ControlPosition.BOTTOM_RIGHT },
      zoomControl: true,
      zoomControlOptions: { position: google.maps.ControlPosition.RIGHT_CENTER },
    });

    geocoder          = new google.maps.Geocoder();
    directionsService = new google.maps.DirectionsService();
    directionsRenderer = new google.maps.DirectionsRenderer({
      map,
      suppressMarkers: false,
      preserveViewport: false,
      polylineOptions: {
        strokeColor: '#4f8ef7',
        strokeOpacity: 0.95,
        strokeWeight: 6,
      },
    });

    loadPOIs();
    wireUI();
    updateGMapsLink();
    computeRoute();
    placeUniversityMarker();

    map.addListener('click', e => {
      if (pickMode) {
        exitPickMode(e.latLng);
        return;
      }
      if (window.innerWidth <= 860) {
        document.getElementById('sidebar').classList.remove('drawer-open');
      }
    });

    const elPoiClose = document.getElementById('poi-route-close');
    if (elPoiClose) elPoiClose.addEventListener('click', () => clearPoiRoute());
  }*/
function initMap() {
  map = new google.maps.Map(document.getElementById('map'), {
    center: DEFAULT_CENTER,
    zoom: DEFAULT_ZOOM,
    mapTypeControl: false,
    streetViewControl: false,
    fullscreenControl: true,
    zoomControl: true,
  });
}
  /* ══════════════════════════════════
     UI WIRING
     ══════════════════════════════════ */
  function wireUI() {
    /* Theme toggle */
    const elToggle = document.getElementById('theme-toggle');
    if (elToggle) elToggle.addEventListener('click', toggleTheme);

    /* Tabs */
    document.querySelectorAll('.tab').forEach(btn => {
      btn.addEventListener('click', () => {
        const tab = btn.dataset.tab;
        document.querySelectorAll('.tab').forEach(b => b.classList.toggle('active', b === btn));
        document.querySelectorAll('.tab-panel').forEach(p => {
          p.classList.toggle('active', p.id === `panel-${tab}`);
        });
        if (tab === 'route') {
          filterMarkersByCategory('none');
        } else if (tab === 'places') {
          applyFilter(activeFilter);
        } else if (tab === 'attractions') {
          filterMarkersByCategory('attraction');
        } else if (tab === 'times') {
          filterMarkersByCategory('none');
          /* Auto-load timetable if not yet loaded */
          const ttList = document.getElementById('timetable-list');
          if (ttList && ttList.querySelector('.tt-empty')) loadTimetable();
        }
        if (window.innerWidth <= 860) {
          document.getElementById('sidebar').classList.add('drawer-open');
        }
      });
    });

    const elDrawerHandle = document.getElementById('drawer-handle');
    if (elDrawerHandle) {
      elDrawerHandle.addEventListener('click', () => {
        document.getElementById('sidebar').classList.toggle('drawer-open');
      });
    }

    elOriginSelect.addEventListener('change', () => {
      if (elOriginSelect.value === '__gps__') {
        requestGeolocation();
      } else {
        userLocationLatLng = null;
        updateGMapsLink();
        /* If a POI is the current destination, re-route to it */
        if (activePoi && poiDirectionsRenderer !== null) {
          computePoiRoute(activePoi);
        } else {
          computeRoute();
        }
      }
    });

    elLocateBtn.addEventListener('click', requestGeolocation);
    if (elPickMapBtn) elPickMapBtn.addEventListener('click', startPickMode);

    /* Route direction swap */
    const elRouteDirSwap = document.getElementById('route-dir-swap');
    if (elRouteDirSwap) {
      elRouteDirSwap.addEventListener('click', () => {
        routeDirection = routeDirection === 'to-uni' ? 'from-uni' : 'to-uni';
        updateRouteDirBadge();
        updateGMapsLink();
        computeRoute();
      });
    }

    const elBackToUnivpm = document.getElementById('back-to-univpm');
    if (elBackToUnivpm) elBackToUnivpm.addEventListener('click', resetToUnivpm);

    elPrefer46.addEventListener('click', () => { setPreference('46'); });
    elPrefer14.addEventListener('click', () => { setPreference('1/4'); });
    elClearPref.addEventListener('click', () => { clearPreference(); });

    document.querySelectorAll('.filter-chip').forEach(chip => {
      chip.addEventListener('click', () => {
        document.querySelectorAll('.filter-chip').forEach(c => c.classList.remove('active'));
        chip.classList.add('active');
        activeFilter = chip.dataset.filter;
        applyFilter(activeFilter);
        renderPlacesList(activeFilter);
      });
    });

    /* Timetable refresh button */
    const elTtRefresh = document.getElementById('timetable-refresh');
    if (elTtRefresh) elTtRefresh.addEventListener('click', () => loadTimetable());

    /* Timetable direction swap button */
    const elDirSwap = document.getElementById('tt-dir-swap');
    if (elDirSwap) {
      elDirSwap.addEventListener('click', () => {
        ttDirection = ttDirection === 'to-uni' ? 'from-uni' : 'to-uni';
        updateTtDirDisplay();
        loadTimetable();
      });
    }
  }

  function setPreference(line) {
    preferredLine = line;
    elPrefer46.classList.toggle('active', line === '46');
    elPrefer14.classList.toggle('active', line === '1/4');
    computeRoute();
  }

  function clearPreference() {
    preferredLine = null;
    elPrefer46.classList.remove('active');
    elPrefer14.classList.remove('active');
    /* Re-route with no preference — defaults to Bus 46 */
    computeRoute();
  }

  /* ══════════════════════════════════
     GEOLOCATION
     ══════════════════════════════════ */
  function requestGeolocation() {
    if (!navigator.geolocation) {
      showToast('⚠️ Geolocation not supported on this device');
      return;
    }
    showToast('📍 Locating you…');
    navigator.geolocation.getCurrentPosition(
      pos => {
        userLocationLatLng = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        showToast('✅ Location found!');

        let gpsOpt = document.querySelector('#origin-select option[value="__gps__"]');
        if (!gpsOpt) {
          gpsOpt = document.createElement('option');
          gpsOpt.value = '__gps__';
          elOriginSelect.appendChild(gpsOpt);
        }
        gpsOpt.textContent = '📍 My Location';
        elOriginSelect.value = '__gps__';

        placeUserMarker(userLocationLatLng);
        updateGMapsLink();
        /* If a POI is the current destination, re-route to it */
        if (activePoi && poiDirectionsRenderer !== null) {
          computePoiRoute(activePoi);
        } else {
          computeRoute();
        }
      },
      err => {
        const msgs = {
          1: '🔒 Location permission denied',
          2: '📡 Location unavailable',
          3: '⏱ Location request timed out',
        };
        showToast(msgs[err.code] || '❌ Could not get location');
        elOriginSelect.value = '43.6150,13.5163';
      },
      { timeout: 12000, maximumAge: 60000 }
    );
  }

  let userMarker = null;
  function placeUserMarker(pos) {
    if (userMarker) userMarker.setMap(null);
    userMarker = new google.maps.Marker({
      position: pos,
      map,
      title: 'Your Location',
      icon: {
        url: svgDataUrl(circleIconSvg('#6dd5fa', '#0a1929')),
        anchor: new google.maps.Point(12, 12),
        scaledSize: new google.maps.Size(24, 24),
      },
      zIndex: 200,
    });
    map.panTo(pos);
  }

  /* ══════════════════════════════════
     ROUTING
     ══════════════════════════════════ */
  let altPolylines = [];

  function clearAltPolylines() {
    altPolylines.forEach(pl => pl.setMap(null));
    altPolylines = [];
  }

  function getOriginValue() {
    const v = elOriginSelect.value;
    if (userLocationLatLng && (v === '__gps__' || v === '__picked__')) return userLocationLatLng;
    if (v === '__gps__' || v === '__picked__') return '43.6150,13.5163';
    return v;
  }

  /* ── Pick-on-map mode ── */
  function startPickMode() {
    if (!map) return;
    pickMode = true;
    if (elPickMapBtn) elPickMapBtn.classList.add('active');
    map.setOptions({ draggableCursor: 'crosshair' });
    showToast('🗺 Click the map to set your departure point', 6000);
    /* On mobile, collapse the sidebar so the map is visible */
    if (window.innerWidth <= 860) {
      document.getElementById('sidebar').classList.remove('drawer-open');
    }
  }

  function exitPickMode(latLng) {
    pickMode = false;
    if (elPickMapBtn) elPickMapBtn.classList.remove('active');
    map.setOptions({ draggableCursor: null });

    userLocationLatLng = { lat: latLng.lat(), lng: latLng.lng() };

    /* Add / update the custom-pick option in the select */
    let opt = document.querySelector('#origin-select option[value="__picked__"]');
    if (!opt) {
      opt = document.createElement('option');
      opt.value = '__picked__';
      elOriginSelect.insertBefore(opt, elOriginSelect.firstChild);
    }
    opt.textContent = '📍 Map selection';
    elOriginSelect.value = '__picked__';

    placeUserMarker(userLocationLatLng);
    updateGMapsLink();
    /* If a POI is the current destination, re-route to it */
    if (activePoi && poiDirectionsRenderer !== null) {
      computePoiRoute(activePoi);
    } else {
      computeRoute();
    }
    showToast('✅ Departure set to map selection');
  }

  function updateRouteDirBadge() {
    const badge       = document.getElementById('dest-badge');
    const fromBadge   = document.getElementById('from-uni-badge');
    const locationRow = document.querySelector('.location-row');
    if (!badge) return;
    if (routeDirection === 'to-uni') {
      /* Normal: show origin row, destination = UNIVPM */
      if (fromBadge)   fromBadge.style.display   = 'none';
      if (locationRow) locationRow.style.display  = '';
      badge.textContent = '🎓 UNIVPM — Via Brecce Bianche';
    } else {
      /* Swapped: hide origin row, show UNIVPM as "From", destination = selected origin */
      if (fromBadge)   fromBadge.style.display   = '';
      if (locationRow) locationRow.style.display  = 'none';
      const opt = elOriginSelect.options[elOriginSelect.selectedIndex];
      const label = opt ? opt.textContent.trim() : 'City Center';
      badge.textContent = '📍 ' + label;
    }
  }

  function computeRoute() {
    if (!directionsService) return;

    clearAltPolylines();
    elStepsList.innerHTML = '';

    const routeOrigin = routeDirection === 'from-uni' ? DESTINATION_TEXT : getOriginValue();
    const routeDest   = routeDirection === 'from-uni' ? getOriginValue()  : DESTINATION_TEXT;

    const request = {
      origin: routeOrigin,
      destination: routeDest,
      travelMode: google.maps.TravelMode.TRANSIT,
      transitOptions: { modes: [google.maps.TransitMode.BUS] },
      provideRouteAlternatives: true,
    };

    directionsService.route(request, (result, status) => {
      if (status !== 'OK' || !result || !result.routes.length) {
        directionsRenderer.setDirections({ routes: [] });
        addStep('No transit route found — try "Open in Google Maps" above.');
        return;
      }

      const routes = result.routes;
      const idx    = pickBestRoute(routes);
      const chosen = routes[idx];

      const lines = extractLines(chosen);
      const color = lines.has('1/4') ? '#4ecb8d' : '#4f8ef7';

      directionsRenderer.setOptions({
        polylineOptions: { strokeColor: color, strokeOpacity: 0.95, strokeWeight: 6 },
      });
      directionsRenderer.setDirections(result);
      directionsRenderer.setRouteIndex(idx);

      routes.forEach((r, i) => {
        if (i === idx) return;
        altPolylines.push(new google.maps.Polyline({
          path: r.overview_path,
          geodesic: true,
          strokeColor: '#2a4a7a',
          strokeOpacity: 0.7,
          strokeWeight: 4,
          map,
        }));
      });

      lastRouteRoutes = routes;
      currentRouteIdx = idx;
      renderRouteOptions(routes, idx);
    });
  }

  function normaliseLine(sn, name) {
    const s = (sn || '').trim();
    const n = (name || '').trim();
    /* '14' → '1/4', also handle unicode fraction ¼ */
    if (s === '14' || s === '¼' || s === '1-4') return '1/4';
    /* If short_name is empty, fall back to the full name */
    return s || n;
  }

  function extractLines(route) {
    const set = new Set();
    (route.legs || []).forEach(leg =>
      (leg.steps || []).forEach(step => {
        if (step.travel_mode === 'TRANSIT' && step.transit && step.transit.line) {
          const lineObj = step.transit.line;
          const norm = normaliseLine(lineObj.short_name, lineObj.name);
          console.log('[Bus line]', JSON.stringify({
            short_name: lineObj.short_name,
            name: lineObj.name,
            normalised: norm,
          }));
          if (norm) set.add(norm);
        }
      })
    );
    return set;
  }

  function pickBestRoute(routes) {
    /* Debug: log every returned route and its lines */
    routes.forEach((r, i) => {
      console.log(`[Route ${i}]`, [...extractLines(r)]);
    });

    if (preferredLine) {
      for (let i = 0; i < routes.length; i++) {
        if (extractLines(routes[i]).has(preferredLine)) return i;
      }
      /* Preferred line not available from this origin — inform user */
      showToast(`ℹ️ Bus ${preferredLine} not available on this route — showing best alternative`);
      console.warn('[pickBestRoute] preferred "' + preferredLine + '" not found in any alternative');
    }
    for (let i = 0; i < routes.length; i++) if (extractLines(routes[i]).has('46')) return i;
    for (let i = 0; i < routes.length; i++) if (extractLines(routes[i]).has('1/4')) return i;
    return 0;
  }

  function renderRouteOptions(routes, selIdx) {
    /* ── Create / refresh the route-options container above the panel ── */
    let optPanel = document.getElementById('route-opts');
    if (!optPanel) {
      optPanel = document.createElement('div');
      optPanel.id = 'route-opts';
      const dirPanel = document.getElementById('directions-panel');
      if (dirPanel && dirPanel.parentNode) {
        dirPanel.parentNode.insertBefore(optPanel, dirPanel);
      }
    }
    optPanel.innerHTML = '';
    optPanel.style.display = routes.length > 1 ? '' : 'none';

    if (routes.length > 1) {
      const label = document.createElement('div');
      label.className = 'field-label';
      label.style.marginBottom = '6px';
      label.textContent = 'Route options';
      optPanel.appendChild(label);

      routes.forEach((route, i) => {
        const leg = (route.legs || [])[0];
        const transitStep = ((leg || {}).steps || []).find(s => s.travel_mode === 'TRANSIT');
        const transit = transitStep && transitStep.transit;
        const lineNames = [...extractLines(route)];
        const boardStop = transit && transit.departure_stop
          ? transit.departure_stop.name : '';
        const duration  = leg && leg.duration ? leg.duration.text : '';
        const is14 = lineNames.some(l => l === '1/4');
        const badgeCls = is14 ? 'tt-badge-14' : 'tt-badge-46';
        const lineLabel = lineNames.join(' + ') || '?';

        const card = document.createElement('div');
        card.className = 'route-option' + (i === selIdx ? ' active' : '');
        card.innerHTML = `
          <span class="tt-badge ${badgeCls}">${esc(lineLabel)}</span>
          <div class="ro-info">
            ${boardStop ? `<div class="ro-stop">🚏 ${esc(boardStop)}</div>` : ''}
            ${duration  ? `<div class="ro-dur">⏱ ${esc(duration)}</div>` : ''}
          </div>
          ${i === selIdx ? '<span class="ro-check">✓</span>' : ''}
        `;
        card.addEventListener('click', () => switchRoute(routes, i));
        optPanel.appendChild(card);
      });
    }

    /* ── Detailed steps for selected route ── */
    elStepsList.innerHTML = '';
    renderSteps(routes[selIdx]);
  }

  function switchRoute(routes, idx) {
    currentRouteIdx = idx;

    const lines = extractLines(routes[idx]);
    const color = lines.has('1/4') ? '#4ecb8d' : '#4f8ef7';

    directionsRenderer.setOptions({
      polylineOptions: { strokeColor: color, strokeOpacity: 0.95, strokeWeight: 6 },
    });
    directionsRenderer.setRouteIndex(idx);

    clearAltPolylines();
    routes.forEach((r, i) => {
      if (i === idx) return;
      altPolylines.push(new google.maps.Polyline({
        path: r.overview_path,
        geodesic: true,
        strokeColor: '#2a4a7a',
        strokeOpacity: 0.7,
        strokeWeight: 4,
        map,
      }));
    });

    renderRouteOptions(routes, idx);
  }

  function renderSteps(route) {
    const steps = (route.legs[0] || {}).steps || [];
    if (!steps.length) { addStep('Route loaded — see map for details.'); return; }
    steps.forEach(step => {
      if (step.travel_mode === 'WALKING') {
        addStep('🚶 ' + stripHtml(step.instructions || 'Walk'));
      } else if (step.travel_mode === 'TRANSIT' && step.transit) {
        const sn    = step.transit.line && step.transit.line.short_name;
        const head  = step.transit.headsign || '';
        const from  = (step.transit.departure_stop || {}).name || 'stop';
        const to    = (step.transit.arrival_stop   || {}).name || 'stop';
        addStep(`🚌 Bus ${sn || ''} → ${head} | ${from} ➜ ${to}`);
      }
    });
  }

  function addStep(text) {
    const li = document.createElement('li');
    li.textContent = text;
    elStepsList.appendChild(li);
  }

  function stripHtml(html) {
    const d = document.createElement('div');
    d.innerHTML = html;
    return d.textContent || d.innerText || '';
  }

  /* ══════════════════════════════════
     GOOGLE MAPS DEEP LINK
     ══════════════════════════════════ */
  function updateGMapsLink() {
    const originVal = userLocationLatLng && elOriginSelect.value === '__gps__'
      ? `${userLocationLatLng.lat},${userLocationLatLng.lng}`
      : (elOriginSelect.value === '__gps__' ? '43.6150,13.5163' : elOriginSelect.value);
    const gmOrigin = routeDirection === 'from-uni' ? DESTINATION_TEXT : originVal;
    const gmDest   = routeDirection === 'from-uni' ? originVal : DESTINATION_TEXT;
    const url = `https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(gmOrigin)}&destination=${encodeURIComponent(gmDest)}&travelmode=transit&transit_mode=bus`;
    if (elOpenGMaps) elOpenGMaps.href = url;
    if (elNoKeyGMaps) elNoKeyGMaps.href = url;
  }

  /* ══════════════════════════════════
     POIS
     ══════════════════════════════════ */
  function loadPOIs() {
    fetch('data/pois.json')
      .then(r => { if (!r.ok) throw new Error(); return r.json(); })
      .then(data => {
        allPois = Array.isArray(data) ? data : [];
        placePOIMarkers();
        renderPlacesList('all');
        renderAttractionsList();
      })
      .catch(() => { console.warn('Could not load data/pois.json'); });
  }

  function placePOIMarkers() {
    poiMarkers.forEach(m => m.setMap(null));
    poiMarkers = [];

    let remaining = allPois.length;
    if (!remaining) return;

    allPois.forEach((poi, i) => {
      const place = function (lat, lng) {
        poi.lat = lat; poi.lng = lng;
        poiMarkers.push(createMarker(poi, { lat, lng }));
        remaining--;
        if (remaining === 0) applyFilter(activeFilter);
      };

      if (poi.address && geocoder) {
        setTimeout(() => {
          geocoder.geocode({ address: poi.address }, (results, status) => {
            if (status === 'OK' && results[0]) {
              const loc = results[0].geometry.location;
              place(loc.lat(), loc.lng());
            } else if (poi.lat != null && poi.lng != null) {
              place(poi.lat, poi.lng);
            } else {
              remaining--;
              if (remaining === 0) applyFilter(activeFilter);
            }
          });
        }, i * 120);
      } else if (poi.lat != null && poi.lng != null) {
        place(poi.lat, poi.lng);
      } else {
        remaining--;
        if (remaining === 0) applyFilter(activeFilter);
      }
    });
  }

  function createMarker(poi, pos) {
    const colorSet = CAT_COLORS[poi.category] || { dark: '#8a98b8', light: '#6678a0' };
    const color = currentTheme === 'dark' ? colorSet.dark : colorSet.light;
    const emoji = poi.emoji || '📍';

    const marker = new google.maps.Marker({
      position: pos,
      map,
      title: poi.name,
      icon: {
        url: svgDataUrl(emojiCircleSvg(emoji, color)),
        anchor: new google.maps.Point(20, 20),
        scaledSize: new google.maps.Size(40, 40),
      },
      zIndex: 100,
    });

    /* Store reference to POI for theme updates */
    marker.__cat = (poi.category || '').toLowerCase();
    marker.__poi = poi;

    const iw = new google.maps.InfoWindow({
      content: buildInfoWindow(poi),
      maxWidth: 280,
    });

    marker.addListener('click', () => {
      if (openInfoWindow) openInfoWindow.close();
      iw.open({ anchor: marker, map, shouldFocus: false });
      openInfoWindow = iw;
    });

    /* Wire the "Walk Here" button inside the InfoWindow */
    google.maps.event.addListener(iw, 'domready', () => {
      const safeId = poi.name.replace(/[^a-z0-9]/gi, '-').toLowerCase();
      const btn = document.getElementById('iw-route-' + safeId);
      if (btn) {
        btn.addEventListener('click', () => {
          iw.close();
          computePoiRoute(poi);
        });
      }
    });

    return marker;
  }

  function buildInfoWindow(poi) {
    const cat = (poi.category || '').toLowerCase();
    const safeId = poi.name.replace(/[^a-z0-9]/gi, '-').toLowerCase();
    const gmUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent((poi.name || '') + ' ' + (poi.address || '') + ' Ancona')}`;

    return `
      <div class="iw-body">
        <div class="iw-header">
          <div class="iw-emoji-wrap">${poi.emoji || '📍'}</div>
          <div class="iw-header-text">
            <div class="iw-name">${esc(poi.name)}</div>
            <span class="iw-cat ${cat}">${esc(poi.category)}</span>
          </div>
        </div>
        <div class="iw-content">
          <div class="iw-desc">${esc(poi.description || '')}</div>
          ${poi.address ? `<div class="iw-addr"><span class="iw-addr-icon">📍</span>${esc(poi.address)}</div>` : ''}
          <div class="iw-actions">
            <button class="iw-route-btn" id="iw-route-${safeId}" type="button">🚶 Walk Here</button>
            <a class="iw-link" href="${gmUrl}" target="_blank" rel="noopener">Maps ↗</a>
          </div>
        </div>
      </div>`;
  }

  function esc(str) {
    const d = document.createElement('div');
    d.appendChild(document.createTextNode(String(str || '')));
    return d.innerHTML;
  }

  /* ── Marker visibility ── */
  function applyFilter(filter) {
    poiMarkers.forEach(m => {
      const cat = m.__cat || '';
      const show = filter === 'all' ||
        (filter === 'none'       ? false :
         filter === 'attraction' ? cat === 'attraction' :
         cat === filter);
      m.setMap(show ? map : null);
    });
  }

  function filterMarkersByCategory(cat) {
    poiMarkers.forEach(m => {
      if (cat === 'none') { m.setMap(null); return; }
      m.setMap(m.__cat === cat ? map : null);
    });
  }

  /* ══════════════════════════════════
     POI ROUTE — shown in the Route tab
     ══════════════════════════════════ */
  function computePoiRoute(poi) {
    const hasDest = poi.address || (poi.lat != null && poi.lng != null);
    if (!directionsService || !hasDest) return;

    activePoi = poi;
    clearPoiRoute();

    /* Hide the UNIVPM blue route while showing the POI route */
    directionsRenderer.setMap(null);
    clearAltPolylines();

    /* Switch to the Route tab */
    document.querySelectorAll('.tab').forEach(b => {
      b.classList.toggle('active', b.dataset.tab === 'route');
    });
    document.querySelectorAll('.tab-panel').forEach(p => {
      p.classList.toggle('active', p.id === 'panel-route');
    });

    if (window.innerWidth <= 860) {
      document.getElementById('sidebar').classList.add('drawer-open');
    }

    const destBadge = document.getElementById('dest-badge');
    if (destBadge) destBadge.textContent = (poi.emoji || '📍') + ' ' + poi.name;
    const backRow = document.getElementById('poi-back-row');
    if (backRow) backRow.style.display = 'flex';

    /* Hide bus-specific UI — show only walking directions */
    const busSection = elPrefer46.closest('.section');
    if (busSection) busSection.style.display = 'none';
    if (elOpenGMaps) elOpenGMaps.style.display = 'none';
    const routeOpts = document.getElementById('route-opts');
    if (routeOpts) routeOpts.style.display = 'none';
    /* Update panel heading */
    const panelIcon  = document.querySelector('#directions-panel .panel-heading-icon');
    const panelTitle = document.querySelector('#directions-panel .panel-heading span:last-child');
    if (panelIcon)  panelIcon.textContent  = '🚶';
    if (panelTitle) panelTitle.textContent = 'Walking Directions';

    elStepsList.innerHTML = '';
    addStep('🔍 Finding route…');

    poiDirectionsRenderer = new google.maps.DirectionsRenderer({
      map,
      suppressMarkers: false,
      preserveViewport: false,
      polylineOptions: {
        strokeColor: '#4ecb8d',
        strokeOpacity: 0.95,
        strokeWeight: 6,
      },
    });

    const dest = poi.address ? poi.address : { lat: poi.lat, lng: poi.lng };

    /* Ensure the origin row is visible for POI walking routes */
    const fromBadgePoi   = document.getElementById('from-uni-badge');
    const locationRowPoi = document.querySelector('.location-row');
    if (fromBadgePoi)   fromBadgePoi.style.display   = 'none';
    if (locationRowPoi) locationRowPoi.style.display  = '';

    /* Walking route departs from the selected origin (dropdown / GPS / picked) */
    directionsService.route(
      { origin: getOriginValue(), destination: dest, travelMode: google.maps.TravelMode.WALKING },
      (result, status) => {
        if (status !== 'OK' || !result || !result.routes.length) {
          elStepsList.innerHTML = '';
          addStep('No walking route found — tap "Maps ↗" to open Google Maps.');
          return;
        }
        poiDirectionsRenderer.setDirections(result);
        elStepsList.innerHTML = '';
        const steps = (((result.routes[0] || {}).legs || [])[0] || {}).steps || [];
        if (!steps.length) { addStep('Route shown on map.'); return; }
        steps.forEach(s => addStep('🚶 ' + stripHtml(s.instructions || '')));
      }
    );
  }

  function clearPoiRoute() {
    if (poiDirectionsRenderer) {
      poiDirectionsRenderer.setMap(null);
      poiDirectionsRenderer = null;
    }
    poiAltPolylines.forEach(pl => pl.setMap(null));
    poiAltPolylines = [];
    /* Restore the UNIVPM renderer onto the map */
    if (directionsRenderer) directionsRenderer.setMap(map);
    const overlay = document.getElementById('poi-route-overlay');
    if (overlay) overlay.classList.add('hidden');
  }

  function resetToUnivpm() {
    activePoi = null;
    clearPoiRoute();
    const destBadge = document.getElementById('dest-badge');
    if (destBadge) destBadge.textContent = '🎓 UNIVPM — Via Brecce Bianche';
    const backRow = document.getElementById('poi-back-row');
    if (backRow) backRow.style.display = 'none';

    /* Restore bus-specific UI */
    const busSection = elPrefer46.closest('.section');
    if (busSection) busSection.style.display = '';
    if (elOpenGMaps) elOpenGMaps.style.display = '';
    /* Restore panel heading */
    const panelIcon  = document.querySelector('#directions-panel .panel-heading-icon');
    const panelTitle = document.querySelector('#directions-panel .panel-heading span:last-child');
    if (panelIcon)  panelIcon.textContent  = '🚌';
    if (panelTitle) panelTitle.textContent = 'Transit Steps';

    /* Restore the direction badge (handles from-uni / to-uni state correctly) */
    updateRouteDirBadge();
    computeRoute();
  }

  /* ── Sidebar list rendering ── */
  function renderPlacesList(filter) {
    elPlacesList.innerHTML = '';
    const cats = ['Restaurant', 'Bar', 'Cafe'];
    const filtered = allPois.filter(p => {
      if (!cats.includes(p.category)) return false;
      if (filter === 'all') return true;
      return p.category.toLowerCase() === filter;
    });
    if (!filtered.length) {
      elPlacesList.innerHTML = '<p style="color:var(--c-text-muted);font-size:12px;padding:8px 0">No places found.</p>';
      return;
    }
    filtered.forEach(poi => elPlacesList.appendChild(buildCard(poi)));
  }

  function renderAttractionsList() {
    elAttrList.innerHTML = '';
    const filtered = allPois.filter(p => p.category === 'Attraction');
    if (!filtered.length) {
      elAttrList.innerHTML = '<p style="color:var(--c-text-muted);font-size:12px;padding:8px 0">No sights found.</p>';
      return;
    }
    filtered.forEach(poi => elAttrList.appendChild(buildCard(poi)));
  }

  function buildCard(poi) {
    const cat = (poi.category || '').toLowerCase();
    const gmUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent((poi.name || '') + ' ' + (poi.address || '') + ' Ancona')}`;

    const card = document.createElement('div');
    card.className = 'poi-card';
    card.innerHTML = `
      <div class="poi-card-header">
        <div class="poi-emoji">${poi.emoji || '📍'}</div>
        <div class="poi-info">
          <div class="poi-name">${esc(poi.name)}</div>
          <div class="poi-cat ${cat}">${esc(poi.category)}</div>
        </div>
      </div>
      <div class="poi-desc">${esc(poi.description || '')}</div>
      <div class="poi-card-footer">
        <span class="poi-address">${esc(poi.address || '')}</span>
        <div class="poi-card-actions">
          <button class="poi-dir-btn" type="button">🚶 Route</button>
          <a class="poi-map-btn" href="${gmUrl}" target="_blank" rel="noopener">Maps ↗</a>
        </div>
      </div>`;

    const dirBtn = card.querySelector('.poi-dir-btn');
    dirBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      computePoiRoute(poi);
      if (window.innerWidth <= 860) {
        document.getElementById('sidebar').classList.remove('drawer-open');
      }
    });

    card.addEventListener('click', (e) => {
      if (e.target.closest('.poi-card-actions')) return;
      if (poi.lat != null && poi.lng != null) {
        map.panTo({ lat: poi.lat, lng: poi.lng });
        map.setZoom(17);
        const m = poiMarkers.find(mk => mk.getTitle() === poi.name);
        if (m) google.maps.event.trigger(m, 'click');
        if (window.innerWidth <= 860) {
          document.getElementById('sidebar').classList.remove('drawer-open');
        }
      }
    });

    return card;
  }

  /* ══════════════════════════════════
     TIMETABLE — Real-time bus departures
     ══════════════════════════════════ */

  /* ── Update the direction display labels ── */
  function updateTtDirDisplay() {
    const elFrom = document.getElementById('tt-dir-from-label');
    const elTo   = document.getElementById('tt-dir-to-label');
    if (!elFrom || !elTo) return;
    if (ttDirection === 'to-uni') {
      elFrom.textContent = 'Center';
      elTo.textContent   = 'University';
    } else {
      elFrom.textContent = 'University';
      elTo.textContent   = 'Center';
    }
  }

  function routePromise(request) {
    return new Promise(resolve => {
      directionsService.route(request, (result, status) => resolve({ result, status }));
    });
  }

  function formatTime(date) {
    return date.toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit', hour12: false });
  }

  async function loadTimetable() {
    if (!directionsService) return;
    const elList    = document.getElementById('timetable-list');
    const elUpdated = document.getElementById('timetable-updated');
    const elRefresh = document.getElementById('timetable-refresh');
    if (!elList) return;

    /* Only show times when routing to UNIVPM, not to a POI */
    if (poiDirectionsRenderer !== null) {
      elList.innerHTML = `<div class="tt-empty"><div class="tt-empty-icon">🎓</div><p>Bus times are shown for the<br><strong>UNIVPM route</strong> only.<br>Tap ← Back to UNIVPM first.</p></div>`;
      if (elUpdated) elUpdated.textContent = '';
      if (elRefresh) elRefresh.classList.remove('loading');
      return;
    }

    if (elRefresh) elRefresh.classList.add('loading');

    /* Direction: to-uni = center → UNIVPM, from-uni = UNIVPM → center */
    const ttOrigin = ttDirection === 'from-uni' ? DESTINATION_TEXT : getOriginValue();
    const ttDest   = ttDirection === 'from-uni' ? getOriginValue() : DESTINATION_TEXT;
    const dirLabel = ttDirection === 'from-uni' ? 'From University' : 'To University';
    elList.innerHTML = `<div class="tt-empty"><div class="tt-empty-icon">⏳</div><p>Loading departures — ${dirLabel}…</p></div>`;

    const departures = [];
    const seen       = new Set();
    let   searchTime = new Date();
    const WANT        = 4;
    const MAX_QUERIES = 6;

    try {
      for (let q = 0; q < MAX_QUERIES && departures.length < WANT; q++) {
        const { result, status } = await routePromise({
          origin: ttOrigin,
          destination: ttDest,
          travelMode: google.maps.TravelMode.TRANSIT,
          transitOptions: { departureTime: searchTime, modes: [google.maps.TransitMode.BUS] },
          provideRouteAlternatives: true,
        });

        if (status !== 'OK' || !result || !result.routes || !result.routes.length) break;

        let latestTimeSec = 0;
        for (const route of result.routes) {
          const leg = (route.legs || [])[0];
          if (!leg) continue;
          const transitStep = (leg.steps || []).find(s => s.travel_mode === 'TRANSIT');
          if (!transitStep || !transitStep.transit) continue;
          const dep     = transitStep.transit;
          /* departure_time.value is a Date object in the JS API */
          const depDate = dep.departure_time && dep.departure_time.value;
          if (!depDate) continue;
          const depTimeSec = depDate instanceof Date ? depDate.getTime() / 1000 : Number(depDate) / 1000;
          const depKey     = Math.floor(depTimeSec);
          if (seen.has(depKey)) continue;
          seen.add(depKey);
          /* Normalise line name: API may return '14' instead of '1/4' */
          let rawLine = (dep.line && dep.line.short_name) || '?';
          if (rawLine === '14') rawLine = '1/4';
          /* Only collect Bus 46 and Bus 1/4 */
          if (rawLine !== '46' && rawLine !== '1/4') continue;
          departures.push({
            timeSec:  depTimeSec,
            timeText: dep.departure_time.text || formatTime(depDate instanceof Date ? depDate : new Date(depTimeSec * 1000)),
            line:     rawLine,
            headsign: dep.headsign || (dep.line && dep.line.name) || '',
            fromStop: (dep.departure_stop && dep.departure_stop.name) || '',
            toStop:   (dep.arrival_stop   && dep.arrival_stop.name)   || '',
            duration: leg.duration ? leg.duration.text : '',
          });
          if (depTimeSec > latestTimeSec) latestTimeSec = depTimeSec;
        }

        if (latestTimeSec > 0) {
          searchTime = new Date((latestTimeSec + 60) * 1000);
        } else {
          searchTime = new Date(searchTime.getTime() + 20 * 60 * 1000);
        }
      }
    } catch (e) {
      console.warn('Timetable load error:', e);
    }

    departures.sort((a, b) => a.timeSec - b.timeSec);
    if (elRefresh) elRefresh.classList.remove('loading');

    if (!departures.length) {
      elList.innerHTML = `<div class="tt-empty"><div class="tt-empty-icon">🚫</div><p>No upcoming buses found.<br>Try a different origin or check back later.</p></div>`;
      if (elUpdated) elUpdated.textContent = 'Updated at ' + formatTime(new Date());
      return;
    }

    renderTimetable(departures);
    if (elUpdated) elUpdated.textContent = 'Updated at ' + formatTime(new Date());
  }

  function renderTimetable(departures) {
    const elList = document.getElementById('timetable-list');
    if (!elList) return;
    const nowSec      = Date.now() / 1000;
    let   firstUpcoming = true;
    elList.innerHTML  = '';

    departures.forEach(dep => {
      const mins   = Math.round((dep.timeSec - nowSec) / 60);
      const isNext = firstUpcoming && dep.timeSec >= nowSec - 60;
      if (isNext) firstUpcoming = false;

      const line       = dep.line;
      const badgeClass = line === '46'
        ? 'tt-badge-46'
        : (line === '1/4' || line === '14')
          ? 'tt-badge-14'
          : 'tt-badge-other';

      const minsText = mins <= 0
        ? '<span class="tt-mins-now">Now</span>'
        : mins === 1
          ? 'in 1 min'
          : `in ${mins} min`;

      const stopsText = dep.fromStop && dep.toStop
        ? `${dep.fromStop} ➜ ${dep.toStop}${dep.duration ? ' · ' + dep.duration : ''}`
        : dep.duration || '';

      const item = document.createElement('div');
      item.className = 'tt-item' + (isNext ? ' tt-next' : '');
      item.innerHTML = `
        <div class="tt-time">${dep.timeText}</div>
        <span class="tt-badge ${badgeClass}">${esc(line)}</span>
        <div class="tt-info">
          <div class="tt-headsign">${esc(dep.headsign || 'Bus ' + line)}</div>
          ${stopsText ? `<div class="tt-stops">${esc(stopsText)}</div>` : ''}
        </div>
        <div class="tt-mins">${minsText}</div>`;
      elList.appendChild(item);
    });
  }

  /* ══════════════════════════════════
     UNIVERSITY MARKER
     ══════════════════════════════════ */
  function placeUniversityMarker() {
    const UNIV_POS = { lat: 43.58681636043152, lng: 13.516771976539747 };
    const color = currentTheme === 'dark' ? '#e6c96a' : '#b0b8c8';
    const univMarker = new google.maps.Marker({
      position: UNIV_POS,
      map,
      title: 'UNIVPM — Via Brecce Bianche',
      icon: {
        url: svgDataUrl(univSvg(color)),
        anchor: new google.maps.Point(24, 24),
        scaledSize: new google.maps.Size(48, 48),
      },
      zIndex: 300,
    });

    const gmUrl = 'https://www.google.com/maps/search/?api=1&query=Università+Politecnica+delle+Marche+Ancona';
    const iwContent = `
      <div class="iw-body">
        <img class="iw-hero" src="data/img.png" alt="UNIVPM campus">
        <div class="iw-header">
          <div class="iw-emoji-wrap">🎓</div>
          <div class="iw-header-text">
            <div class="iw-name">Uiversita Politecnica delle Marche</div>
            <span class="iw-cat attraction">University</span>
          </div>
        </div>
        <div class="iw-content">
          <div class="iw-desc">Università Politecnica delle Marche — Faculty of Engineering &amp; Science. It is set on a scenic hilltop campus overlooking Ancona.</div>
          <div class="iw-addr"><span class="iw-addr-icon">📍</span>Via Brecce Bianche, 1, 60131 Ancona AN, Italy</div>
          <div class="iw-actions">
            <a class="iw-link" href="${gmUrl}" target="_blank" rel="noopener">Maps ↗</a>
          </div>
        </div>
      </div>`;

    const iw = new google.maps.InfoWindow({ content: iwContent, maxWidth: 300 });
    univMarker.addListener('click', () => {
      if (openInfoWindow) openInfoWindow.close();
      iw.open({ anchor: univMarker, map, shouldFocus: false });
      openInfoWindow = iw;
    });
  }

  /* ══════════════════════════════════
     SVG HELPERS
     ══════════════════════════════════ */
  /* Special university bulb / graduation SVG marker */
  function univSvg(color) {
    return `<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 48 48">
      <circle cx="24" cy="24" r="22" fill="${color}" opacity="0.93" stroke="white" stroke-width="2.5"/>
      <text x="24" y="31" text-anchor="middle" font-size="22"
            font-family="'Apple Color Emoji','Segoe UI Emoji','Noto Color Emoji',Arial,sans-serif">🎓</text>
    </svg>`;
  }


  /* Emoji circle marker — shows emoji directly on the map */
  function emojiCircleSvg(emoji, color) {
    return `<svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 40 40">
      <circle cx="20" cy="20" r="18" fill="${color}" opacity="0.92" stroke="white" stroke-width="2.5"/>
      <text x="20" y="26" text-anchor="middle" font-size="16"
            font-family="'Apple Color Emoji','Segoe UI Emoji','Noto Color Emoji',Arial,sans-serif">${emoji}</text>
    </svg>`;
  }

  function circleIconSvg(fill, stroke) {
    return `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="10" fill="${fill}" stroke="${stroke}" stroke-width="3"/>
      <circle cx="12" cy="12" r="4" fill="${stroke}" opacity="0.8"/>
    </svg>`;
  }

  function svgDataUrl(svg) {
    return 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(svg);
  }

  /* ══════════════════════════════════
     TOAST
     ══════════════════════════════════ */
  let toastTimer = null;
  function showToast(msg, duration = 3000) {
    elToast.textContent = msg;
    elToast.classList.remove('hidden', 'fade-out');
    if (toastTimer) clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      elToast.classList.add('fade-out');
      setTimeout(() => elToast.classList.add('hidden'), 450);
    }, duration);
  }

  /* ══════════════════════════════════
     ENTRY POINT
     ══════════════════════════════════ */
  function start() {
    /* Apply saved theme before anything renders */
    applyTheme(currentTheme);

    initThreeBackground();
    updateGMapsLink();

    /* Wire theme toggle even before map loads */
    const elToggle = document.getElementById('theme-toggle');
    if (elToggle) elToggle.addEventListener('click', toggleTheme);

    const rawKey = window.GMAPS_API_KEY;
    const key = typeof rawKey === 'string' ? rawKey.trim() : '';
    const looksLikeKey = /^AIza[0-9A-Za-z_\-]{35}$/.test(key);
    if (!looksLikeKey || key.toLowerCase() === 'undefined' || key.toLowerCase() === 'null') {
      elNoKey.classList.remove('hidden');
      const p = elNoKey.querySelector('p');
      if (p) p.textContent = 'Google Maps API key is missing or invalid for this domain. Configure /api/config.js or config_secret.js.';
      return;
    }

    elNoKey.classList.add('hidden');

    loadGoogleMaps(key)
      .then(initMap)
      .catch(() => {
        elNoKey.classList.remove('hidden');
        const p = elNoKey.querySelector('p');
        if (p) p.textContent = 'Failed to load Google Maps API. Check your key, referrer restrictions, billing and network.';
      });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', start);
  } else {
    start();
  }

})();