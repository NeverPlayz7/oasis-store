let products = [
  {name:"Sneakers", price:49, image:"https://via.placeholder.com/250"},
  {name:"Smart Watch", price:89, image:"https://via.placeholder.com/250"},
  {name:"Gaming Headset", price:39, image:"https://via.placeholder.com/250"},
  {name:"Hoodie", price:29, image:"https://via.placeholder.com/250"},
  {name:"Backpack", price:59, image:"https://via.placeholder.com/250"}
];

let cart=[], wishlist=[], index=0;

const track=document.getElementById("track");
const cartPopup=document.getElementById("cart");
const cartItems=document.getElementById("cartItems");
const wishlistPopup=document.getElementById("wishlist");
const wishlistItems=document.getElementById("wishlistItems");
const auth=document.getElementById("auth");
const user=document.getElementById("user");
const admin=document.getElementById("admin");
const productGrid=document.getElementById("productGrid");

// Render Slider & Grid
function render() {
  track.innerHTML=""; productGrid.innerHTML="";
  products.forEach(p=>{
    track.innerHTML+=`
      <div class="card">
        <img src="${p.image}" alt="${p.name}">
        <h3>${p.name}</h3>
        <p>$${p.price}</p>
        <button onclick="addToCart('${p.name}',${p.price})">Add to Cart</button>
        <button onclick="addToWishlist('${p.name}',${p.price})">❤️ Wishlist</button>
      </div>
    `;
    productGrid.innerHTML+=`
      <div class="card">
        <img src="${p.image}" alt="${p.name}">
        <h3>${p.name}</h3>
        <p>$${p.price}</p>
        <button onclick="addToCart('${p.name}',${p.price})">Add to Cart</button>
        <button onclick="addToWishlist('${p.name}',${p.price})">❤️ Wishlist</button>
      </div>
    `;
  });
}

// Slider
function slide(dir){ index+=dir; if(index<0)index=products.length-1; if(index>products.length-1)index=0; track.style.transform=`translateX(${-index*275}px)`; }
setInterval(()=>slide(1),3000);

// Cart
function addToCart(name,price){ cart.push({name,price}); document.getElementById("cartCount").innerText=cart.length; }
function openCart(){ cartItems.innerHTML=cart.length===0?"<p>Cart is empty</p>":cart.map(i=>`<p>${i.name} - $${i.price}</p>`).join(""); cartPopup.style.display="block"; }
function closeCart(){ cartPopup.style.display="none"; }
function checkout(){ if(cart.length===0){alert("Cart empty");return;} alert("Payment placeholder (Stripe/JazzCash)"); cart=[]; document.getElementById("cartCount").innerText=0; closeCart(); }

// Wishlist
function addToWishlist(name,price){ wishlist.push({name,price}); alert(name+" added to wishlist ❤️"); }
function openWishlist(){ wishlistItems.innerHTML=wishlist.length===0?"<p>No items in wishlist</p>":wishlist.map(i=>`<p>${i.name} - $${i.price}</p>`).join(""); wishlistPopup.style.display="block"; }
function closeWishlist(){ wishlistPopup.style.display="none"; }

// Auth
function openAuth(){ auth.style.display="block"; } function closeAuth(){ auth.style.display="none"; }
function login(){ if(user.value.trim()===""){alert("Enter username");return;} alert("Welcome "+user.value); closeAuth(); }
function socialLogin(platform){ alert("Logged in via "+platform+" ✅"); closeAuth(); }

// Admin
function openAdmin(){ admin.style.display="block"; } function closeAdmin(){ admin.style.display="none"; }
function addProduct(){
  const name=document.getElementById("adminProductName").value;
  const price=Number(document.getElementById("adminProductPrice").value);
  const imgFile=document.getElementById("adminProductImage").files[0];
  if(!name||!price||!imgFile){alert("Fill all fields");return;}
  const reader=new FileReader();
  reader.onload=()=>{ products.push({name,price,image:reader.result}); render(); alert(name+" added"); }
  reader.readAsDataURL(imgFile);
}

render();
