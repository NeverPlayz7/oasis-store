import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-app.js";
import { getAuth, GoogleAuthProvider, signInWithPopup, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-auth.js";
import { getFirestore, collection, addDoc, query, where, getDocs, orderBy } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore.js";

// 🔥 Aapka Real Firebase Config
const firebaseConfig = {
  apiKey: "AIzaSyAYwc4wlCgMNZoikTbt-ph48zatsUo6Kw0",
  authDomain: "oasis-own.firebaseapp.com",
  projectId: "oasis-own",
  storageBucket: "oasis-own.firebasestorage.app",
  messagingSenderId: "621399635023",
  appId: "1:621399635023:web:7bb98a8f74eb72cb9fa63a"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const provider = new GoogleAuthProvider();

// App State
let STATE = {
    user: null,
    cart: [],
    products: [
        {id: 1, name: "Oasis Smart Watch V1", price: 299, img: "https://picsum.photos/400/500?random=1"},
        {id: 2, name: "Stealth Audio Buds", price: 149, img: "https://picsum.photos/400/500?random=2"},
        {id: 3, name: "Phantom Sneakers", price: 599, img: "https://picsum.photos/400/500?random=3"},
        {id: 4, name: "Archive Tech-Bag", price: 199, img: "https://picsum.photos/400/500?random=4"}
    ]
};

// --- AUTH LOGIC ---
window.loginWithGoogle = async () => {
    try {
        await signInWithPopup(auth, provider);
    } catch (error) {
        console.error("Auth Error:", error);
        alert("Login failed! Please check your Firebase settings.");
    }
};

window.handleLogout = () => signOut(auth);

onAuthStateChanged(auth, (user) => {
    const authScreen = document.getElementById('authScreen');
    const mainApp = document.getElementById('mainApp');
    
    if (user) {
        STATE.user = user;
        authScreen.classList.add('hidden');
        mainApp.classList.remove('hidden');
        setTimeout(() => mainApp.style.opacity = '1', 100);
        document.getElementById('userImg').src = user.photoURL;
        
        // ADMIN CHECK: Apni email yahan daalein
        if(user.email === "your-email@gmail.com") { 
            document.getElementById('adminBtn').classList.remove('hidden');
        }
        renderProducts();
    } else {
        STATE.user = null;
        authScreen.classList.remove('hidden');
        mainApp.classList.add('hidden');
    }
});

// --- SHOPPING ENGINE ---
function renderProducts() {
    const grid = document.getElementById('productGrid');
    grid.innerHTML = STATE.products.map(p => `
        <div class="product-card p-5 group glass rounded-[40px]">
            <div class="overflow-hidden rounded-[30px] mb-6">
                <img src="${p.img}" class="w-full h-72 object-cover group-hover:scale-110 transition duration-700">
            </div>
            <h3 class="font-black text-gray-500 text-[10px] tracking-[4px] uppercase mb-2">${p.name}</h3>
            <div class="flex justify-between items-center">
                <p class="text-3xl font-black italic">$${p.price}</p>
                <button onclick="addToCart(${p.id})" class="bg-white text-black p-4 rounded-2xl hover:bg-cyan-500 transition-all">
                    <i class="fa-solid fa-plus"></i>
                </button>
            </div>
        </div>
    `).join('');
}

window.addToCart = (id) => {
    const p = STATE.products.find(x => x.id === id);
    STATE.cart.push(p);
    updateCartUI();
};

function updateCartUI() {
    const container = document.getElementById('cartItems');
    let total = 0;
    container.innerHTML = STATE.cart.map((item, index) => {
        total += item.price;
        return `<div class="glass p-5 rounded-3xl flex justify-between items-center">
            <div><p class="font-black text-xs uppercase">${item.name}</p><b>$${item.price}</b></div>
            <button onclick="removeFromCart(${index})" class="opacity-30 hover:opacity-100 text-red-500">
                <i class="fa-solid fa-trash"></i>
            </button>
        </div>`;
    }).join('');
    document.getElementById('cartTotal').innerText = `$${total}`;
    document.getElementById('cartCount').innerText = STATE.cart.length;
}

window.removeFromCart = (index) => {
    STATE.cart.splice(index, 1);
    updateCartUI();
};

// --- PAYMENTS & DATA ---
window.processPayment = async () => {
    if(!STATE.cart.length) return alert("Archive Bag is empty");
    
    const total = STATE.cart.reduce((a,b) => a + b.price, 0);
    const order = {
        uid: STATE.user.uid,
        userName: STATE.user.displayName,
        email: STATE.user.email,
        items: STATE.cart,
        total: total,
        status: "Paid/Confirmed",
        timestamp: new Date().toISOString()
    };

    try {
        await addDoc(collection(db, "orders"), order);
        confetti({ particleCount: 200, spread: 80, origin: { y: 0.6 } });
        alert("TRANSACTION VERIFIED: Order placed successfully.");
        STATE.cart = [];
        updateCartUI();
        toggleCart();
    } catch (e) { 
        console.error("Order Error:", e);
        alert("Could not save order. Make sure Firestore is in 'Test Mode'.");
    }
};

// --- NAVIGATION & SIDEBARS ---
window.toggleCart = () => document.getElementById('cartSidebar').classList.toggle('active');
window.toggleHistory = async () => {
    const sidebar = document.getElementById('historySidebar');
    sidebar.classList.toggle('active');
    
    if(sidebar.classList.contains('active')) {
        const q = query(collection(db, "orders"), where("uid", "==", STATE.user.uid), orderBy("timestamp", "desc"));
        const snap = await getDocs(q);
        document.getElementById('historyItems').innerHTML = snap.docs.map(doc => `
            <div class="glass p-6 rounded-3xl mb-4">
                <div class="flex justify-between mb-2">
                    <span class="text-[9px] font-black text-cyan-500 uppercase">#${doc.id.slice(0,8)}</span>
                    <span class="text-[9px] opacity-40">${new Date(doc.data().timestamp).toLocaleDateString()}</span>
                </div>
                <p class="text-3xl font-black italic">$${doc.data().total}</p>
            </div>
        `).join('');
    }
};

window.toggleAdmin = async (show) => {
    const panel = document.getElementById('adminPanel');
    panel.style.display = show ? 'block' : 'none';
    if(show) {
        const snap = await getDocs(collection(db, "orders"));
        document.getElementById('adminOrders').innerHTML = snap.docs.map(doc => `
            <div class="glass p-6 rounded-[30px] flex justify-between items-center mb-4">
                <div>
                    <h4 class="font-black text-xl uppercase">${doc.data().userName}</h4>
                    <p class="text-xs opacity-50">${doc.data().email}</p>
                </div>
                <div class="text-right">
                    <p class="text-3xl font-black text-green-400">$${doc.data().total}</p>
                </div>
            </div>
        `).join('');
    }
};

// --- MOUSE CURSOR ---
document.addEventListener('mousemove', e => {
    const dot = document.getElementById('cursor-dot');
    const outline = document.getElementById('cursor-outline');
    dot.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
    outline.style.transform = `translate(${e.clientX - 15}px, ${e.clientY - 15}px)`;
});
