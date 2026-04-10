import './style.css'

// Micro-interactions and lifecycle
document.addEventListener('DOMContentLoaded', () => {
    console.log('Kuyen Platform Initialized');

    // Smooth reveal for logo
    const logo = document.querySelector('.logo');
    if (logo) {
        logo.style.transition = 'letter-spacing 0.8s ease';
        setTimeout(() => {
            logo.style.letterSpacing = '8px';
        }, 500);
    }

    // Scroll reveal effect for navbar glass
    window.addEventListener('scroll', () => {
        const navbar = document.querySelector('.navbar');
        if (window.scrollY > 50) {
            navbar.style.padding = '1rem 5%';
            navbar.style.background = 'rgba(0, 0, 0, 0.8)';
        } else {
            navbar.style.padding = '1.5rem 5%';
            navbar.style.background = 'rgba(255, 255, 255, 0.03)';
        }
    });

    // Hover sound/effect placeholder for buttons
    const buttons = document.querySelectorAll('.btn');
    buttons.forEach(btn => {
        btn.addEventListener('mouseenter', () => {
            // Future sound implementation
        });
    });
});
