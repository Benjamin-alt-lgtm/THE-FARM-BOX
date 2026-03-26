/**
 * api.js — Simulated REST API for The Farm Box
 * ─────────────────────────────────────────────
 * All functions return Promises that resolve with { success, data }.
 * To connect a real backend, replace each function body with a fetch() call
 * to the matching endpoint shown in the comment above it.
 *
 * Endpoints:
 *   GET  /api/products          → getProducts(category?)
 *   GET  /api/products/:id      → getProductById(id)
 *   GET  /api/boxes             → getBoxes()
 *   POST /api/orders            → postOrder(data)
 *   POST /api/subscriptions     → postSubscription(data)
 *   POST /api/contact           → postContact(data)
 */

const API_BASE = 'https://api.thefarmbox.ng/v1'; // swap for real URL

// ── Product catalogue ────────────────────────────────────────────────────────
const _PRODUCTS = [
  { id:'p1',  name:'Fresh Tomatoes',          price:1200, unit:'per 1kg',    category:'vegetables', tag:'bestseller', img:'https://images.unsplash.com/photo-1546094096-0df4bcaaa337?w=400&q=80' },
  { id:'p2',  name:'Ugu Leaves',              price:800,  unit:'per bundle', category:'vegetables', tag:'fresh',      img:'https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=400&q=80' },
  { id:'p3',  name:'Sweet Pepper (Tatashe)',  price:950,  unit:'per 500g',   category:'vegetables', tag:'fresh',      img:'https://images.unsplash.com/photo-1563565375-f3fdfdbefa83?w=400&q=80' },
  { id:'p4',  name:'Garden Eggs',             price:700,  unit:'per 500g',   category:'vegetables', tag:'local',      img:'https://images.unsplash.com/photo-1598030304671-5aa1d6f21128?w=400&q=80' },
  { id:'p5',  name:'Ripe Plantain',           price:1100, unit:'per finger', category:'fruits',     tag:'bestseller', img:'https://images.unsplash.com/photo-1603833665858-e61d17a86224?w=400&q=80' },
  { id:'p6',  name:'Watermelon',              price:3500, unit:'per whole',  category:'fruits',     tag:'seasonal',   img:'https://images.unsplash.com/photo-1563114773-84221bd62daa?w=400&q=80' },
  { id:'p7',  name:'Cucumber',                price:500,  unit:'per 2 pcs',  category:'vegetables', tag:'fresh',      img:'https://images.unsplash.com/photo-1449300079323-02e209d9d3a6?w=400&q=80' },
  { id:'p8',  name:'Fresh Spinach',           price:650,  unit:'per bundle', category:'vegetables', tag:'organic',    img:'https://images.unsplash.com/photo-1574316071802-0d684efa7bf5?w=400&q=80' },
  { id:'p9',  name:'Carrots',                 price:900,  unit:'per 500g',   category:'vegetables', tag:'fresh',      img:'https://images.unsplash.com/photo-1447175008436-054170c2e979?w=400&q=80' },
  { id:'p10', name:'Pineapple',               price:1500, unit:'per whole',  category:'fruits',     tag:'seasonal',   img:'https://images.unsplash.com/photo-1550258987-190a2d41a8ba?w=400&q=80' },
  { id:'p11', name:'Onions (Red)',            price:800,  unit:'per 1kg',    category:'vegetables', tag:'local',      img:'https://images.unsplash.com/photo-1508747703725-719777637510?w=400&q=80' },
  { id:'p12', name:'Avocado',                price:1200,  unit:'per 2 pcs',  category:'fruits',     tag:'organic',    img:'https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?w=400&q=80' },
];

const _BOXES = [
  { id:'small-box',  name:'Small Farm Box',  price:5000,  size:'small',  items:'5–7 items',   feeds:'1–2 people', img:'https://images.unsplash.com/photo-1467453678174-768ec283a940?w=600&q=80' },
  { id:'medium-box', name:'Medium Farm Box', price:10000, size:'medium', items:'10–12 items', feeds:'3–4 people', img:'https://images.unsplash.com/photo-1518843875459-f738682238a6?w=600&q=80' },
  { id:'large-box',  name:'Large Farm Box',  price:15000, size:'large',  items:'18–22 items', feeds:'5+ people',  img:'https://images.unsplash.com/photo-1506484381205-f7945653044d?w=600&q=80' },
];

function _delay(ms) { return new Promise(r => setTimeout(r, ms)); }

// GET /api/products
async function getProducts(category = null) {
  await _delay(300);
  const data = category ? _PRODUCTS.filter(p => p.category === category) : _PRODUCTS;
  return { success: true, data, count: data.length };
}

// GET /api/products/:id
async function getProductById(id) {
  await _delay(200);
  const product = _PRODUCTS.find(p => p.id === id);
  if (!product) throw { success: false, message: 'Product not found' };
  return { success: true, data: product };
}

// GET /api/boxes
async function getBoxes() {
  await _delay(200);
  return { success: true, data: _BOXES };
}

// POST /api/orders
async function postOrder(orderData) {
  await _delay(800);
  if (!orderData.customerName || !orderData.phone || !orderData.items?.length)
    throw { success: false, message: 'Missing required fields' };
  const orderId = 'TFB-' + Date.now().toString(36).toUpperCase();
  return { success: true, orderId, message: `Order ${orderId} received! We'll confirm via WhatsApp in 30 mins.` };
}

// POST /api/subscriptions
async function postSubscription(data) {
  await _delay(800);
  if (!data.boxSize || !data.frequency || !data.phone)
    throw { success: false, message: 'Missing subscription details' };
  const prices    = { small:5000, medium:10000, large:15000 };
  const discounts = { weekly:0.05, biweekly:0.08, monthly:0.12 };
  const base      = prices[data.boxSize] || 5000;
  const disc      = discounts[data.frequency] || 0;
  const final     = Math.round(base * (1 - disc));
  const subId     = 'SUB-' + Date.now().toString(36).toUpperCase();
  return { success: true, subId, finalPrice: final, savings: base - final,
           message: `Subscription ${subId} created! First delivery soon.` };
}

// POST /api/contact
async function postContact(data) {
  await _delay(600);
  if (!data.email || !data.message) throw { success: false, message: 'Email and message are required' };
  return { success: true, message: "Thanks! We'll reply within 24 hours." };
}

// Paystack integration placeholder
function initPaystack({ email, amount, onSuccess, onClose }) {
  const PUBLIC_KEY = 'pk_test_REPLACE_WITH_YOUR_PAYSTACK_KEY';
  function launch() {
    const handler = PaystackPop.setup({
      key: PUBLIC_KEY, email, amount: amount * 100, currency: 'NGN',
      ref: 'TFB-' + Date.now(),
      callback:  r => { if (onSuccess) onSuccess(r.reference); },
      onClose:   () => { if (onClose) onClose(); },
    });
    handler.openIframe();
  }
  if (typeof PaystackPop === 'undefined') {
    const s = document.createElement('script');
    s.src = 'https://js.paystack.co/v1/inline.js';
    s.onload = launch;
    document.head.appendChild(s);
  } else {
    launch();
  }
}

window.FarmAPI = { getProducts, getProductById, getBoxes, postOrder, postSubscription, postContact, initPaystack };
