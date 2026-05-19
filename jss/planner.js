// PLANNER LOGIC

let map, rL, rC, ms, me;
const mf = 1; // Battery efficiency multiplier
const RD_MUL = 1.25; // Road distance multiplier (actual road vs straight-line) - adjusted for accuracy

// OpenChargeMap API key - free tier (register at openchargemap.io for your own key)
const OCM_API_KEY = 'e0e86bd0-55b8-4c1e-a940-e5c9dc4a4c25';

// Populate dropdowns
function populate() {
    const sc = document.getElementById('sc');
    const ec = document.getElementById('ec');
    const evs = document.getElementById('evs');
    
    C.forEach((c, i) => {
        sc.innerHTML += `<option value="${i}">${c.n}</option>`;
        ec.innerHTML += `<option value="${i}">${c.n}</option>`;
    });
    ec.value = 1;
    
    E.forEach((e, i) => {
        evs.innerHTML += `<option value="${i}">${e.n}</option>`;
    });
    
    // Populate specs grid
    const sg = document.getElementById('specs-grid');
    E.forEach(e => {
        sg.innerHTML += `
            <div class="spec-card">
                <h3>${e.n}</h3>
                <div class="spec-item">
                    <span class="spec-key">Range</span>
                    <span class="spec-value">${e.r} km</span>
                </div>
                <div class="spec-item">
                    <span class="spec-key">Max Speed</span>
                    <span class="spec-value">${e.s} km/h</span>
                </div>
                <div class="spec-item">
                    <span class="spec-key">Price</span>
                    <span class="spec-value">₹${e.p.toLocaleString()}</span>
                </div>
                <div class="spec-item">
                    <span class="spec-key">Battery</span>
                    <span class="spec-value">${e.b} kWh</span>
                </div>
            </div>
        `;
    });
    
    // Populate models grid
    const eg = document.getElementById('ev-grid');
    E.forEach(e => {
        eg.innerHTML += `
            <div class="evc">
                <div class="ev-brand">EV</div>
                <div class="ev-name">${e.n}</div>
                <div class="ev-rng">${e.r} km</div>
                <div class="ev-rl">Max Range</div>
                <div class="ev-row">
                    <div class="ev-s"><span>${e.s} km/h</span>Speed</div>
                    <div class="ev-s"><span>₹${(e.p / 100000).toFixed(1)}L</span>Price</div>
                </div>
            </div>
        `;
    });
    
    // Update battery display
    const sl = document.getElementById('sl');
    sl.addEventListener('input', e => {
        document.getElementById('sl-val').textContent = e.target.value + '%';
        upd();
    });
    
    upd();
}

// Update values
function upd() {
    const ei = +document.getElementById('evs').value;
    const bv = +document.getElementById('sl').value;
    const av = Math.round(E[ei].r * (bv / 100) * mf);
    const si = +document.getElementById('sc').value;
    const di = +document.getElementById('ec').value;
    const d = hvs(C[si], C[di]) * RD_MUL; // Apply distance multiplier for road distance
    const ratio = av / d;
    
    document.getElementById('rva').textContent = av + ' km';
    document.getElementById('rvd').textContent = Math.round(d) + ' km';
    
    const sv = document.getElementById('rvs');
    
    if (ratio >= 1.2) {
        sv.textContent = 'COMFORT';
        sv.className = 'rv-status ok';
    } else if (ratio >= 0.9) {
        sv.textContent = 'CLOSE';
        sv.className = 'rv-status w';
    } else if (ratio >= 0.5) {
        sv.textContent = 'RECHARGE';
        sv.className = 'rv-status w';
    } else {
        sv.textContent = 'SHORT';
        sv.className = 'rv-status b';
    }
}

