import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-app.js";
import { getAuth, GoogleAuthProvider, signInWithPopup, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-auth.js";
import { getFirestore, collection, addDoc, query, where, getDocs, orderBy } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore.js";

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
        {id: 1, name: "Chronos One", price: 299, img: "https://picsum.photos/400/500?random=11"},
        {id: 2, name: "Neural Ear", price: 149, img: "https://picsum.photos/400/500?random=12"},
        {id: 3, name: "Void S1", price: 599, img: "https://picsum.photos/400/500?random=13"},
        {id: 4, name: "Apex Shell", price: 199, img: "https://picsum.photos/400/500?random=14"},
        {id: 5, name: "Cyber Lens", price: 349, img: "https://picsum.photos/400/500?random=15"},
        {id: 6, name: "Neo Strap", price: 89, img: "https://picsum.photos/400/500?random=16"},
        {id: 7, name: "Pulse V", price: 450, img: "https://picsum.photos/400/500?random=17"},
        {id: 8, name: "Grit X", price: 120, img: "https://picsum.photos/400/500?random=18"},
        {id: 9, name: "Ion Pro", price: 799, img: "https://picsum.photos/400/500?random=19"},
        {id: 10, name: "Flux Pad", price: 55, img: "https://picsum.photos/400/500?random=20"},
        {id: 11, name: "Aura Kit", price: 210, img: "https://picsum.photos/400/500?random=21"},
        {id: 12, name: "Core Hub", price: 175, img: "https://picsum.photos/400/500?random=22"}
    ]
};

// --- THEME ---
window.changeTheme = (theme) => {
    document.body.setAttribute('data-theme', theme);
    localStorage.setItem('oasis-theme', theme);
    const colors = { cyan: "#00f2ff", purple: "#bc1888", gold: "#ffae00" };
    if(window.pJSDom[0]) {
        window.pJSDom[0].pJS.particles.color.value = colors[theme];
        window.pJSDom[0].pJS.particles.line_linked.color = colors[theme];
        window.pJSDom[0].pJS.fn.particlesRefresh();
    }
};

// --- AUTH ---
window.loginWithGoogle = () => signInWithPopup(auth, provider);
window.handleLogout = () => { if(confirm("Logout from Oasis?")) signOut(auth); };

onAuthStateChanged(auth, (user) => {
    if (user) {
        STATE.user = user;
        document.getElementById('authScreen').style.opacity = '0';
        setTimeout(() => document.getElementById('authScreen').classList.add('hidden'), 700);
        document.getElementById('mainApp').classList.remove('hidden');
        setTimeout(() => document.getElementById('mainApp').classList.add('opacity-100'), 100);
        document.getElementById('userImg').src = user.photoURL;
        renderProducts();
    } else {
        document.getElementById('authScreen').classList.remove('hidden');
        document.getElementById('mainApp').classList.add('hidden');
    }
});

// --- SHOP ENGINE ---
function renderProducts() {
    document.getElementById('productGrid').innerHTML = STATE.products.map(p => `
        <div class="product-card group relative">
            <img src="${p.img}" class="w-full h-28 md:h-64 object-cover rounded-lg md:rounded-[25px] transition duration-700 group-hover:scale-105">
            <div class="mt-2 md:mt-4 px-1">
                <h3 class="text-[6px] md:text-[9px] tracking-[2px] md:tracking-[4px] text-gray-500 font-black uppercase">${p.name}</h3>
                <div class="flex justify-between items-center mt-1">
                    <b class="text-sm md:text-2xl italic font-black text-white">$${p.price}</b>
                    <button onclick="addToCart(${p.id})" class="bg-white text-black w-6 h-6 md:w-10 md:h-10 rounded-md md:rounded-xl hover:bg-accent transition-all">
                        <i class="fa-solid fa-plus text-[10px] md:text-base"></i>
                    </button>
                </div>
            </div>
        </div>
    `).join('');
}

window.addToCart = (id) => {
    STATE.cart.push(STATE.products.find(x => x.id === id));
    updateCartUI();
};

function updateCartUI() {
    let total = STATE.cart.reduce((a,b)=> a+b.price, 0);
    document.getElementById('cartItems').innerHTML = STATE.cart.map((item, i) => `
        <div class="bg-white/5 p-4 rounded-xl flex justify-between items-center">
            <div><p class="text-[8px] text-accent font-bold uppercase tracking-widest">${item.name}</p><b>$${item.price}</b></div>
            <button onclick="STATE.cart.splice(${i},1); updateCartUI();" class="text-red-500/50 hover:text-red-500 transition"><i class="fa-solid fa-trash"></i></button>
        </div>
    `).join('');
    document.getElementById('cartTotal').innerText = `$${total}`;
    document.getElementById('cartCount').innerText = STATE.cart.length;
}

window.processPayment = async () => {
    if(!STATE.cart.length) return;
    await addDoc(collection(db, "orders"), {
        uid: STATE.user.uid, email: STATE.user.email,
        items: STATE.cart, total: STATE.cart.reduce((a,b)=>a+b.price,0),
        timestamp: new Date().toISOString()
    });
    confetti({ particleCount: 150, spread: 70 });
    alert("ORDER ARCHIVED TO THE VOID");
    STATE.cart = []; updateCartUI(); toggleCart();
};

window.toggleCart = () => document.getElementById('cartSidebar').classList.toggle('active');

// --- PARTICLES INIT ---
particlesJS("particles-js", {
    "particles": {
        "number": { "value": window.innerWidth < 768 ? 40 : 100 },
        "color": { "value": "#00f2ff" },
        "opacity": { "value": 0.2 },
        "size": { "value": 1.5 },
        "line_linked": { "enable": true, "distance": 120, "color": "#00f2ff", "opacity": 0.1 },
        "move": { "enable": true, "speed": 1 }
    }
});

// Load saved theme
const savedTheme = localStorage.getItem('oasis-theme') || 'cyan';
document.getElementById('themeSelect').value = savedTheme;
changeTheme(savedTheme);
