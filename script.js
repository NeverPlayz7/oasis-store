import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-app.js";
import { getAuth, GoogleAuthProvider, signInWithPopup, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-auth.js";
import { getFirestore, collection, addDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore.js";

const firebaseConfig={
 apiKey:"AIzaSyAYwc4wlCgMNZoikTbt-ph48zatsUo6Kw0",
 authDomain:"oasis-own.firebaseapp.com",
 projectId:"oasis-own",
 storageBucket:"oasis-own.appspot.com",
 messagingSenderId:"621399635023",
 appId:"1:621399635023:web:7bb98a8f74eb72cb9fa63a"
};

const app=initializeApp(firebaseConfig);
const auth=getAuth(app);
const db=getFirestore(app);
const provider=new GoogleAuthProvider();

let STATE={
 cart:[],
 products:[
  {id:1,name:"Silk Drape",price:420,img:"https://picsum.photos/400/600?1"},
  {id:2,name:"Noir Frame",price:590,img:"https://picsum.photos/400/600?2"},
  {id:3,name:"Aura Mist",price:150,img:"https://picsum.photos/400/600?3"},
  {id:4,name:"Velvet Void",price:850,img:"https://picsum.photos/400/600?4"},
  {id:5,name:"Satin Shell",price:280,img:"https://picsum.photos/400/600?5"},
  {id:6,name:"Onyx Gaze",price:340,img:"https://picsum.photos/400/600?6"}
 ]
};

// AUTH
loginBtn.onclick=()=>signInWithPopup(auth,provider);

onAuthStateChanged(auth,user=>{
 if(user){
  authScreen.classList.add("hidden");
  mainApp.classList.remove("hidden");
  setTimeout(()=>mainApp.classList.add("opacity-100"),50);
  userImg.src=user.photoURL;
  renderProducts();
 }
});

// PRODUCTS
function renderProducts(){
 productGrid.innerHTML=STATE.products.map(p=>`
 <div class="product-card cursor-pointer" onclick="addToCart(${p.id})">
  <img src="${p.img}">
  <div class="p-3 text-center">
   <h3 class="text-[8px] uppercase tracking-widest">${p.name}</h3>
   <b class="font-serif italic">$${p.price}</b>
  </div>
 </div>
 `).join("");
}

// CART
window.addToCart=id=>{
 let item=STATE.cart.find(i=>i.id===id);
 if(item) item.qty++;
 else{
  let p=STATE.products.find(x=>x.id===id);
  STATE.cart.push({...p,qty:1});
 }
 updateCart();
};

function updateCart(){
 cartCount.innerText=STATE.cart.reduce((a,b)=>a+b.qty,0);
 cartItems.innerHTML=STATE.cart.map((i,idx)=>`
 <div class="flex justify-between">
  <div>
   <p class="text-[9px] uppercase">${i.name}</p>
   <b class="font-serif italic">$${i.price} × ${i.qty}</b>
  </div>
  <button onclick="removeItem(${idx})">&times;</button>
 </div>
 `).join("");
 cartTotal.innerText="$"+STATE.cart.reduce((a,b)=>a+b.price*b.qty,0);
}

window.removeItem=i=>{STATE.cart.splice(i,1);updateCart();};

cartBtn.onclick=()=>cartSidebar.classList.add("active");
closeCart.onclick=()=>cartSidebar.classList.remove("active");

// CHECKOUT
checkoutBtn.onclick=async()=>{
 if(!STATE.cart.length) return;
 await addDoc(collection(db,"orders"),{
  items:STATE.cart,
  total:STATE.cart.reduce((a,b)=>a+b.price*b.qty,0),
  createdAt:serverTimestamp()
 });
 confetti({particleCount:150,spread:70});
 alert("Transaction Successful");
 STATE.cart=[];
 updateCart();
 cartSidebar.classList.remove("active");
};

// THEME
themeSwitch.onchange=e=>{
 document.body.className=e.target.value;
 localStorage.setItem("theme",e.target.value);
};
document.body.className=localStorage.getItem("theme")||"theme-light";

// CURSOR
let mx=0,my=0;
document.addEventListener("mousemove",e=>{mx=e.clientX;my=e.clientY});
setInterval(()=>{
 cursor.style.transform=`translate(${mx}px,${my}px)`;
},16);
