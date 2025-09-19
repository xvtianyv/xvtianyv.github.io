document.addEventListener('DOMContentLoaded', () => {
    // --- Mobile Menu Logic ---
    const menuToggle = document.getElementById('menu-toggle');
    const navMenu = document.getElementById('nav-menu');

    if (menuToggle && navMenu) {
        menuToggle.addEventListener('click', () => {
            navMenu.classList.toggle('show');
            menuToggle.classList.toggle('active');
        });
    }

    // --- Desktop Hover Effect Logic ---
    const navLinks = document.querySelectorAll('.nav-button');
    const descriptionBox = document.getElementById('description-box');
    const body = document.body;
    // Ensure we get the initial color from the CSS variable if possible
    const originalBgColor = getComputedStyle(body).getPropertyValue('--body-bg-color').trim() || getComputedStyle(body).backgroundColor;

    if (navLinks.length > 0 && descriptionBox) {
        navLinks.forEach(link => {
            link.addEventListener('mouseenter', () => {
                // This effect is for desktop only, check viewport width
                if (window.innerWidth <= 800) return;

                const bgColor = link.dataset.bgColor;
                const description = link.dataset.description;

                if (bgColor) {
                    body.style.backgroundColor = bgColor;
                }
                if (description) {
                    descriptionBox.innerText = description;
                    descriptionBox.classList.add('show');
                }
            });

            link.addEventListener('mouseleave', () => {
                // This effect is for desktop only
                if (window.innerWidth <= 800) return;

                body.style.backgroundColor = originalBgColor;
                descriptionBox.classList.remove('show');
            });
        });
    }
});
