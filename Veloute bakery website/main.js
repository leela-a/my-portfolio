// --- cart logic ---
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// Re-draw the badge (only if the badge exists)
function updateCartCount() {
  const badge = document.getElementById('cart-count');
  if (badge) {
    badge.textContent = cart.reduce((sum, item) => sum + item.qty, 0);
  }
}

// Save & refresh badge AND live‐update cart page if open
function saveCart() {
  localStorage.setItem('cart', JSON.stringify(cart));
  updateCartCount();
  if (document.getElementById('cart-items')) {
    renderCartPage();
  }
}

// Add item (or bump qty)
function addToCart(name, price) {
  const idx = cart.findIndex(i => i.name === name);
  if (idx > -1) {
    cart[idx].qty++;
  } else {
    cart.push({ name, price: parseFloat(price), qty: 1 });
  }
  saveCart();
}

document.addEventListener('DOMContentLoaded', () => {
  // Only update badge if on index.html (or wherever you have #cart-count)
  updateCartCount();

  // Wire up add-to-cart buttons if they exist
  document.querySelectorAll('.add-to-cart').forEach(btn => {
    btn.addEventListener('click', () => {
      addToCart(btn.dataset.name, btn.dataset.price);
    });
  });

  // If you’re on cart.html (i.e. #cart-items exists), render it
  if (document.getElementById('cart-items')) {
    renderCartPage();
  }
});

// Render the cart with “–” and “+” buttons
function renderCartPage() {
  const container = document.getElementById('cart-items');
  container.innerHTML = '';
  let total = 0;

  cart.forEach(item => {
    total += item.price * item.qty;
    const row = document.createElement('div');
    row.className = 'cart-row';
    row.innerHTML = `
      <span class="cart-name">${item.name}</span>
      <div class="cart-qty">
        <button class="decrement">–</button>
        <span>${item.qty}</span>
        <button class="increment">+</button>
      </div>
      <span class="cart-line-total">$${(item.price * item.qty).toFixed(2)}</span>
    `;

    row.querySelector('.decrement').addEventListener('click', () => {
      if (item.qty > 1) item.qty--;
      else cart = cart.filter(i => i.name !== item.name);
      saveCart();
    });
    row.querySelector('.increment').addEventListener('click', () => {
      item.qty++;
      saveCart();
    });

    container.appendChild(row);
  });

  document.getElementById('cart-total').textContent = total.toFixed(2);
}
