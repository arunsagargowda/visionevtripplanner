// APP INITIALIZATION

document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('year').textContent = new Date().getFullYear();
    populate();
    initMap();
    updBatt();
    initGallery();
});

// Battery update
function updBatt() {
    const sl = document.getElementById('sl');
    sl.addEventListener('input', () => { upd(); });
}

// TIME-BASED GREETING
function setGreeting() {
    const el = document.getElementById("greeting");
    if (!el) return;
    const hour = new Date().getHours();
    let text = "";
    if (hour < 12) text = "HELLO! GOOD MORNING";
    else if (hour < 17) text = "HELLO! GOOD AFTERNOON";
    else if (hour < 21) text = "HELLO! GOOD EVENING";
    else text = "Have a nice night";
    el.textContent = text;
}
window.addEventListener("load", setGreeting);

// Contact form
function handleContact(e) {
    e.preventDefault();
    toast('Message received! We\'ll get back to you soon.', 'ok');
    e.target.reset();
}


// =======================================================
//  IMMERSIVE GALLERY
//  5 sheets, each full viewport wide, ONE card per sheet.
//  Navigation: cursor X position pans automatically (no
//  need to click) + arrow buttons + drag/swipe + keyboard.
// =======================================================

const GALLERY_TOTAL_SHEETS = 5;

// Per-sheet unique backgrounds (for the section element)
const SHEET_BG = [
    'linear-gradient(135deg, #0d0d22 0%, #1a0a0a 60%, #0d0d22 100%)',
    'linear-gradient(135deg, #001a0f 0%, #0a1a0a 50%, #001215 100%)',
    'linear-gradient(135deg, #1a1000 0%, #0a0a18 50%, #1a0010 100%)',
    'linear-gradient(135deg, #000a1a 0%, #0a0a1a 50%, #001020 100%)',
    'linear-gradient(135deg, #1a000a 0%, #0a0a14 50%, #100015 100%)',
];

const GALLERY_LABELS = [
    'Add Your Ride',
    'Journey Moment',
    'Charging Stop',
    'Scenic Route',
    'Destination'
];

// State
let gallerySheet = 0;
let galleryImages = {};   // { sheetIndex: dataURL }

// Cursor-drive state
let cursorPanEnabled = false;   // only active when gallery is in viewport
let cursorPanTimer = null;

function initGallery() {
    buildGallerySheets();
    buildGalleryDots();
    setupGalleryDrag();
    setupCursorPan();
    goToSheet(0, false);
}

// ── Build sheets ──────────────────────────────────────
function buildGallerySheets() {
    const track = document.getElementById('gallery-track');
    track.innerHTML = '';

    for (let i = 0; i < GALLERY_TOTAL_SHEETS; i++) {
        // Sheet wrapper
        const sheet = document.createElement('div');
        sheet.className = `g-sheet g-sheet-${i}`;
        sheet.dataset.sheet = i;

        // Sheet number label
        const num = document.createElement('div');
        num.className = 'g-sheet-num';
        num.textContent = `SHEET ${i + 1} / ${GALLERY_TOTAL_SHEETS}`;

        // Accent line
        const line = document.createElement('div');
        line.className = 'g-sheet-line';

        // Card
        const card = document.createElement('div');
        card.className = 'g-card';
        card.dataset.index = i;
        card.innerHTML = cardHTML(i);

        // Hidden file input
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*';
        input.className = 'g-file-input';
        input.id = `g-input-${i}`;
        input.dataset.cardIndex = i;
        input.addEventListener('change', handleImageUpload);
        card.appendChild(input);

        // Click to upload (prevent click during drag)
        card.addEventListener('click', (e) => {
            if (!wasDragging) {
                document.getElementById(`g-input-${i}`).click();
            }
        });

        sheet.appendChild(num);
        sheet.appendChild(card);
        sheet.appendChild(line);
        track.appendChild(sheet);
    }
}

function cardHTML(i) {
    const img = galleryImages[i];
    if (img) {
        return `
            <img src="${img}" alt="Ride photo ${i+1}" draggable="false">
            <div class="g-card-overlay">
                <span class="g-card-overlay-text">CHANGE IMAGE</span>
            </div>
            <div class="g-card-label">${GALLERY_LABELS[i] || 'My Ride'}</div>
        `;
    }
    return `
        <div class="g-card-placeholder">
            <div class="g-card-placeholder-icon">＋</div>
            <div class="g-card-placeholder-text">${GALLERY_LABELS[i] || 'Add Image'}</div>
        </div>
        <div class="g-card-label">${GALLERY_LABELS[i] || 'Slot ' + (i+1)}</div>
    `;
}

