let products = JSON.parse(localStorage.getItem("products")) || [
  {name:"Sneakers", price:49},
  {name:"Smart Watch", price:89},
  {name:"Headset", price:39},
  {name:"Hoodie", price:29}
];

let cart = JSON.parse(localStorage.getItem("cart")) || [];
let user = localStorage.getItem("user");

const track = document.getElementById("track");

function renderProducts() {
  track.innerHTML = "";
  products.forEach(p => {
    track.innerHTML += `
      <div class="card">
        <h3>${p.name}</h3>
        <p>$${p.price}</p>
        <button onclick="addToCart('${p.name}',${p.price})">Add to Cart</button>
      </div>`;
  });
}

function addToCart(name, price) {
  cart.push({name,price});
  localStorage.setItem("cart", JSON.stringify(cart));
  updateCart();
}

function updateCart() {
  document.getElementById("cart-count").innerText = cart.length;
}

function openCart() {
  document.getElementById("cartPopup").style.display = "block";
  let items = document.getElementById("cartItems");
  items.innerHTML = "";
  cart.forEach(i => items.innerHTML += `<p>${i.name} - $${i.price}</p>`);
}

function closeCart() {
  document.getElementById("cartPopup").style.display = "none";
}

function checkout() {
  alert("Order placed successfully 🎉");
  cart = [];
  localStorage.removeItem("cart");
  updateCart();
  closeCart();
}

/* AUTH */
function openAuth() {
  document.getElementById("authPopup").style.display = "block";
}

function closeAuth() {
  document.getElementById("authPopup").style.display = "none";
}

function login() {
  let u = document.getElementById("username").value;
  localStorage.setItem("user", u);
  alert("Welcome " + u);
  closeAuth();
  if (u === "admin") document.getElementById("adminPopup").style.display = "block";
}

/* ADMIN */
function addProduct() {
  let name = pname.value;
  let price = pprice.value;
  products.push({name,price});
  localStorage.setItem("products", JSON.stringify(products));
  renderProducts();
}

function closeAdmin() {
  document.getElementById("adminPopup").style.display = "none";
}

renderProducts();
updateCart();
