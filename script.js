import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-app.js";
import { getAuth, GoogleAuthProvider, signInWithPopup, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-auth.js";
import { getFirestore, collection, addDoc } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore.js";

const firebaseConfig = {
    // APNA REAL CONFIG YAHA DALEIN
    apiKey: "AIzaSy...", 
    authDomain: "oasis-own.firebaseapp.com",
    projectId: "oasis-own",
    storageBucket: "oasis-own.appspot.com",
    messagingSenderId: "...",
    appId: "..."
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const provider = new GoogleAuthProvider();

let STATE = { cart: [], wishlist: [], products: [
    {id: 1, name: "Silk Drape", price: 420, img: "https://picsum.photos/400/600?random=1"},
    {id: 2, name: "Noir Frame", price: 590, img: "https://picsum.photos/400/600?random=2"},
    {id: 3, name: "Aura Mist", price: 150, img: "https://picsum.photos/400/600?random=3"},
    {id: 4, name: "Velvet Void", price: 850, img: "https://picsum.photos/400/600?random=4"},
    {id: 5, name: "Satin Shell", price: 280, img: "https://picsum.photos/400/600?random=5"},
    {id: 6, name: "Onyx Gaze", price: 340, img: "https://picsum.photos/400/600?random=6"}
]};

// --- Login Fix ---
document.getElementById('loginBtn').addEventListener('click', () => {
    signInWithPopup(auth, provider).catch(err => alert("Login Error: " + err.message));
});

onAuthStateChanged(auth, (user) => {
    if (user) {
        document.getElementById('authScreen').classList.add('hidden');
        const app = document.getElementById('mainApp');
        app.classList.remove('hidden');
        setTimeout(() => app.classList.add('opacity-100'), 100);
        document.getElementById('userImg').src = user.photoURL;
        renderProducts();
    }
});

// --- Shop Logic ---
function renderProducts() {
    document.getElementById('productGrid').innerHTML = STATE.products.map(p => `
        <div class="product-card group relative cursor-pointer" onclick="addToCart(${p.id})">
            <div class="overflow-hidden bg-gray-100"><img src="${p.img}" class="w-full aspect-[2/3] object-cover filter grayscale group-hover:grayscale-0 transition-all duration-700"></div>
            <div class="mt-3 text-center">
                <h3 class="text-[8px] font-bold uppercase tracking-widest text-gray-400">${p.name}</h3>
                <b class="text-lg font-serif italic">$${p.price}</b>
            </div>
        </div>
    `).join('');
}

window.addToCart = (id) => {
    STATE.cart.push(STATE.products.find(x => x.id === id));
    document.getElementById('snd-cart').play();
    updateUI();
};

window.toggleSidebar = (id) => document.getElementById(id).classList.toggle('active');

function updateUI() {
    document.getElementById('cartCount').innerText = STATE.cart.length;
    document.getElementById('cartItems').innerHTML = STATE.cart.map((item, i) => `
        <div class="flex justify-between items-center border-b pb-2">
            <span class="text-xs font-bold uppercase">${item.name}</span>
            <span class="font-serif italic">$${item.price}</span>
        </div>
    `).join('');
    document.getElementById('cartTotal').innerText = "$" + STATE.cart.reduce((a,b)=>a+b.price, 0);
}

window.checkout = async () => {
    if(STATE.cart.length === 0) return;
    confetti({ particleCount: 150, spread: 70 });
    alert("Order Placed Successfully!");
    STATE.cart = []; updateUI(); toggleSidebar('cartSidebar');
};

// Cursor
document.addEventListener('mousemove', e => {
    const c = document.getElementById('cursor');
    c.style.left = e.clientX + 'px'; c.style.top = e.clientY + 'px';
});
