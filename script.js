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
    wishlist: [],
    products: [
        {id: 1, name: "Ivory Silk Drape", price: 420, img: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=600"},
        {id: 2, name: "Noir Archive Suit", price: 850, img: "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?q=80&w=600"},
        {id: 3, name: "Sand Weave Scarf", price: 140, img: "https://images.unsplash.com/photo-1605763240000-7e93b172d754?q=80&w=600"},
        {id: 4, name: "Velvet Coast Vest", price: 340, img: "https://images.unsplash.com/photo-1581044777550-4cfa60707c03?q=80&w=600"},
        {id: 5, name: "Onyx Gaze Frame", price: 280, img: "https://images.unsplash.com/photo-1514327605112-b887c0e61c0a?q=80&w=600"},
        {id: 6, name: "Lace Shell Wrap", price: 1100, img: "https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?q=80&w=600"}
    ]
};

// --- AUTH LOGIC ---
document.getElementById('loginBtn').onclick = () => signInWithPopup(auth, provider);

onAuthStateChanged(auth, (user) => {
    if (user) {
        document.getElementById('authScreen').classList.add('hidden');
        document.getElementById('mainApp').classList.remove('hidden');
        setTimeout(() => document.getElementById('mainApp').classList.add('opacity-100'), 50);
        document.getElementById('userImg').src = user.photoURL;
        renderProducts(STATE.products);
    }
});

// --- RENDER PRODUCTS ---
function renderProducts(items) {
    const grid = document.getElementById('productGrid');
    grid.innerHTML = items.map(p => {
        const isLiked = STATE.wishlist.some(x => x.id === p.id);
        return `
        <div class="product-card">
            <div class="img-container" onclick="addToCart(${p.id})">
                <img src="${p.img}" alt="${p.name}">
            </div>
            <button class="like-btn ${isLiked ? 'liked' : ''}" onclick="toggleLike(${p.id})">
                <i class="${isLiked ? 'fa-solid' : 'fa-regular'} fa-heart"></i>
            </button>
            <div class="mt-3 text-center">
                <h4 class="text-[8px] font-bold uppercase tracking-[3px] text-gray-400 mb-1">${p.name}</h4>
                <b class="text-sm font-serif italic">$${p.price}</b>
            </div>
        </div>`;
    }).join('');
}

// --- WISHLIST / LIKE SYSTEM ---
window.toggleLike = (id) => {
    const index = STATE.wishlist.findIndex(x => x.id === id);
    if (index === -1) {
        STATE.wishlist.push(STATE.products.find(x => x.id === id));
        document.getElementById('snd-like').play();
    } else {
        STATE.wishlist.splice(index, 1);
    }
    updateUI();
    renderProducts(STATE.products);
};

// --- CART LOGIC ---
window.addToCart = (id) => {
    STATE.cart.push(STATE.products.find(x => x.id === id));
    document.getElementById('snd-cart').play();
    updateUI();
};

function updateUI() {
    document.getElementById('cartCount').innerText = STATE.cart.length;
    document.getElementById('wishCount').innerText = STATE.wishlist.length;
    
    // Cart Sidebar UI
    document.getElementById('cartItems').innerHTML = STATE.cart.map((item, i) => `
        <div class="flex justify-between items-center border-b border-gray-50 pb-3">
            <div><p class="text-[9px] font-bold uppercase tracking-widest">${item.name}</p>
            <b class="font-serif italic">$${item.price}</b></div>
            <button onclick="STATE.cart.splice(${i},1); updateUI();" class="text-xs">&times;</button>
        </div>`).join('');
    
    // Wishlist Sidebar UI
    document.getElementById('wishItems').innerHTML = STATE.wishlist.map((item, i) => `
        <div class="flex items-center gap-4 border-b border-gray-50 pb-3">
            <img src="${item.img}" class="w-12 h-12 object-cover grayscale">
            <span class="text-[9px] font-bold uppercase">${item.name}</span>
            <button onclick="toggleLike(${item.id})" class="ml-auto text-xs">&times;</button>
        </div>`).join('');

    document.getElementById('cartTotal').innerText = "$" + STATE.cart.reduce((a,b)=>a+b.price, 0);
}

// --- SIDEBAR TOGGLES ---
const toggleSidebar = (id, action) => document.getElementById(id).classList[action]('active');

document.getElementById('cartBtn').onclick = () => toggleSidebar('cartSidebar', 'add');
document.querySelector('.close-cart').onclick = () => toggleSidebar('cartSidebar', 'remove');
document.getElementById('wishBtn').onclick = () => toggleSidebar('wishlistSidebar', 'add');
document.querySelector('.close-wish').onclick = () => toggleSidebar('wishlistSidebar', 'remove');

// --- SORTING ---
document.getElementById('sortPrice').onchange = (e) => {
    let sorted = [...STATE.products];
    if(e.target.value === 'low') sorted.sort((a,b) => a.price - b.price);
    if(e.target.value === 'high') sorted.sort((a,b) => b.price - a.price);
    renderProducts(sorted);
};

// --- UTILS ---
document.addEventListener('mousemove', e => {
    const c = document.getElementById('cursor');
    c.style.left = e.clientX + 'px'; c.style.top = e.clientY + 'px';
});

window.logout = () => signOut(auth).then(() => location.reload());

document.getElementById('checkoutBtn').onclick = () => {
    if(!STATE.cart.length) return;
    confetti({ particleCount: 150, spread: 70, colors: ['#000', '#C5A37D'] });
    alert("Transaction Processed Successfully.");
    STATE.cart = []; updateUI();
    toggleSidebar('cartSidebar', 'remove');
};