// Plan Trip
async function planTrip() {
    const si = +document.getElementById('sc').value;
    const di = +document.getElementById('ec').value;
    
    if (si === di) {
        toast('Select different start and destination');
        return;
    }
    
    const btn = document.getElementById('pb');
    btn.textContent = 'Calculating route...';
    btn.classList.add('busy');
    
    const S = C[si];
    const D = C[di];
    const ev = E[+document.getElementById('evs').value];
    const bv = +document.getElementById('sl').value;
    const av = Math.round(ev.r * (bv / 100) * mf);
    
    try {
        const res = await fetch(`https://router.project-osrm.org/route/v1/driving/${S.lon},${S.lat};${D.lon},${D.lat}?overview=full&geometries=geojson`);
        const data = await res.json();
        
        if (data.code !== 'Ok') throw new Error();
        
        const route = data.routes[0];
        const dk = Math.round(route.distance / 1000);
        const dm = Math.round(route.duration / 60);
        const coords = route.geometry.coordinates.map(c => [c[1], c[0]]);
        
        [rL, rC, ms, me].forEach(l => { if (l) map.removeLayer(l); });
        
        rL = L.polyline(coords, {
            color: '#e63329',
            weight: 3,
            opacity: 0.9,
            dashArray: av < dk ? '10,8' : null
        }).addTo(map);
        
        rC = L.circle([S.lat, S.lon], {
            radius: av * 1000,
            interactive: false,
            color: av >= dk ? '#00e070' : av > dk * 0.7 ? '#ff9900' : '#e63329',
            fillColor: av >= dk ? '#00e070' : av > dk * 0.7 ? '#ff9900' : '#e63329',
            fillOpacity: 0.04,
            opacity: 0.4,
            weight: 1.5,
            dashArray: '5,5'
        }).addTo(map);
        
        const pin = (t, col) => L.divIcon({
            html: `<div style="background:${col};color:${col === '#e63329' ? '#fff' : '#000'};font-family:'DM Sans';font-size:11px;font-weight:600;padding:5px 10px;border-radius:2px;white-space:nowrap;box-shadow:0 4px 20px rgba(0,0,0,.9)">${t}</div>`,
            className: '',
            iconAnchor: [0, 10]
        });
        
        ms = L.marker([S.lat, S.lon], { icon: pin('START | ' + S.n, '#f6f6f4') }).addTo(map);
        me = L.marker([D.lat, D.lon], { icon: pin('END | ' + D.n, '#e63329') }).addTo(map);
        
        map.fitBounds(rL.getBounds(), { padding: [60, 60] });
        
        const hrs = Math.floor(dm / 60);
        const mins = dm % 60;
        const stops = av < dk ? Math.ceil((dk - av) / (ev.r * 0.9)) : 0;
        const arr = Math.max(0, Math.round(bv - (dk / av) * bv));
        
        document.getElementById('rsd').textContent = dk + ' km';
        document.getElementById('rst').textContent = hrs > 0 ? `${hrs}h ${mins}m` : `${mins}m`;
        
        const sel = document.getElementById('rss');
        sel.textContent = stops > 0 ? stops + ' Stop(s)' : 'None';
        sel.className = 'rv2' + (stops > 0 ? ' w' : ' ok');
        
        const ael = document.getElementById('rsa');
        ael.textContent = arr + '%';
        ael.className = 'rv2' + (arr > 20 ? ' ok' : arr > 10 ? ' w' : ' b');
        
        // Get midpoint coords for charging station search along route
        const midIdx = Math.floor(coords.length / 2);
        const midLat = coords[midIdx][0];
        const midLon = coords[midIdx][1];

        await fetchEnv(D.lat, D.lon);

        // Fetch charging stations along the route
        await fetchChargingStations(S.lat, S.lon, D.lat, D.lon, coords, dk);
        
        document.getElementById('mapS').scrollIntoView({ behavior: 'smooth' });
        toast(`Route planned | ${dk} km | ${stops} charging stop(s)`, 'ok');
    } catch (e) {
        toast('Could not fetch route. Check connection.');
    }
    
    btn.textContent = 'Plan My Trip';
    btn.classList.remove('busy');
}

// ===== FETCH CHARGING STATIONS =====

