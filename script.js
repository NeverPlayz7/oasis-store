import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-app.js";
import { getAuth, GoogleAuthProvider, signInWithPopup, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-auth.js";
import { getFirestore, collection, addDoc } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyAYwc4wlCgMNZoikTbt-ph48zatsUo6Kw0",
    authDomain: "oasis-own.firebaseapp.com",
    projectId: "oasis-own",
    storageBucket: "oasis-own.appspot.com",
    messagingSenderId: "621399635023",
    appId: "1:621399635023:web:7bb98a8f74eb72cb9fa63a"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const provider = new GoogleAuthProvider();

let STATE = { cart: [], wishlist: [], products: [
    {id: 1, name: "Silk Drape", price: 420, img: "https://picsum.photos/400/600?random=11"},
    {id: 2, name: "Noir Frame", price: 590, img: "https://picsum.photos/400/600?random=12"},
    {id: 3, name: "Aura Mist", price: 150, img: "https://picsum.photos/400/600?random=13"},
    {id: 4, name: "Velvet Void", price: 850, img: "https://picsum.photos/400/600?random=14"},
    {id: 5, name: "Satin Shell", price: 280, img: "https://picsum.photos/400/600?random=15"},
    {id: 6, name: "Onyx Gaze", price: 340, img: "https://picsum.photos/400/600?random=16"},
    {id: 7, name: "Pure Sand", price: 120, img: "https://picsum.photos/400/600?random=17"},
    {id: 8, name: "Lace Archive", price: 900, img: "https://picsum.photos/400/600?random=18"}
]};

// --- AUTH LOGIC (Fixed Button Connection) ---
const loginBtn = document.getElementById('loginBtn');
loginBtn.onclick = () => {
    signInWithPopup(auth, provider).catch(err => {
        console.error("Auth Error:", err);
        alert("Google Login Failed. Check Firebase Settings.");
    });
};

onAuthStateChanged(auth, (user) => {
    if (user) {
        document.getElementById('authScreen').style.opacity = '0';
        setTimeout(() => {
            document.getElementById('authScreen').classList.add('hidden');
            const main = document.getElementById('mainApp');
            main.classList.remove('hidden');
            setTimeout(() => main.classList.add('opacity-100'), 50);
        }, 700);
        document.getElementById('userImg').src = user.photoURL;
        renderProducts();
    }
});

// --- SHOP ENGINE ---
function renderProducts() {
    const grid = document.getElementById('productGrid');
    grid.innerHTML = STATE.products.map(p => `
        <div class="product-card group relative cursor-pointer" id="prod-${p.id}">
            <div class="overflow-hidden bg-gray-50 relative">
                <img src="${p.img}" alt="${p.name}">
                <button class="add-to-cart absolute bottom-0 w-full bg-black/80 text-white py-2 text-[8px] tracking-[3px] opacity-0 group-hover:opacity-100 transition-all uppercase font-bold">Add to Bag</button>
            </div>
            <div class="mt-3 text-center">
                <h3 class="text-[8px] font-bold uppercase tracking-widest text-gray-400">${p.name}</h3>
                <b class="text-lg font-serif italic">$${p.price}</b>
            </div>
        </div>
    `).join('');

    // Attach Clicks
    STATE.products.forEach(p => {
        document.querySelector(`#prod-${p.id}`).onclick = () => addToCart(p.id);
    });
}

function addToCart(id) {
    const item = STATE.products.find(x => x.id === id);
    STATE.cart.push(item);
    playSound('snd-cart');
    updateUI();
}

function updateUI() {
    document.getElementById('cartCount').innerText = STATE.cart.length;
    document.getElementById('cartItems').innerHTML = STATE.cart.map((item, i) => `
        <div class="flex justify-between items-center border-b border-gray-50 pb-3">
            <div><p class="text-[9px] font-bold uppercase">${item.name}</p><b class="font-serif italic">$${item.price}</b></div>
            <button onclick="event.stopPropagation(); removeCartItem(${i})" class="text-[10px] text-gray-400 hover:text-black">REMOVE</button>
        </div>
    `).join('');
    document.getElementById('cartTotal').innerText = "$" + STATE.cart.reduce((a,b)=>a+b.price, 0);
}

// Attach UI Globals
window.removeCartItem = (i) => { STATE.cart.splice(i, 1); updateUI(); };
window.logout = () => signOut(auth).then(() => location.reload());

// --- SIDEBARS & SOUNDS ---
const cartBtn = document.getElementById('cartBtn');
const cartSidebar = document.getElementById('cartSidebar');
const closeBtn = document.querySelector('.close-btn');

cartBtn.onclick = () => { cartSidebar.classList.add('active'); playSound('snd-click'); };
closeBtn.onclick = () => cartSidebar.classList.remove('active');

function playSound(id) {
    const s = document.getElementById(id);
    if(s) { s.currentTime = 0; s.play(); }
}

// --- CURSOR ---
const cursor = document.getElementById('cursor');
document.addEventListener('mousemove', e => {
    cursor.style.left = e.clientX + 'px';
    cursor.style.top = e.clientY + 'px';
});

// --- CHECKOUT ---
document.getElementById('checkoutBtn').onclick = async () => {
    if(!STATE.cart.length) return;
    confetti({ particleCount: 150, spread: 70, colors: ['#000', '#C5A37D'] });
    alert("ORDER PROCESSED.");
    STATE.cart = []; updateUI(); cartSidebar.classList.remove('active');
};
