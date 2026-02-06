const products = [
  {name:"Oasis Smart Watch", price:99},
  {name:"Oasis Sneakers", price:79},
  {name:"Oasis Hoodie", price:59},
  {name:"Oasis Headphones", price:129},
  {name:"Oasis Backpack", price:49},
];

const container = document.getElementById("products");
let cart = 0;

products.forEach(p=>{
  container.innerHTML += `
    <div class="card">
      <img src="https://picsum.photos/300?random=${Math.random()}">
      <h3>${p.name}</h3>
      <p>$${p.price}</p>
      <button onclick="addToCart()">Add to Cart</button>
    </div>
  `;
});

function addToCart(){
  cart++;
  document.getElementById("cartCount").innerText = cart;
}

function openLogin(){
  document.getElementById("loginModal").style.display="flex";
}

function closeLogin(){
  document.getElementById("loginModal").style.display="none";
}
