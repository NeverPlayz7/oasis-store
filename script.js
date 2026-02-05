const track = document.querySelector('.carousel-track');
const left = document.querySelector('.left');
const right = document.querySelector('.right');

right.onclick = () => {
  track.scrollBy({ left: 300, behavior: 'smooth' });
};

left.onclick = () => {
  track.scrollBy({ left: -300, behavior: 'smooth' });
};

// Swipe support
let startX;
track.addEventListener('touchstart', e => startX = e.touches[0].clientX);
track.addEventListener('touchend', e => {
  let endX = e.changedTouches[0].clientX;
  if (startX - endX > 50) track.scrollBy({ left: 300, behavior: 'smooth' });
  if (endX - startX > 50) track.scrollBy({ left: -300, behavior: 'smooth' });
});

// 🛒 CART SYSTEM
let cart = JSON.parse(localStorage.getItem("cart")) || [];

function addToCart(name, price) {
  cart.push({ name, price });
  localStorage.setItem("cart", JSON.stringify(cart));
  updateCartCount();
}

function updateCartCount() {
  document.getElementById("cart-count").innerText = cart.length;
}

updateCartCount();
