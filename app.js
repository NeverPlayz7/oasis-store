const productsContainer = document.getElementById("products");
const cart = document.getElementById("cart");
let cartItems = [];

fetch("https://raw.githubusercontent.com/YOURUSERNAME/YOURREPO/main/data/products.json")
.then(res=>res.json())
.then(data=>{
  data.forEach(product=>{
    productsContainer.innerHTML += `
      <div class="card">
        <img src="${product.image}" width="100%">
        <h3>${product.name}</h3>
        <p>Rs. ${product.price}</p>
        <button onclick="addToCart(${product.id},'${product.name}',${product.price})">
        Add to Cart</button>
      </div>
    `;
  });
});

function addToCart(id,name,price){
  cartItems.push({id,name,price});
  updateCart();
}

function updateCart(){
  cart.classList.add("open");
  cart.innerHTML = "<h2>Your Bag</h2>";
  let total=0;
  cartItems.forEach(item=>{
    total+=item.price;
    cart.innerHTML+=`<p>${item.name} - Rs.${item.price}</p>`;
  });
  cart.innerHTML+=`<h3>Total Rs.${total}</h3>
  <button onclick="checkout(${total})">Checkout</button>`;
}

document.getElementById("cartBtn").onclick=()=>{
  cart.classList.toggle("open");
};

// Flash Timer
let time=43200;
setInterval(()=>{
  let h=Math.floor(time/3600);
  let m=Math.floor((time%3600)/60);
  let s=time%60;
  document.getElementById("timer").innerText=
  `${h}h ${m}m ${s}s`;
  time--;
},1000);
