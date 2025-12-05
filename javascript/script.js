// --- Theme toggle light/dark mode ---
document.addEventListener('DOMContentLoaded', () => {
    const themeSwitch = document.getElementById('theme-switch');
    const savedTheme = localStorage.getItem('theme') || 'dark';

    if (savedTheme === 'light') {
        document.body.classList.add('light-mode');
        themeSwitch.checked = true;
    }

    themeSwitch.addEventListener('change', () => {
        if (themeSwitch.checked) {
            document.body.classList.add('light-mode');
            localStorage.setItem('theme', 'light');
        } else {
            document.body.classList.remove('light-mode');
            localStorage.setItem('theme', 'dark');
        }
    });
});

class MobileNavbar{
    constructor(mobileMenu, navList, navLinks) {
        this.mobileMenu = document.querySelector (mobileMenu);
        this.navList = document.querySelector (navList);
        this.navLinks = document.querySelectorAll (navLinks);
        this.activeClass = "active";

        this.handleClick = this.handleClick.bind(this);
    }
//funcionamento do navbar//
   animateLinks() {
        this.navLinks.forEach((link, index) => {
            if (link.style.animation) {
                link.style.animation = "";
            } else {
                link.style.animation = `navLinkFade 0.5s ease forwards ${index / 7 + 0.3}s`;
            }
        });
    }

   handleClick() {
    this.navList.classList.toggle(this.activeClass);
    this.mobileMenu.classList.toggle(this.activeClass);
    this.animateLinks();
   }


   addClickEvent() {
    this.mobileMenu.addEventListener ("click", this.handleClick);
   }

   init() {
    if (this.mobileMenu) {
        this.addClickEvent ();
    }
    return this;
   }
}

const mobileNavbar = new MobileNavbar(
    ".mobile-menu",
    ".nav-list",
    ".nav-list li",
);

mobileNavbar.init();

// Like button functionality for cards inside .pics
document.addEventListener('DOMContentLoaded', () => {
    const likeButtons = document.querySelectorAll('.like-btn');

    likeButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const countSpan = btn.nextElementSibling;
            if (!countSpan) return;

            // Incrementa o contador a cada clique (ilimitado)
            let count = parseInt(countSpan.textContent, 10) || 0;
            count = count + 1;
            countSpan.textContent = count;

            // Efeito visual curto para indicar o like
            btn.classList.add('liked');
            btn.setAttribute('aria-pressed', 'true');
            setTimeout(() => {
                btn.classList.remove('liked');
            }, 220);

            // ----- animação de coração caindo -----
            const section = btn.closest('section') || document.body;
            const heart = document.createElement('span');
            heart.className = 'flying-heart';
            heart.textContent = '❤';

            // calcular posição relativa ao section
            const btnRect = btn.getBoundingClientRect();
            const sectionRect = section.getBoundingClientRect();
            const heartSize = 20; // approximated font-size
            const left = btnRect.left - sectionRect.left + (btnRect.width / 2) - (heartSize / 2);
            const top = btnRect.top - sectionRect.top + (btnRect.height / 2) - (heartSize / 2);

            heart.style.left = `${left}px`;
            heart.style.top = `${top}px`;

            // small random horizontal drift and duration
            const dx = Math.floor(Math.random() * 60 - 30); // -30..30px
            heart.style.setProperty('--dx', dx + 'px');
            const dur = 700 + Math.floor(Math.random() * 500); // 700..1200ms
            heart.style.setProperty('--duration', dur + 'ms');

            section.appendChild(heart);

            // remove after animation ends to keep DOM clean
            heart.addEventListener('animationend', () => {
                heart.remove();
            });
            // safety remove after max duration + small buffer
            setTimeout(() => heart.remove(), dur + 300);
            // ----- fim animação -----
        });
    });

    // --- Popup de confirmação para o formulário ---
    const form = document.querySelector('#contato form');
    const popup = document.getElementById('submit-popup');

    if (form && popup) {
        const closeBtn = popup.querySelector('.popup-close');
        const backBtn  = popup.querySelector('.popup-back');
        let autoCloseTimer = null;

        const showPopup = () => {
            popup.classList.remove('hidden');
            requestAnimationFrame(() => popup.classList.add('show'));
            popup.setAttribute('aria-hidden', 'false');
        };

        const hidePopup = (skipDelay) => {
            popup.classList.remove('show');
            popup.setAttribute('aria-hidden', 'true');
            const delay = skipDelay ? 0 : 380;
            setTimeout(() => popup.classList.add('hidden'), delay);
        };

        form.addEventListener('submit', (e) => {
            e.preventDefault();

            showPopup();

            try { form.reset(); } catch (err) {}

            if (closeBtn) closeBtn.focus();

            if (autoCloseTimer) clearTimeout(autoCloseTimer);
            autoCloseTimer = setTimeout(() => hidePopup(), 3200);
        });

        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                if (autoCloseTimer) clearTimeout(autoCloseTimer);
                hidePopup();
            });
        }

        if (backBtn) {
            backBtn.addEventListener('click', () => {
                if (autoCloseTimer) clearTimeout(autoCloseTimer);
                hidePopup();
                const contatoSection = document.querySelector('#contato');
                if (contatoSection) {
                    contatoSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    setTimeout(() => {
                        const firstField = contatoSection.querySelector('input, textarea, select, button');
                        if (firstField) firstField.focus();
                    }, 560);
                }
            });
        }

        // Fechar popup ao clicar no overlay (fora do card)
        popup.addEventListener('click', (e) => {
            if (e.target === popup) {
                if (autoCloseTimer) clearTimeout(autoCloseTimer);
                hidePopup();
            }
        });

        // Fechar ao pressionar Esc
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && !popup.classList.contains('hidden')) {
                if (autoCloseTimer) clearTimeout(autoCloseTimer);
                hidePopup();
            }
        });
    }
});
