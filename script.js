document.addEventListener('DOMContentLoaded', () => {
    // 1. Navegación Móvil (Menú Hamburguesa)
    const menuToggle = document.getElementById('menuToggle');
    const navMenu = document.getElementById('navMenu');

    if (menuToggle && navMenu) {
        menuToggle.addEventListener('click', () => {
            const isExpanded = menuToggle.getAttribute('aria-expanded') === 'true';
            menuToggle.setAttribute('aria-expanded', !isExpanded);
            navMenu.classList.toggle('active');
            menuToggle.classList.toggle('open');
        });
    }

    // Cerrar menú al hacer clic en un enlace en móviles
    document.querySelectorAll('.nav-item a').forEach(link => {
        link.addEventListener('click', () => {
            if (navMenu && navMenu.classList.contains('active')) {
                navMenu.classList.remove('active');
                menuToggle.setAttribute('aria-expanded', 'false');
            }
        });
    });

    // 2. Control de Header al hacer Scroll
    const header = document.querySelector('.header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.style.padding = '0.5rem 0';
            header.style.background = 'rgba(15, 20, 25, 0.98)';
        } else {
            header.style.padding = '0.75rem 0';
            header.style.background = 'rgba(15, 20, 25, 0.95)';
        }
    });

    // 3. Sistema de Partículas Liviano con RequestAnimationFrame
    const particleContainer = document.getElementById('particles');
    const particles = [];
    const maxParticles = 35; // Controlado para evitar consumo de batería

    class Particle {
        constructor() {
            this.el = document.createElement('div');
            this.el.className = 'particle';
            this.reset();
            particleContainer.appendChild(this.el);
        }

        reset() {
            this.x = Math.random() * window.innerWidth;
            this.y = window.innerHeight + Math.random() * 100;
            this.size = Math.random() * 4 + 2;
            this.speedY = -(Math.random() * 1.5 + 0.5);
            this.speedX = (Math.random() - 0.5) * 0.5;
            this.opacity = Math.random() * 0.5 + 0.2;

            this.el.style.width = `${this.size}px`;
            this.el.style.height = `${this.size}px`;
            this.el.style.opacity = this.opacity;
        }

        update() {
            this.y += this.speedY;
            this.x += this.speedX;

            if (this.y < -10) {
                this.reset();
            } else {
                this.el.style.transform = `translate3d(${this.x}px, ${this.y}px, 0)`;
            }
        }
    }

    if (particleContainer && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        for (let i = 0; i < maxParticles; i++) {
            particles.push(new Particle());
        }

        function animate() {
            particles.forEach(p => p.update());
            requestAnimationFrame(animate);
        }
        animate();
    }

    // 4. Efecto de entrada por Scroll (Intersection Observer)
    const fadeElements = document.querySelectorAll('.fade-in');
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    fadeElements.forEach(el => observer.observe(el));

    // 5. Lightbox Dinámico para Imágenes de Servicios
    const serviceImageLinks = document.querySelectorAll('.service-image-link');
    const imageOverlay = document.getElementById('imageOverlay');
    const overlayImage = document.getElementById('overlayImage');

    if (serviceImageLinks && imageOverlay && overlayImage) {
        serviceImageLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const fullsizeUrl = link.getAttribute('data-fullsize');
                overlayImage.src = fullsizeUrl;
                imageOverlay.classList.add('show');
                imageOverlay.setAttribute('aria-hidden', 'false');
            });
        });

        imageOverlay.addEventListener('click', () => {
            imageOverlay.classList.remove('show');
            imageOverlay.setAttribute('aria-hidden', 'true');
            overlayImage.src = '';
        });
    }

    // 6. Modal de Privacidad & Consentimiento de Cookies
    const cookieBanner = document.getElementById('cookieConsentBanner');
    const acceptCookiesBtn = document.getElementById('acceptCookies');
    const showPrivacyBtn = document.getElementById('showPrivacyPolicy');
    const privacyModal = document.getElementById('privacyPolicyModal');
    const closePrivacyBtn = document.getElementById('closePrivacyModal');

    if (cookieBanner && acceptCookiesBtn) {
        // Verificar LocalStorage para el banner de cookies
        if (!localStorage.getItem('cookiesAccepted')) {
            setTimeout(() => {
                cookieBanner.classList.add('show');
            }, 1200);
        }

        acceptCookiesBtn.addEventListener('click', () => {
            localStorage.setItem('cookiesAccepted', 'true');
            cookieBanner.classList.remove('show');
        });
    }

    // Lógica para abrir/cerrar modal de privacidad de forma asíncrona
    if (showPrivacyBtn && privacyModal && closePrivacyBtn) {
        showPrivacyBtn.addEventListener('click', (e) => {
            e.preventDefault();
            privacyModal.classList.add('show');
            privacyModal.setAttribute('aria-hidden', 'false');
        });

        const closeModal = () => {
            privacyModal.classList.remove('show');
            privacyModal.setAttribute('aria-hidden', 'true');
        };

        closePrivacyBtn.addEventListener('click', closeModal);
        window.addEventListener('click', (e) => {
            if (e.target === privacyModal) closeModal();
        });
    }
});
