import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-app.js";
import { getAuth, GoogleAuthProvider, signInWithPopup, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-auth.js";
import { getFirestore, collection, addDoc, query, where, getDocs } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore.js";

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

let STATE = {
    cart: [],
    products: [
        {id: 1, name: "Ivory Linen Cape", price: 320, img: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=600"},
        {id: 2, name: "Noir Resort Suit", price: 850, img: "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?q=80&w=600"},
        {id: 3, name: "Silk Sand Scarf", price: 140, img: "https://images.unsplash.com/photo-1605763240000-7e93b172d754?q=80&w=600"},
        {id: 4, name: "Marble Shell Hat", price: 210, img: "https://images.unsplash.com/photo-1514327605112-b887c0e61c0a?q=80&w=600"},
        {id: 5, name: "Coastal Void Vest", price: 440, img: "https://images.unsplash.com/photo-1581044777550-4cfa60707c03?q=80&w=600"},
        {id: 6, name: "Lace Archive Wrap", price: 1100, img: "https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?q=80&w=600"}
    ]
};

// --- AUTH ENGINE ---
const loginBtn = document.getElementById('loginBtn');
loginBtn.onclick = () => signInWithPopup(auth, provider);

onAuthStateChanged(auth, (user) => {
    if (user) {
        document.getElementById('authScreen').classList.add('hidden');
        document.getElementById('mainApp').classList.remove('hidden');
        setTimeout(() => document.getElementById('mainApp').classList.add('opacity-100'), 50);
        document.getElementById('userImg').src = user.photoURL;
        renderProducts(STATE.products);
    }
});

// --- SHOP LOGIC ---
function renderProducts(items) {
    const grid = document.getElementById('productGrid');
    grid.innerHTML = items.map(p => `
        <div class="product-card group" onclick="addToCart(${p.id})">
            <div class="img-box mb-4">
                <img src="${p.img}" alt="${p.name}">
                <div class="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center">
                    <span class="text-[8px] tracking-[4px] font-bold">+ Bag</span>
                </div>
            </div>
            <div class="text-center">
                <h4 class="text-[9px] font-bold uppercase tracking-[3px] text-gray-400 mb-1">${p.name}</h4>
                <b class="text-lg font-serif italic">$${p.price}</b>
            </div>
        </div>
    `).join('');
}

// --- SORTING ---
document.getElementById('sortPrice').onchange = (e) => {
    let sorted = [...STATE.products];
    if(e.target.value === 'low') sorted.sort((a,b) => a.price - b.price);
    if(e.target.value === 'high') sorted.sort((a,b) => b.price - a.price);
    renderProducts(sorted);
};

// --- UI HELPERS ---
const playSound = (id) => { const s = document.getElementById(id); s.currentTime = 0; s.play(); };

window.addToCart = (id) => {
    STATE.cart.push(STATE.products.find(x => x.id === id));
    playSound('snd-cart');
    updateUI();
};

function updateUI() {
    document.getElementById('cartCount').innerText = STATE.cart.length;
    document.getElementById('cartItems').innerHTML = STATE.cart.map((item, i) => `
        <div class="flex justify-between items-center border-b border-gray-50 pb-4">
            <div><p class="text-[9px] font-bold uppercase tracking-widest text-gray-400">${item.name}</p>
            <b class="font-serif italic text-xl">$${item.price}</b></div>
            <button onclick="event.stopPropagation(); STATE.cart.splice(${i},1); updateUI();" class="text-xs">&times;</button>
        </div>
    `).join('');
    document.getElementById('cartTotal').innerText = "$" + STATE.cart.reduce((a,b)=>a+b.price, 0);
}

// Sidebar Controls
document.getElementById('cartBtn').onclick = () => document.getElementById('cartSidebar').classList.add('active');
document.querySelector('.close-sidebar').onclick = () => document.getElementById('cartSidebar').classList.remove('active');

// Checkout
document.getElementById('checkoutBtn').onclick = async () => {
    if(!STATE.cart.length) return;
    confetti({ particleCount: 150, spread: 70, colors: ['#c5a37d', '#000'] });
    alert("ORDER PROCESSED IN THE ARCHIVE.");
    STATE.cart = []; updateUI();
    document.getElementById('cartSidebar').classList.remove('active');
};

// Cursor
document.addEventListener('mousemove', e => {
    const c = document.getElementById('cursor');
    c.style.left = e.clientX + 'px';
    c.style.top = e.clientY + 'px';
});

window.logout = () => signOut(auth).then(() => location.reload());