function handleImageUpload(e) {
    const file = e.target.files[0];
    if (!file) return;
    const idx = parseInt(e.target.dataset.cardIndex);
    const reader = new FileReader();
    reader.onload = (ev) => {
        galleryImages[idx] = ev.target.result;
        const card = document.querySelector(`.g-card[data-index="${idx}"]`);
        if (card) {
            const input = card.querySelector('.g-file-input');
            card.innerHTML = cardHTML(idx);
            card.appendChild(input);
        }
        toast('Image added to your gallery!', 'ok');
    };
    reader.readAsDataURL(file);
}

// ── Dots ──────────────────────────────────────────────
function buildGalleryDots() {
    const dotsEl = document.getElementById('gallery-dots');
    dotsEl.innerHTML = '';
    for (let i = 0; i < GALLERY_TOTAL_SHEETS; i++) {
        const dot = document.createElement('div');
        dot.className = 'g-dot' + (i === gallerySheet ? ' active' : '');
        dot.dataset.sheet = i;
        dot.addEventListener('click', () => goToSheet(i));
        dotsEl.appendChild(dot);
    }
}

function updateDots() {
    document.querySelectorAll('.g-dot').forEach((dot, i) => {
        dot.classList.toggle('active', i === gallerySheet);
    });
    document.getElementById('g-page').textContent = `SHEET ${gallerySheet + 1} / ${GALLERY_TOTAL_SHEETS}`;
}

// ── Sheet navigation ──────────────────────────────────
function goToSheet(sheetIndex, animate = true) {
    gallerySheet = Math.max(0, Math.min(GALLERY_TOTAL_SHEETS - 1, sheetIndex));

    const track = document.getElementById('gallery-track');
    const offset = gallerySheet * window.innerWidth;

    if (!animate) {
        track.style.transition = 'none';
    } else {
        track.style.transition = 'transform 0.65s cubic-bezier(0.77, 0, 0.175, 1)';
    }

    track.style.transform = `translateX(-${offset}px)`;
    updateDots();

    // Restore transition after frame
    if (!animate) {
        requestAnimationFrame(() => {
            track.style.transition = 'transform 0.65s cubic-bezier(0.77, 0, 0.175, 1)';
        });
    }
}

function galleryPrev() { goToSheet(gallerySheet - 1); }
function galleryNext() { goToSheet(gallerySheet + 1); }


// ── Cursor-driven panning ─────────────────────────────
// When cursor is in the gallery section, the X position
// controls which sheet is shown (like a scrubber).
// Moving to the far right glides to the last sheet,
// far left goes back to sheet 0.

function setupCursorPan() {
    const section = document.getElementById('gallery');
    if (!section) return;

    // Track cursor over the gallery section
    section.addEventListener('mousemove', onGalleryCursorMove);
    section.addEventListener('mouseleave', () => {
        cursorPanEnabled = false;
        clearTimeout(cursorPanTimer);
    });
    section.addEventListener('mouseenter', () => {
        cursorPanEnabled = true;
    });
}

// Throttle cursor pan to avoid jitter
let lastCursorPanSheet = -1;

function onGalleryCursorMove(e) {
    if (!cursorPanEnabled) return;
    if (isDragging) return; // don't interfere with drag

    const section = document.getElementById('gallery');
    const rect = section.getBoundingClientRect();
    const relX = (e.clientX - rect.left) / rect.width; // 0..1

    // Map cursor X to sheet index
    const targetSheet = Math.round(relX * (GALLERY_TOTAL_SHEETS - 1));

    // Update cursor progress bar
    const fill = document.getElementById('g-cursor-fill');
    if (fill) fill.style.width = (relX * 100) + '%';

    if (targetSheet !== lastCursorPanSheet) {
        lastCursorPanSheet = targetSheet;
        clearTimeout(cursorPanTimer);
        // Small delay so it doesn't snap on every tiny mouse move
        cursorPanTimer = setTimeout(() => {
            goToSheet(targetSheet);
        }, 120);
    }
}

// ── Drag / Swipe ──────────────────────────────────────
let isDragging = false;
let wasDragging = false;
let dragStartX = 0;
let dragCurrentX = 0;
let dragVelocity = 0;
let dragLastX = 0;
let dragStartTime = 0;
let dragStartTranslate = 0;

function getCurrentTranslate() {
    const track = document.getElementById('gallery-track');
    const style = window.getComputedStyle(track);
    const matrix = new DOMMatrixReadOnly(style.transform);
    return matrix.m41;
}

