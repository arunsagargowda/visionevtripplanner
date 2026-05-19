// CUSTOM CURSOR

const cur = document.getElementById('cur');
const ring = document.getElementById('ring');

document.addEventListener('mousemove', e => {
    cur.style.left = e.clientX + 'px';
    cur.style.top = e.clientY + 'px';
    ring.style.left = e.clientX + 'px';
    ring.style.top = e.clientY + 'px';
});

document.addEventListener('mouseover', e => {
    if (e.target.tagName === 'A' || e.target.tagName === 'BUTTON' || e.target.tagName === 'SELECT') {
        document.body.classList.add('cur-hover');
    }
});

document.addEventListener('mouseout', e => {
    if (e.target.tagName === 'A' || e.target.tagName === 'BUTTON' || e.target.tagName === 'SELECT') {
        document.body.classList.remove('cur-hover');
    }
});
