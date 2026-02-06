const products = [
  { name: "Sneakers", price: 49, img: "https://picsum.photos/300?1" },
  { name: "Smart Watch", price: 89, img: "https://picsum.photos/300?2" },
  { name: "Headphones", price: 39, img: "https://picsum.photos/300?3" },
  { name: "Backpack", price: 59, img: "https://picsum.photos/300?4" }
];

let cart = [];
let wishlist = [];

const productBox = document.getElementById("products");

products.forEach(p => {
  productBox.innerHTML += `
    <div class="card">
      <img src="${p.img}">
      <h3>${p.name}</h3>
      <p>$${p.price}</p>
      <button onclick="addCart('${p.name}',${p.price})">Add to Cart</button>
      <button onclick="addWish('${p.name}')">❤️ Wishlist</button>
    </div>
  `;
});

function addCart(name, price) {
  cart.push({ name, price });
  document.getElementById("cartCount").innerText = cart.length;
}

function addWish(name) {
  wishlist.push(name);
  document.getElementById("wishCount").innerText = wishlist.length;
}

/* CART */
function openCart() {
  cartItems.innerHTML = cart.map(i => `<p>${i.name} - $${i.price}</p>`).join("");
  cart.style.display = "block";
}
function closeCart() {
  cart.style.display = "none";
}

/* WISHLIST */
function openWishlist() {
  wishItems.innerHTML = wishlist.map(i => `<p>${i}</p>`).join("");
  wishlist.style.display = "block";
}
function closeWishlist() {
  wishlist.style.display = "none";
}

/* LOGIN */
function openLogin() {
  login.style.display = "block";
}
function closeLogin() {
  login.style.display = "none";
}
function social(type) {
  alert(type + " login coming soon 🚀");
  closeLogin();
}
