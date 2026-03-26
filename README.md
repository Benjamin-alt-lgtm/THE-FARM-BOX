# 🌿 THE FARM BOX — Complete Website

## Folder Structure
```
farmbox/
├── index.html          Homepage
├── shop.html           Shop / Order page
├── subscription.html   Subscription plans
├── about.html          About Us
├── contact.html        Contact
├── css/
│   └── style.css       All custom styles
└── js/
    ├── api.js          Simulated API (swap fetch() for real backend)
    ├── cart.js         Cart logic, localStorage, WhatsApp & Paystack checkout
    └── main.js         Navbar, animations, product cards, event delegation
```

## Run Locally

**VS Code Live Server** (recommended):
1. Install "Live Server" extension
2. Right-click `index.html` → Open with Live Server

**Python:**
```bash
cd farmbox
python3 -m http.server 8080
# visit http://localhost:8080
```

## Activate Paystack
Open `js/api.js` and replace:
```
pk_test_REPLACE_WITH_YOUR_PAYSTACK_KEY
```
with your real public key from dashboard.paystack.com

## Change WhatsApp Number
Search all files for `2348000000000` and replace with your number (no `+`).

## Connect Real Backend
In `js/api.js`, replace each `setTimeout` simulation with a `fetch()` call, e.g.:
```js
async function getProducts() {
  const res = await fetch('/api/products');
  return res.json();
}
```