// Helper: Find nearest city to coordinates
function getNearestCity(lat, lon) {
    let nearest = C[0];
    let minDist = haversineKm(lat, lon, C[0].lat, C[0].lon);
    
    for (let i = 1; i < C.length; i++) {
        const dist = haversineKm(lat, lon, C[i].lat, C[i].lon);
        if (dist < minDist) {
            minDist = dist;
            nearest = C[i];
        }
    }
    return nearest;
}

// Helper: Calculate shortest distance from point to route polyline
function distPointToRoute(lat, lon, routeCoords) {
    let minDist = Infinity;
    
    for (let i = 0; i < routeCoords.length - 1; i++) {
        const p1 = routeCoords[i];
        const p2 = routeCoords[i + 1];
        
        // Distance from point to line segment
        const dist = distPointToSegment(lat, lon, p1[0], p1[1], p2[0], p2[1]);
        if (dist < minDist) minDist = dist;
    }
    
    return minDist;
}

// Helper: Distance from point to line segment (using haversine)
function distPointToSegment(lat, lon, lat1, lon1, lat2, lon2) {
    const A = haversineKm(lat, lon, lat1, lon1);
    const B = haversineKm(lat, lon, lat2, lon2);
    const C = haversineKm(lat1, lon1, lat2, lon2);
    
    // Use triangle formula: area = sqrt(s(s-a)(s-b)(s-c)) where s = (a+b+c)/2
    const s = (A + B + C) / 2;
    const area = Math.sqrt(Math.max(0, s * (s - A) * (s - B) * (s - C)));
    
    // Distance = 2*area / base
    const dist = C > 0 ? (2 * area) / C : Math.min(A, B);
    return dist;
}

