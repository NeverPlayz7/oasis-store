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

let STATE = {
    cart: [],
    products: [
        {id: 1, name: "Silk Drape", price: 420, img: "https://picsum.photos/400/600?random=21"},
        {id: 2, name: "Noir Frame", price: 590, img: "https://picsum.photos/400/600?random=22"},
        {id: 3, name: "Aura Mist", price: 150, img: "https://picsum.photos/400/600?random=23"},
        {id: 4, name: "Velvet Void", price: 850, img: "https://picsum.photos/400/600?random=24"},
        {id: 5, name: "Satin Shell", price: 280, img: "https://picsum.photos/400/600?random=25"},
        {id: 6, name: "Onyx Gaze", price: 340, img: "https://picsum.photos/400/600?random=26"},
        {id: 7, name: "Pure Sand", price: 120, img: "https://picsum.photos/400/600?random=27"},
        {id: 8, name: "Lace Archive", price: 900, img: "https://picsum.photos/400/600?random=28"}
    ]
};

// --- AUTH ---
document.getElementById('loginBtn').onclick = () => {
    signInWithPopup(auth, provider).catch(err => alert("Error: " + err.message));
};

onAuthStateChanged(auth, (user) => {
    if (user) {
        document.getElementById('authScreen').classList.add('hidden');
        document.getElementById('mainApp').classList.remove('hidden');
        setTimeout(() => document.getElementById('mainApp').classList.add('opacity-100'), 50);
        document.getElementById('userImg').src = user.photoURL;
        renderProducts(STATE.products);
    }
});

// --- RENDER & FILTER ---
function renderProducts(items) {
    const grid = document.getElementById('productGrid');
    grid.innerHTML = items.map(p => `
        <div class="product-card group relative cursor-pointer" onclick="addToCart(${p.id})">
            <div class="overflow-hidden bg-gray-50"><img src="${p.img}" alt="${p.name}"></div>
            <div class="mt-3 text-center">
                <h3 class="text-[8px] font-bold uppercase tracking-widest text-gray-400">${p.name}</h3>
                <b class="text-lg font-serif italic">$${p.price}</b>
            </div>
        </div>
    `).join('');
}

const handleFilter = (e) => {
    let sorted = [...STATE.products];
    if(e.target.value === 'low') sorted.sort((a,b) => a.price - b.price);
    if(e.target.value === 'high') sorted.sort((a,b) => b.price - a.price);
    renderProducts(sorted);
};

document.getElementById('priceFilter').onchange = handleFilter;
document.getElementById('priceFilterMobile').onchange = handleFilter;

// --- CART LOGIC ---
window.addToCart = (id) => {
    const p = STATE.products.find(x => x.id === id);
    STATE.cart.push(p);
    playSound('snd-cart');
    updateUI();
};

function updateUI() {
    document.getElementById('cartCount').innerText = STATE.cart.length;
    document.getElementById('cartItems').innerHTML = STATE.cart.map((item, i) => `
        <div class="flex justify-between items-center border-b border-gray-50 pb-2">
            <div><p class="text-[9px] font-bold uppercase">${item.name}</p><b class="font-serif italic">$${item.price}</b></div>
            <button onclick="event.stopPropagation(); removeCart(${i})" class="text-[10px] text-gray-400">&times;</button>
        </div>
    `).join('');
    document.getElementById('cartTotal').innerText = "$" + STATE.cart.reduce((a,b)=>a+b.price, 0);
}

window.removeCart = (i) => { STATE.cart.splice(i,1); updateUI(); };

window.logout = () => signOut(auth).then(() => location.reload());

// --- UI HELPERS ---
const playSound = (id) => { const s = document.getElementById(id); s.currentTime = 0; s.play(); };

document.getElementById('cartBtn').onclick = () => { 
    document.getElementById('cartSidebar').classList.add('active'); 
    playSound('snd-click');
};
document.getElementById('closeCart').onclick = () => document.getElementById('cartSidebar').classList.remove('active');

document.getElementById('checkoutBtn').onclick = async () => {
    if(!STATE.cart.length) return;
    playSound('snd-checkout');
    confetti({ particleCount: 150, spread: 70, colors: ['#000', '#C5A37D'] });
    alert("Transaction Successful.");
    STATE.cart = []; updateUI();
    document.getElementById('cartSidebar').classList.remove('active');
};

// Cursor
document.addEventListener('mousemove', e => {
    const c = document.getElementById('cursor');
    c.style.left = e.clientX + 'px'; c.style.top = e.clientY + 'px';
});
