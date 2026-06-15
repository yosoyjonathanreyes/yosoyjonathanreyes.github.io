/**
 * script.js — Alarmas Integradas
 * ============================================================
 * Comportamiento interactivo del sitio web.
 * No depende de librerías externas (Vanilla JS puro).
 *
 * Módulos:
 *   1. Navbar mobile (hamburger)
 *   2. Hero Ken Burns (animación de fondo al cargar)
 *   3. Fade-in al hacer scroll (IntersectionObserver)
 *   4. Acordeón de servicios en mobile
 * ============================================================
 */


/* ─── 1. NAVBAR MOBILE ───────────────────────────────────── */
/**
 * Controla la apertura y cierre del menú hamburger en mobile.
 *
 * Comportamiento:
 * - Clic en #hamburger → alterna la clase .open en #mobile-menu
 * - Clic en cualquier link del menú → cierra el menú
 * - Scroll → cierra el menú si estaba abierto
 */
const hamburger  = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobile-menu');

/** Alterna el menú al presionar el botón hamburger */
hamburger.addEventListener('click', () => {
  mobileMenu.classList.toggle('open');
});

/**
 * Cierra el menú mobile al hacer clic en cualquier link interno
 * (.mobile-link) o en el botón CTA del menú mobile.
 */
document.querySelectorAll('.mobile-link, .mobile-menu .nav-cta').forEach(link => {
  link.addEventListener('click', () => mobileMenu.classList.remove('open'));
});

/**
 * Cierra el menú mobile al hacer scroll.
 * Mejora la UX al evitar que el menú tape el contenido
 * cuando el usuario empieza a explorar la página.
 */
window.addEventListener('scroll', () => {
  if (mobileMenu.classList.contains('open')) {
    mobileMenu.classList.remove('open');
  }
});


/* ─── 2. HERO KEN BURNS ──────────────────────────────────── */
/**
 * Activa el efecto Ken Burns en la imagen de fondo del hero.
 *
 * La imagen empieza con transform: scale(1.05) en CSS.
 * Al agregar .loaded, la transición CSS de 8 segundos
 * anima la imagen hasta scale(1), creando un zoom suave hacia afuera.
 *
 * Se espera al evento 'load' (no 'DOMContentLoaded') para asegurar
 * que la imagen esté completamente cargada antes de iniciar la animación.
 */
const heroBg = document.getElementById('hero-bg');

window.addEventListener('load', () => {
  heroBg.classList.add('loaded');
});


/* ─── 3. FADE-IN AL HACER SCROLL ────────────────────────── */
/**
 * Anima los elementos .fade-in al entrar en el viewport.
 *
 * Usa IntersectionObserver (nativo del navegador, sin librerías)
 * para detectar cuándo cada elemento entra al área visible.
 * Al hacerlo, agrega la clase .visible que activa la transición CSS.
 *
 * El setTimeout con escalonamiento (i * 80ms) hace que los elementos
 * aparezcan uno a uno cuando hay varios visibles simultáneamente,
 * en lugar de todos al mismo tiempo.
 *
 * threshold: 0.12 → el observador se dispara cuando el 12% del
 * elemento es visible (balance entre temprano y demasiado pronto).
 *
 * observer.unobserve() elimina el observer del elemento una vez
 * animado para no volver a dispararlo si el usuario hace scroll arriba.
 */
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      /** Escalonamiento: cada elemento aparece 80ms después del anterior */
      setTimeout(() => {
        entry.target.classList.add('visible');
      }, i * 80);

      /** Deja de observar el elemento una vez animado */
      observer.unobserve(entry.target);
    }
  });
}, {
  threshold: 0.12 /* Porcentaje del elemento visible para disparar */
});

/** Observa todos los elementos con clase .fade-in */
document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));


/* ─── 4. ACORDEÓN DE SERVICIOS (MOBILE) ─────────────────── */
/**
 * Convierte las tarjetas de servicio en acordeones en mobile.
 *
 * En viewports ≤768px, cada .service-card muestra por defecto
 * solo el ícono y el título. Al tocarla, se expande la descripción.
 *
 * Esta función:
 * 1. Verifica que el viewport sea ≤768px (evita correr en desktop)
 * 2. Inyecta el SVG del chevron después del .service-title
 * 3. Agrega el listener de clic que alterna la clase .open
 * 4. Usa data-accordionReady para evitar inicializar dos veces
 *    al mismo elemento (importante al llamar en resize)
 *
 * La animación de expansión usa max-height en CSS para una
 * transición suave (height: auto no es animable con CSS puro).
 *
 * @returns {void} — Sale temprano si el viewport es mayor a 768px
 */
function initServiceAccordion() {
  /** Solo inicializar en mobile */
  if (window.innerWidth > 768) return;

  document.querySelectorAll('.service-card').forEach(card => {
    /** Evita doble inicialización en el mismo elemento */
    if (card.dataset.accordionReady) return;
    card.dataset.accordionReady = 'true';

    /**
     * SVG del chevron (Heroicons ChevronDown).
     * Clase .service-chevron definida en styles.css:
     * rota 180° con .service-card.open para indicar estado abierto.
     */
    const chevronHTML = `
      <svg class="service-chevron"
           xmlns="http://www.w3.org/2000/svg"
           fill="none" viewBox="0 0 24 24"
           stroke-width="2" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5"/>
      </svg>`;

    /** Inserta el chevron inmediatamente después del título del servicio */
    card.querySelector('.service-title').insertAdjacentHTML('afterend', chevronHTML);

    /** Alterna .open al tocar la tarjeta */
    card.addEventListener('click', () => card.classList.toggle('open'));
  });
}

/** Inicialización al cargar la página */
initServiceAccordion();

/**
 * Re-inicializa al cambiar el tamaño de la ventana.
 * Si el usuario rota el dispositivo o redimensiona el navegador,
 * las tarjetas nuevas que entren en mobile se inicializarán correctamente.
 * data-accordionReady previene duplicar listeners en tarjetas ya inicializadas.
 */
window.addEventListener('resize', initServiceAccordion);
