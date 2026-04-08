/**
 * carrito.js — lógica de carrito cliente
 * Usá addToCart(codigo, nombre) desde cualquier página
 * El carrito persiste en localStorage bajo 'bgm_cart'
 */

const CART_KEY = 'bgm_cart';
const WA_NUMBER = '5493415317707';

function getCart() {
  try { return JSON.parse(localStorage.getItem(CART_KEY)) || {}; }
  catch { return {}; }
}

function saveCart(cart) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
  // actualizar badge en nav
  var count = Object.values(cart).reduce(function(s, i) { return s + i.cantidad; }, 0);
  var el = document.getElementById('nav-carrito-count');
  if (el) el.textContent = count > 0 ? count : '';
}

function addToCart(codigo, nombre) {
  var cart = getCart();
  if (cart[codigo]) {
    cart[codigo].cantidad++;
  } else {
    cart[codigo] = { codigo: codigo, nombre: nombre, cantidad: 1 };
  }
  saveCart(cart);
  showNotif('✓ ' + nombre.substring(0, 40) + (nombre.length > 40 ? '…' : '') + ' agregado', 'success');
}

function showNotif(msg, type) {
  var container = document.getElementById('notifContainer');
  if (!container) {
    container = document.createElement('div');
    container.id = 'notifContainer';
    document.body.appendChild(container);
  }
  var n = document.createElement('div');
  n.className = 'notification ' + (type || 'info');
  n.textContent = msg;
  container.appendChild(n);
  setTimeout(function() {
    n.classList.add('hide');
    setTimeout(function() { n.remove(); }, 400);
  }, 2500);
}

// Delegar clicks en botones de carrito del catálogo
document.addEventListener('click', function(e) {
  var btn = e.target.closest('.btn-carrito-mini');
  if (btn) {
    addToCart(btn.dataset.codigo, btn.dataset.nombre);
  }
});

// Inicializar badge al cargar
(function() {
  var cart = getCart();
  var count = Object.values(cart).reduce(function(s, i) { return s + i.cantidad; }, 0);
  var el = document.getElementById('nav-carrito-count');
  if (el && count > 0) el.textContent = count;
})();
