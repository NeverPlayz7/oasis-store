import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-app.js";
import { getAuth, GoogleAuthProvider, signInWithPopup, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-auth.js";
import { getFirestore, collection, addDoc } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyAYwc4wlCgMNZoikTbt-ph48zatsUo6Kw0",
    authDomain: "oasis-own.firebaseapp.com",
    projectId: "oasis-own",
    storageBucket: "oasis-own.firebasestorage.app",
    messagingSenderId: "621399635023",
    appId: "1:621399635023:web:7bb98a8f74eb72cb9fa63a"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const provider = new GoogleAuthProvider();

let STATE = {
    user: null, cart: [],
    products: [
        {id: 1, name: "The Ocean Suite", price: 299, img: "https://images.unsplash.com/photo-1590490360182-c33d57733427?q=80&w=600"},
        {id: 2, name: "Coastal Haven", price: 199, img: "https://images.unsplash.com/photo-1540518614846-7eded433c457?q=80&w=600"},
        {id: 3, name: "Garden Retreat", price: 150, img: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?q=80&w=600"},
        {id: 4, name: "Luxury Villa", price: 450, img: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?q=80&w=600"},
        {id: 5, name: "The Penthouse", price: 899, img: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?q=80&w=600"},
        {id: 6, name: "Studio Room", price: 120, img: "https://images.unsplash.com/photo-1554995207-c18c203602cb?q=80&w=600"},
        {id: 7, name: "Mariven View", price: 340, img: "https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=600"},
        {id: 8, name: "Minimalist Loft", price: 210, img: "https://images.unsplash.com/photo-1502672023488-70e25813efdf?q=80&w=600"}
    ]
};

// --- AUTH LOGIC ---
window.loginWithGoogle = () => signInWithPopup(auth, provider);
window.handleLogout = () => { if(confirm("End Session?")) signOut(auth).then(() => location.reload()); };

onAuthStateChanged(auth, (user) => {
    const authScr = document.getElementById('authScreen');
    const appScr = document.getElementById('mainApp');
    if (user) {
        STATE.user = user;
        authScr.style.opacity = '0';
        setTimeout(() => { authScr.classList.add('hidden'); appScr.classList.remove('hidden'); }, 700);
        setTimeout(() => appScr.classList.add('opacity-100'), 800);
        document.getElementById('userImg').src = user.photoURL;
        renderProducts();
    }
});

// --- SHOP ENGINE ---
function renderProducts() {
    document.getElementById('productGrid').innerHTML = STATE.products.map(p => `
        <div class="product-card group" onclick="addToCart(${p.id})">
            <div class="overflow-hidden bg-[#F0F0F0]">
                <img src="${p.img}" alt="${p.name}">
            </div>
            <div class="info">
                <h3 class="text-[9px] md:text-[11px] font-bold tracking-[3px] uppercase mb-1">${p.name}</h3>
                <b class="text-sm md:text-lg font-serif italic">$${p.price}</b>
            </div>
        </div>
    `).join('');
}

window.addToCart = (id) => {
    STATE.cart.push(STATE.products.find(x => x.id === id));
    updateCartUI();
};

function updateCartUI() {
    const total = STATE.cart.reduce((a,b) => a + b.price, 0);
    document.getElementById('cartItems').innerHTML = STATE.cart.map((item, i) => `
        <div class="flex justify-between items-center border-b border-gray-100 pb-4">
            <div>
                <p class="text-[9px] font-bold tracking-widest uppercase">${item.name}</p>
                <span class="font-serif italic text-sm">$${item.price}</span>
            </div>
            <button onclick="event.stopPropagation(); STATE.cart.splice(${i},1); updateCartUI();" class="text-[10px] text-gray-400 hover:text-black">REMOVE</button>
        </div>
    `).join('');
    document.getElementById('cartTotal').innerText = `$${total}`;
    document.getElementById('cartCount').innerText = STATE.cart.length;
}

window.processPayment = async () => {
    if(!STATE.cart.length) return;
    await addDoc(collection(db, "orders"), {
        uid: STATE.user.uid,
        email: STATE.user.email,
        total: STATE.cart.reduce((a,b)=>a+b.price,0),
        timestamp: new Date().toISOString()
    });
    confetti({ particleCount: 100, spread: 70, colors: ['#C5A37D', '#000000'] });
    alert("ORDER ARCHIVED. THANK YOU.");
    STATE.cart = []; updateCartUI(); toggleCart();
};

window.toggleCart = () => document.getElementById('cartSidebar').classList.toggle('active');

window.changeTheme = (theme) => {
    document.body.setAttribute('data-theme', theme);
    localStorage.setItem('oasis-theme', theme);
};

// Init Theme
const savedTheme = localStorage.getItem('oasis-theme') || 'pearl';
document.getElementById('themeSelect').value = savedTheme;
changeTheme(savedTheme);
