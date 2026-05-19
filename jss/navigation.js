// NAVIGATION

const nav = document.querySelector('nav');
const links = document.querySelectorAll('.links a');

window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        nav.classList.add('scrolled');
    } else {
        nav.classList.remove('scrolled');
    }
    
    // Update active link
    let current = '';
    document.querySelectorAll('section').forEach(section => {
        const sectionTop = section.offsetTop;
        if (pageYOffset >= sectionTop - 200) {
            current = section.getAttribute('id');
        }
    });
    
    links.forEach(link => {
        link.classList.remove('on');
        if (link.getAttribute('href') === '#' + current) {
            link.classList.add('on');
        }
    });
});

// Intro Animation
window.addEventListener('load', () => {
    const intro = document.getElementById('intro');
    setTimeout(() => {
        intro.classList.add('out');
    }, 2500);
});