async function fetchChargingStations(sLat, sLon, dLat, dLon, routeCoords, routeDistKm) {
    const section = document.getElementById('chargingS');
    const grid = document.getElementById('charging-grid');
    const countEl = document.getElementById('charging-count');

    // Show section with loading state
    section.style.display = 'block';
    grid.innerHTML = `<div class="charging-loading"><span>SCANNING CHARGING INFRASTRUCTURE...</span></div>`;

    // Calculate search radius along route
    const radiusKm = Math.min(8, routeDistKm / 10);

    // Sample points along the route (every ~20km or so)
    const searchPoints = [];
    const sampleInterval = Math.max(3, Math.floor(routeCoords.length / 15));
    for (let i = 0; i < routeCoords.length; i += sampleInterval) {
        searchPoints.push({
            lat: routeCoords[i][0],
            lon: routeCoords[i][1]
        });
    }

    let allStations = [];

    try {
        // Use Overpass API (free, no key needed) - OSM charging stations
        const overpassResults = await Promise.allSettled(
            searchPoints.map(pt =>
                fetch(`https://overpass-api.de/api/interpreter?data=[out:json][timeout:20];node["amenity"="charging_station"](around:${radiusKm * 1000},${pt.lat},${pt.lon});out body 6;`)
                    .then(r => r.json())
                    .then(d => ({ elements: d.elements || [] }))
                    .catch(() => ({ elements: [] }))
            )
        );

        // Process OSM results and remove duplicates
        overpassResults.forEach(res => {
            if (res.status === 'fulfilled') {
                const { elements } = res.value;
                elements.forEach(el => {
                    if (!allStations.find(s => s.id === el.id)) {
                        const tags = el.tags || {};
                        const isFast = tags['socket:chademo'] || tags['socket:type2_combo'] || tags['capacity'] > 4 || tags['charging:fast'] === 'yes';
                        const nearestCity = getNearestCity(el.lat, el.lon);
                        const distFromStart = haversineKm(sLat, sLon, el.lat, el.lon);
                        const distFromEnd = haversineKm(dLat, dLon, el.lat, el.lon);
                        const distToRoute = distPointToRoute(el.lat, el.lon, routeCoords);
                        
                        allStations.push({
                            id: el.id,
                            name: tags.name || tags.operator || tags.brand || 'Charging Station',
                            address: [tags['addr:street'], tags['addr:city']].filter(Boolean).join(', ') || nearestCity.n,
                            city: nearestCity.n,
                            lat: el.lat,
                            lon: el.lon,
                            fast: !!isFast,
                            operator: tags.operator || tags.network || null,
                            sockets: tags.capacity || null,
                            distFromStart: distFromStart.toFixed(1),
                            distFromEnd: distFromEnd.toFixed(1),
                            distToRoute: distToRoute.toFixed(2)
                        });
                    }
                });
            }
        });

        // Filter: Keep ONLY stations actually on/near the route
        allStations = allStations.filter(s => {
            const onRoute = parseFloat(s.distToRoute) <= 5; // Within 5km of route
            const betweenEnds = parseFloat(s.distFromStart) > 10 && parseFloat(s.distFromEnd) > 10; // Not at start/end
            return onRoute && betweenEnds;
        });

        // Sort by distance from start
        allStations.sort((a, b) => parseFloat(a.distFromStart) - parseFloat(b.distFromStart));
        allStations = allStations.slice(0, 15);

    } catch (err) {
        // Silently fall through to fallback
    }

    // If OSM returns nothing (common in smaller towns), fall back to known ST hubs
    if (allStations.length === 0) {
        allStations = ST.map((s, i) => {
            const nearestCity = getNearestCity(s.lat, s.lon);
            const distFromStart = haversineKm(sLat, sLon, s.lat, s.lon);
            const distFromEnd = haversineKm(dLat, dLon, s.lat, s.lon);
            const distToRoute = distPointToRoute(s.lat, s.lon, routeCoords);
            return {
                id: i,
                name: s.n,
                address: nearestCity.n,
                city: nearestCity.n,
                lat: s.lat,
                lon: s.lon,
                fast: i % 2 === 0,
                operator: 'COGNIVOLTS Network',
                sockets: (i % 3) + 2,
                distFromStart: distFromStart.toFixed(1),
                distFromEnd: distFromEnd.toFixed(1),
                distToRoute: distToRoute.toFixed(2)
            };
        }).filter(s => parseFloat(s.distToRoute) <= 8 && parseFloat(s.distFromStart) > 10 && parseFloat(s.distFromEnd) > 10);
        
        allStations.sort((a, b) => parseFloat(a.distFromStart) - parseFloat(b.distFromStart));
    }

    countEl.textContent = allStations.length + ' STATIONS FOUND';

    if (allStations.length === 0) {
        grid.innerHTML = `<div class="charging-loading"><span>NO STATIONS FOUND ALONG THIS ROUTE</span></div>`;
        return;
    }

    grid.innerHTML = allStations.map(s => `
        <div class="charging-card">
            <span class="ch-icon">⚡</span>
            <div class="ch-name">${escHtml(s.name)}</div>
            <div class="ch-addr">${escHtml(s.city)} • ${escHtml(s.address)}</div>
            <div class="ch-meta">
                <span class="ch-tag ${s.fast ? 'fast' : 'slow'}">${s.fast ? '⚡ Fast Charge' : '🔋 Slow Charge'}</span>
                <span class="ch-tag dist">~${s.distFromStart} km from start</span>
                ${s.sockets ? `<span class="ch-tag dist">${s.sockets} ports</span>` : ''}
                ${s.operator ? `<span class="ch-tag dist">${escHtml(s.operator)}</span>` : ''}
            </div>
        </div>
    `).join('');

    // Also add markers to the map
    allStations.forEach(s => {
        const el = document.createElement('div');
        el.className = 'csm';
        el.textContent = s.fast ? '⚡' : 'C';
        el.style.background = s.fast ? '#00e070' : '#ff9900';
        el.style.fontSize = '10px';
        L.marker([s.lat, s.lon], {
            icon: L.divIcon({
                html: el.outerHTML,
                className: '',
                iconSize: [22, 22],
                iconAnchor: [11, 11]
            })
        }).bindPopup(`<b>${s.name}</b><br>${s.city}<br>${s.address}<br>${s.fast ? '⚡ Fast Charge' : '🔋 Slow Charge'}<br>${s.distFromStart} km from start`).addTo(map);
    });

    setTimeout(() => section.scrollIntoView({ behavior: 'smooth' }), 600);
}

