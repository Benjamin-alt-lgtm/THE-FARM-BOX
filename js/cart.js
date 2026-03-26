/**
 * cart.js — Shopping cart for The Farm Box
 * ──────────────────────────────────────────
 * • Persists cart to localStorage across page refreshes
 * • Exports addToCart, removeFromCart, updateQty, toggleCart,
 *   checkoutWhatsApp, checkoutPaystack, showToast to window
 */

let cart = [];

// Load persisted cart
try {
  cart = JSON.parse(localStorage.getItem('tfb_cart') || '[]');
} catch(e) {
  cart = [];
}

function saveCart() {
  try { localStorage.setItem('tfb_cart', JSON.stringify(cart)); } catch(e) {}
  updateCartUI();
}

// ── Add item ─────────────────────────────────────────────────────────────────
function addToCart(product) {
  if (!product || !product.id) return;
  const existing = cart.find(i => i.id === product.id);
  if (existing) {
    existing.qty += 1;
  } else {
    cart.push({ id: product.id, name: product.name, price: product.price, img: product.img || '', qty: 1 });
  }
  saveCart();
  showToast(product.name + ' added to cart! 🛒');
  // Pulse the cart button
  const btn = document.getElementById('cart-btn');
  if (btn) {
    btn.style.transform = 'scale(1.3)';
    setTimeout(() => { btn.style.transform = ''; }, 200);
  }
}

// ── Remove item ───────────────────────────────────────────────────────────────
function removeFromCart(productId) {
  cart = cart.filter(i => i.id !== productId);
  saveCart();
}

// ── Update quantity ───────────────────────────────────────────────────────────
function updateQty(productId, delta) {
  const item = cart.find(i => i.id === productId);
  if (!item) return;
  item.qty = Math.max(1, item.qty + delta);
  saveCart();
}

// ── Totals ────────────────────────────────────────────────────────────────────
function getTotal()     { return cart.reduce((s, i) => s + i.price * i.qty, 0); }
function getItemCount() { return cart.reduce((s, i) => s + i.qty, 0); }

// ── Update cart UI ────────────────────────────────────────────────────────────
function updateCartUI() {
  const countEl = document.getElementById('cart-count');
  const totalEl = document.getElementById('cart-total');
  const itemsEl = document.getElementById('cart-items');
  const count   = getItemCount();

  if (countEl) {
    countEl.textContent = count;
    countEl.classList.toggle('hidden', count === 0);
  }
  if (totalEl) {
    totalEl.textContent = '₦' + getTotal().toLocaleString();
  }
  if (itemsEl) {
    if (cart.length === 0) {
      itemsEl.innerHTML = `
        <div class="flex flex-col items-center justify-center h-full text-center py-16">
          <span class="text-5xl mb-4">🛒</span>
          <p class="text-stone-500 text-sm font-medium">Your cart is empty</p>
          <a href="shop.html" class="mt-4 text-green-700 text-sm font-semibold hover:underline">Browse products →</a>
        </div>`;
    } else {
      itemsEl.innerHTML = cart.map(item => `
        <div class="flex items-center gap-3 bg-stone-50 rounded-2xl p-3">
          <img src="${item.img}" alt="${item.name}"
               onerror="this.onerror=null;this.src='https://images.unsplash.com/photo-1542838132-92c53300491e?w=100&q=60'"
               class="w-14 h-14 rounded-xl object-cover flex-shrink-0"/>
          <div class="flex-1 min-w-0">
            <p class="text-sm font-semibold text-stone-800 truncate">${item.name}</p>
            <p class="text-xs text-green-700 font-bold">₦${item.price.toLocaleString()}</p>
            <div class="flex items-center gap-2 mt-1.5">
              <button class="qty-btn" onclick="updateQty('${item.id}', -1)">−</button>
              <span class="text-sm font-semibold w-5 text-center">${item.qty}</span>
              <button class="qty-btn" onclick="updateQty('${item.id}', 1)">+</button>
            </div>
          </div>
          <div class="text-right flex-shrink-0">
            <p class="text-sm font-bold text-stone-800">₦${(item.price * item.qty).toLocaleString()}</p>
            <button onclick="removeFromCart('${item.id}')"
              class="text-xs text-red-400 hover:text-red-600 mt-1.5 transition-colors">Remove</button>
          </div>
        </div>`).join('');
    }
  }
}

// ── Toggle cart drawer ────────────────────────────────────────────────────────
function toggleCart() {
  const overlay = document.getElementById('cart-overlay');
  const drawer  = document.getElementById('cart-drawer');
  if (!overlay || !drawer) return;
  const open = overlay.style.display === 'block';
  if (open) {
    overlay.style.display = 'none';
    drawer.style.transform = 'translateX(100%)';
    document.body.style.overflow = '';
  } else {
    overlay.style.display = 'block';
    drawer.style.transform = 'translateX(0)';
    document.body.style.overflow = 'hidden';
  }
}

// ── WhatsApp checkout ─────────────────────────────────────────────────────────
function checkoutWhatsApp() {
  if (cart.length === 0) { showToast('Your cart is empty!'); return; }
  const lines = cart.map(i => `• ${i.name} x${i.qty} = ₦${(i.price * i.qty).toLocaleString()}`).join('\n');
  const msg   = `Hello The Farm Box! 🌿\n\nI'd like to order:\n\n${lines}\n\n*Total: ₦${getTotal().toLocaleString()}*\n\nPlease confirm and arrange delivery. Thank you!`;
  window.open(`https://wa.me/2348000000000?text=${encodeURIComponent(msg)}`, '_blank');
}

// ── Paystack checkout ─────────────────────────────────────────────────────────
function checkoutPaystack() {
  if (cart.length === 0) { showToast('Your cart is empty!'); return; }
  const email = prompt('Enter your email address for the payment receipt:');
  if (!email || !email.includes('@')) { showToast('Please enter a valid email.'); return; }
  window.FarmAPI.initPaystack({
    email,
    amount: getTotal(),
    onSuccess: (ref) => {
      showToast('✅ Payment successful! Ref: ' + ref);
      cart = [];
      saveCart();
      toggleCart();
    },
    onClose: () => showToast('Payment cancelled.'),
  });
}

// ── Toast notification ────────────────────────────────────────────────────────
function showToast(message) {
  const toast = document.getElementById('toast');
  if (!toast) return;
  toast.textContent = message;
  toast.style.opacity = '1';
  setTimeout(() => { toast.style.opacity = '0'; }, 2800);
}

// ── Init ──────────────────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', updateCartUI);

// Export to window
window.addToCart       = addToCart;
window.removeFromCart  = removeFromCart;
window.updateQty       = updateQty;
window.toggleCart      = toggleCart;
window.checkoutWhatsApp = checkoutWhatsApp;
window.checkoutPaystack = checkoutPaystack;
window.showToast       = showToast;