function setupGalleryDrag() {
    const viewport = document.getElementById('gallery-viewport');
    if (!viewport) return;

    viewport.addEventListener('mousedown', onDragStart);
    window.addEventListener('mousemove', onDragMove);
    window.addEventListener('mouseup', onDragEnd);

    viewport.addEventListener('touchstart', onTouchStart, { passive: true });
    viewport.addEventListener('touchmove', onTouchMove, { passive: false });
    viewport.addEventListener('touchend', onTouchEnd);
}

function onDragStart(e) {
    isDragging = true;
    wasDragging = false;
    dragStartX = e.clientX;
    dragLastX = e.clientX;
    dragStartTranslate = getCurrentTranslate();
    dragVelocity = 0;
    dragStartTime = Date.now();

    const viewport = document.getElementById('gallery-viewport');
    viewport.classList.add('dragging');

    const track = document.getElementById('gallery-track');
    track.style.transition = 'none';
}

function onDragMove(e) {
    if (!isDragging) return;
    const dx = e.clientX - dragStartX;
    dragVelocity = e.clientX - dragLastX;
    dragLastX = e.clientX;

    if (Math.abs(dx) > 5) wasDragging = true;

    const track = document.getElementById('gallery-track');
    const newTranslate = dragStartTranslate + dx;
    const maxTranslate = 0;
    const minTranslate = -(GALLERY_TOTAL_SHEETS - 1) * window.innerWidth;
    const clamped = Math.max(minTranslate, Math.min(maxTranslate, newTranslate));
    track.style.transform = `translateX(${clamped}px)`;
}

function onDragEnd(e) {
    if (!isDragging) return;
    isDragging = false;

    const viewport = document.getElementById('gallery-viewport');
    viewport.classList.remove('dragging');

    const elapsed = Date.now() - dragStartTime;
    const totalDx = e.clientX - dragStartX;

    const sheetW = window.innerWidth;
    const swipeFast = Math.abs(dragVelocity) > 6 && elapsed < 400;
    const swipeFar = Math.abs(totalDx) > sheetW * 0.25;
    let targetSheet = gallerySheet;

    if (swipeFast || swipeFar) {
        targetSheet = totalDx < 0 ? gallerySheet + 1 : gallerySheet - 1;
    } else {
        const cur = getCurrentTranslate();
        targetSheet = Math.round(-cur / sheetW);
    }

    goToSheet(targetSheet);
    setTimeout(() => { wasDragging = false; }, 50);
}

function onTouchStart(e) {
    const t = e.touches[0];
    isDragging = true;
    wasDragging = false;
    dragStartX = t.clientX;
    dragLastX = t.clientX;
    dragStartTranslate = getCurrentTranslate();
    dragVelocity = 0;
    dragStartTime = Date.now();
    const track = document.getElementById('gallery-track');
    track.style.transition = 'none';
}

function onTouchMove(e) {
    if (!isDragging) return;
    const t = e.touches[0];
    const dx = t.clientX - dragStartX;
    dragVelocity = t.clientX - dragLastX;
    dragLastX = t.clientX;
    if (Math.abs(dx) > 5) {
        wasDragging = true;
        e.preventDefault();
    }
    const track = document.getElementById('gallery-track');
    const newTranslate = dragStartTranslate + dx;
    const minTranslate = -(GALLERY_TOTAL_SHEETS - 1) * window.innerWidth;
    const clamped = Math.max(minTranslate, Math.min(0, newTranslate));
    track.style.transform = `translateX(${clamped}px)`;
}

function onTouchEnd(e) {
    if (!isDragging) return;
    isDragging = false;
    const t = e.changedTouches[0];
    const elapsed = Date.now() - dragStartTime;
    const totalDx = t.clientX - dragStartX;
    const sheetW = window.innerWidth;
    const swipeFast = Math.abs(dragVelocity) > 6 && elapsed < 400;
    const swipeFar = Math.abs(totalDx) > sheetW * 0.25;
    let targetSheet = gallerySheet;
    if (swipeFast || swipeFar) {
        targetSheet = totalDx < 0 ? gallerySheet + 1 : gallerySheet - 1;
    } else {
        const cur = getCurrentTranslate();
        targetSheet = Math.round(-cur / sheetW);
    }
    goToSheet(targetSheet);
    setTimeout(() => { wasDragging = false; }, 50);
}

// Keyboard navigation
document.addEventListener('keydown', (e) => {
    const gs = document.getElementById('gallery');
    if (!gs) return;
    const rect = gs.getBoundingClientRect();
    if (rect.top > window.innerHeight || rect.bottom < 0) return;
    if (e.key === 'ArrowRight') galleryNext();
    if (e.key === 'ArrowLeft') galleryPrev();
});

// Re-layout on resize
window.addEventListener('resize', () => { goToSheet(gallerySheet, false); });
