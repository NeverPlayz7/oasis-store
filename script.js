let products = JSON.parse(localStorage.getItem("products")) || [
 {name:"Sneakers",price:49,img:"https://picsum.photos/300?1"},
 {name:"Smart Watch",price:89,img:"https://picsum.photos/300?2"},
 {name:"Headphones",price:39,img:"https://picsum.photos/300?3"}
];

let cart=[], wishlist=[];
let orders = JSON.parse(localStorage.getItem("orders")) || [];

const box=document.getElementById("products");

function renderProducts(){
  box.innerHTML="";
  products.forEach(p=>{
    box.innerHTML+=`
    <div class="card">
      <img src="${p.img}">
      <h3>${p.name}</h3>
      <p>$${p.price}</p>
      <button onclick="addCart('${p.name}',${p.price})">Add to Cart</button>
      <button onclick="addWish('${p.name}')">❤️ Wishlist</button>
    </div>`;
  });
}
renderProducts();

/* CART */
function addCart(n,p){
  cart.push({n,p});
  cartCount.innerText=cart.length;
}
function openCart(){
  cartItems.innerHTML=cart.map(i=>`<p>${i.n} - $${i.p}</p>`).join("");
  cart.style.display="block";
}
function closeCart(){cart.style.display="none"}

/* CHECKOUT */
function checkout(){
  if(cart.length==0) return alert("Cart empty");
  orders.push(...cart);
  localStorage.setItem("orders",JSON.stringify(orders));
  cart=[];
  cartCount.innerText=0;
  closeCart();
  alert("Order placed successfully 🚀");
}

/* ORDERS */
function openOrders(){
  orderItems.innerHTML=orders.map(o=>`<p>${o.n} - $${o.p}</p>`).join("");
  ordersDiv.style;
  orders.style.display="block";
}
function closeOrders(){orders.style.display="none"}

/* WISHLIST */
function addWish(n){
  wishlist.push(n);
  wishCount.innerText=wishlist.length;
}
function openWishlist(){
  wishItems.innerHTML=wishlist.map(i=>`<p>${i}</p>`).join("");
  wishlist.style.display="block";
}
function closeWishlist(){wishlist.style.display="none"}

/* LOGIN */
function openLogin(){login.style.display="block"}
function closeLogin(){login.style.display="none"}
function social(t){
  alert(t+" login coming soon 🚀");
  closeLogin();
}