// Helper: haversine km (simple)
function haversineKm(lat1, lon1, lat2, lon2) {
    const R = 6371;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat/2)**2 + Math.cos(lat1*Math.PI/180)*Math.cos(lat2*Math.PI/180)*Math.sin(dLon/2)**2;
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
}

// Helper: escape HTML
function escHtml(str) {
    return String(str).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

// Fetch Weather Data
async function fetchEnv(lat, lon) {
    try {
        const r = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,wind_speed_10m,relative_humidity_2m,weather_code&timezone=auto`);
        const d = await r.json();
        const c = d.current;
        
        const T = Math.round(c.temperature_2m);
        const W = Math.round(c.wind_speed_10m);
        const H = Math.round(c.relative_humidity_2m);
        const code = c.weather_code;
        
        let eff = 1;
        if (T > 40) eff -= 0.13;
        else if (T > 35) eff -= 0.07;
        else if (T < 10) eff -= 0.18;
        else if (T < 5) eff -= 0.28;
        if (W > 30) eff -= 0.08;
        if (W > 50) eff -= 0.14;
        if (H > 85) eff -= 0.04;
        
        eff = Math.max(0.5, Math.min(1, eff));
        const ep = Math.round(eff * 100);
        
        let aqi = 'GOOD';
        let aqin = 'Clean air and light wind';
        
        if (code === 0 && W > 8) {
            aqi = 'GOOD';
            aqin = 'Excellent conditions';
        } else if (code <= 2) {
            aqi = 'MOD';
            aqin = 'Typical urban air quality';
        } else if (code >= 61) {
            aqi = 'FRESH';
            aqin = 'Rain clearing particulates';
        } else {
            aqi = 'MOD';
            aqin = 'Check local AQI';
        }
        
        document.getElementById('et').textContent = T + ' C';
        document.getElementById('etn').textContent = T > 38 ? 'Heat may reduce range' : (T < 10 ? 'Cold may reduce efficiency' : 'Temperature looks stable');
        document.getElementById('ew').textContent = W + ' km/h';
        document.getElementById('ewn').textContent = W > 25 ? 'Headwind may reduce range' : 'Low wind drag';
        document.getElementById('eh').textContent = H + '%';
        document.getElementById('ehn').textContent = H > 80 ? 'High humidity detected' : (H > 50 ? 'Comfortable levels' : 'Dry conditions');
        document.getElementById('ee').textContent = ep + '%';
        
        const ef = document.getElementById('eef');
        ef.style.width = ep + '%';
        ef.style.background = ep > 80 ? 'var(--green)' : ep > 60 ? '#ff9900' : 'var(--red)';
        
        setTimeout(() => document.getElementById('envS').scrollIntoView({ behavior: 'smooth' }), 900);
    } catch (e) {
        console.error(e);
    }
}

// Initialize Map
function initMap() {
    map = L.map('map');
    L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
        attribution: 'Esri',
        maxZoom: 19
    }).addTo(map);
    
    L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}', {
        maxZoom: 19,
        opacity: 0.75
    }).addTo(map);
    
    map.setView([20.59, 78.96], 5);
    
    ST.forEach(s => {
        const el = document.createElement('div');
        el.className = 'csm';
        el.textContent = 'C';
        L.marker([s.lat, s.lon], {
            icon: L.divIcon({
                html: el.outerHTML,
                className: '',
                iconSize: [22, 22],
                iconAnchor: [11, 11]
            })
        }).bindPopup(`<b>${s.n}</b><br>Fast charging hub`).addTo(map);
    });
}
