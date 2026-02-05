let products = [
  {name:"Sneakers", price:49},
  {name:"Smart Watch", price:89},
  {name:"Gaming Headset", price:39},
  {name:"Hoodie", price:29},
  {name:"Backpack", price:59}
];

let cart = [];
let index = 0;
const track = document.getElementById("track");

function render() {
  track.innerHTML = "";
  products.forEach(p => {
    track.innerHTML += `
      <div class="card">
        <h3>${p.name}</h3>
        <p>$${p.price}</p>
        <button onclick="addToCart('${p.name}',${p.price})">Add to Cart</button>
      </div>
    `;
  });
}

function slide(dir) {
  index += dir;
  if (index < 0) index = products.length - 1;
  if (index > products.length - 1) index = 0;
  track.style.transform = `translateX(${-index * 275}px)`;
}

/* Auto Infinite */
setInterval(() => slide(1), 3000);

/* Cart */
function addToCart(name, price) {
  cart.push({name,price});
  document.getElementById("cartCount").innerText = cart.length;
}

function openCart() {
  cartItems.innerHTML = cart.map(i => `<p>${i.name} - $${i.price}</p>`).join("");
  cart.style.display = "block";
}

function closeCart() {
  cart.style.display = "none";
}

function checkout() {
  alert("Order Placed 🚀");
  cart = [];
  cartCount.innerText = 0;
  closeCart();
}

/* Auth */
function openAuth() {
  auth.style.display = "block";
}

function closeAuth() {
  auth.style.display = "none";
}

function login() {
  alert("Welcome " + user.value);
  closeAuth();
}

render();
