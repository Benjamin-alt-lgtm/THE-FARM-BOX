/**
 * main.js — UI logic for The Farm Box
 * ─────────────────────────────────────
 * • Smart two-state navbar (transparent hero / solid)
 * • Mobile menu toggle
 * • Featured product cards (homepage)
 * • Event delegation for all Add-to-Cart buttons (bulletproof)
 * • Scroll animations
 */

// ── NAVBAR ────────────────────────────────────────────────────────────────────
// CSS default = solid. On homepage only, we add .nav-hero at top, remove on scroll.
const navbar    = document.getElementById('navbar');
// Extract just the filename: "shop.html", "index.html", "" etc.
const _pageName = window.location.pathname.split('/').pop();
const isHomepage = (_pageName === 'index.html' || _pageName === '');

if (navbar && isHomepage) {
  navbar.classList.add('nav-hero');
  const onScroll = () => navbar.classList.toggle('nav-hero', window.scrollY <= 80);
  onScroll(); // run once immediately (handles back-button mid-scroll)
  window.addEventListener('scroll', onScroll, { passive: true });
}

// ── MOBILE MENU ───────────────────────────────────────────────────────────────
function toggleMenu() {
  const m = document.getElementById('mobile-menu');
  if (m) m.classList.toggle('hidden');
}
window.toggleMenu = toggleMenu;

// ── SCROLL ANIMATIONS ─────────────────────────────────────────────────────────
function initScrollAnimations() {
  if (!('IntersectionObserver' in window)) return;
  const els = document.querySelectorAll('[data-animate]');
  if (!els.length) return;
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('animate-fade-up'); obs.unobserve(e.target); }
    });
  }, { threshold: 0.1 });
  els.forEach(el => obs.observe(el));
}

// ── FEATURED PRODUCTS (homepage only) ────────────────────────────────────────
const FEATURED = [
  { id:'p1',  name:'Fresh Tomatoes',  price:1200, unit:'per 1kg',    tag:'bestseller', img:'https://images.unsplash.com/photo-1546094096-0df4bcaaa337?w=400&q=80' },
  { id:'p5',  name:'Ripe Plantain',   price:1100, unit:'per finger', tag:'bestseller', img:'https://images.unsplash.com/photo-1603833665858-e61d17a86224?w=400&q=80' },
  { id:'p8',  name:'Fresh Spinach',   price:650,  unit:'per bundle', tag:'organic',    img:'https://images.unsplash.com/photo-1574316071802-0d684efa7bf5?w=400&q=80' },
  { id:'p10', name:'Pineapple',       price:1500, unit:'per whole',  tag:'seasonal',   img:'https://images.unsplash.com/photo-1550258987-190a2d41a8ba?w=400&q=80' },
];

const TAG_COLORS = {
  bestseller:'bg-amber-100 text-amber-700',
  fresh:     'bg-green-100 text-green-700',
  seasonal:  'bg-blue-50 text-blue-600',
  organic:   'bg-lime-100 text-lime-700',
  local:     'bg-orange-100 text-orange-700',
};

// Builds a product card. Product data stored as JSON in data-product attribute
// so that event delegation can read it safely — no inline onclick, no & bug.
function buildProductCard(p) {
  const tagColor    = TAG_COLORS[p.tag] || 'bg-stone-100 text-stone-600';
  const productJSON = JSON.stringify(p).replace(/"/g, '&quot;');
  return `
    <div class="product-card bg-white rounded-2xl overflow-hidden border border-stone-100 hover:border-green-200 hover:shadow-xl hover:shadow-green-50">
      <div class="aspect-square overflow-hidden relative bg-stone-50">
        <img src="${p.img}" alt="${p.name}" loading="lazy"
             onerror="this.onerror=null;this.src='https://images.unsplash.com/photo-1542838132-92c53300491e?w=400&q=60'"
             class="w-full h-full object-cover hover:scale-105 transition-transform duration-500"/>
        ${p.tag ? `<span class="absolute top-2 left-2 text-xs font-semibold px-2.5 py-1 rounded-full ${tagColor} capitalize">${p.tag}</span>` : ''}
      </div>
      <div class="p-4">
        <h3 class="font-medium text-stone-800 text-sm mb-1 leading-snug">${p.name}</h3>
        <div class="flex items-baseline gap-1 mb-3">
          <span class="text-base font-bold text-green-700">₦${p.price.toLocaleString()}</span>
          <span class="text-xs text-stone-400">${p.unit || ''}</span>
        </div>
        <button class="add-to-cart-btn w-full bg-green-700 hover:bg-green-800 active:scale-95
                       text-white text-xs font-semibold py-2.5 rounded-full transition-all duration-150"
                data-product="${productJSON}" type="button">
          + Add to Cart
        </button>
      </div>
    </div>`;
}

function renderFeaturedProducts() {
  const el = document.getElementById('featured-products');
  if (el) el.innerHTML = FEATURED.map(buildProductCard).join('');
}

// ── EVENT DELEGATION — handles ALL cart buttons on the page ──────────────────
// One listener on document catches clicks on any .add-to-cart-btn element,
// including those rendered dynamically. Reads product via JSON.parse so
// special characters (like & in image URLs) are never a problem.
document.addEventListener('click', function(e) {
  const btn = e.target.closest('.add-to-cart-btn');
  if (!btn) return;
  e.preventDefault();
  e.stopPropagation();
  try {
    const product = JSON.parse(btn.getAttribute('data-product'));
    if (typeof window.addToCart === 'function') {
      window.addToCart(product);
      const orig = btn.textContent;
      btn.textContent = '✓ Added!';
      btn.disabled = true;
      setTimeout(() => { btn.textContent = orig; btn.disabled = false; }, 1200);
    }
  } catch(err) {
    console.error('Cart error:', err);
  }
});

// ── INIT ──────────────────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  initScrollAnimations();
  renderFeaturedProducts();
});
