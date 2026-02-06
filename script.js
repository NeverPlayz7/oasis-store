import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-app.js";
import { getAuth, GoogleAuthProvider, signInWithPopup, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-auth.js";
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
        {id: 1, name: "Oasis Watch", price: 299, img: "https://picsum.photos/400/500?random=1"},
        {id: 2, name: "Cyber Buds", price: 149, img: "https://picsum.photos/400/500?random=2"},
        {id: 3, name: "Void Runner", price: 599, img: "https://picsum.photos/400/500?random=3"},
        {id: 4, name: "Sentient Bag", price: 199, img: "https://picsum.photos/400/500?random=4"}
    ]
};

// --- THEME ENGINE ---
window.changeTheme = (theme) => {
    document.body.setAttribute('data-theme', theme);
    localStorage.setItem('oasis-theme', theme);
    
    // Refresh Particles Color
    const colors = { cyan: "#00f2ff", purple: "#bc1888", gold: "#ffae00" };
    if(window.pJSDom[0]) {
        window.pJSDom[0].pJS.particles.color.value = colors[theme];
        window.pJSDom[0].pJS.particles.line_linked.color = colors[theme];
        window.pJSDom[0].pJS.fn.particlesRefresh();
    }
};

// --- AUTH ---
window.loginWithGoogle = () => signInWithPopup(auth, provider);
onAuthStateChanged(auth, (user) => {
    if (user) {
        STATE.user = user;
        document.getElementById('authScreen').style.opacity = '0';
        setTimeout(()=> document.getElementById('authScreen').classList.add('hidden'), 700);
        document.getElementById('mainApp').classList.remove('hidden');
        setTimeout(()=> document.getElementById('mainApp').classList.add('opacity-100'), 100);
        document.getElementById('userImg').src = user.photoURL;
        renderProducts();
    }
});

// --- SHOP ---
function renderProducts() {
    document.getElementById('productGrid').innerHTML = STATE.products.map(p => `
        <div class="product-card p-4 md:p-6 group">
            <img src="${p.img}" class="rounded-[30px] mb-6 w-full h-64 md:h-80 object-cover group-hover:scale-105 transition duration-700">
            <h3 class="text-[9px] tracking-[4px] text-gray-500 font-black mb-2 uppercase">${p.name}</h3>
            <div class="flex justify-between items-center">
                <p class="text-2xl md:text-3xl font-black italic">$${p.price}</p>
                <button onclick="addToCart(${p.id})" class="bg-white text-black w-10 h-10 md:w-12 md:h-12 rounded-xl hover:bg-accent transition-all">
                    <i class="fa-solid fa-plus"></i>
                </button>
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
        <div class="bg-white/5 p-4 rounded-2xl flex justify-between items-center">
            <div><p class="text-[8px] text-accent font-bold uppercase">${item.name}</p><b>$${item.price}</b></div>
            <button onclick="STATE.cart.splice(${i},1); updateCartUI();" class="text-red-500"><i class="fa-solid fa-trash"></i></button>
        </div>
    `).join('');
    document.getElementById('cartTotal').innerText = `$${total}`;
    document.getElementById('cartCount').innerText = STATE.cart.length;
}

window.processPayment = async () => {
    if(!STATE.cart.length) return;
    await addDoc(collection(db, "orders"), {
        uid: STATE.user.uid, email: STATE.user.email,
        total: STATE.cart.reduce((a,b)=>a+b.price,0), timestamp: new Date().toISOString()
    });
    confetti({ particleCount: 150, spread: 70 });
    alert("ORDER CONFIRMED");
    STATE.cart = []; updateCartUI(); toggleCart();
};

window.toggleCart = () => document.getElementById('cartSidebar').classList.toggle('active');

// --- PARTICLES ---
particlesJS("particles-js", {
    "particles": {
        "number": { "value": window.innerWidth < 768 ? 40 : 80 },
        "color": { "value": "#00f2ff" },
        "opacity": { "value": 0.3 },
        "size": { "value": 2 },
        "line_linked": { "enable": true, "distance": 150, "color": "#00f2ff", "opacity": 0.1 },
        "move": { "enable": true, "speed": 1.5 }
    }
});

// Load saved theme
const savedTheme = localStorage.getItem('oasis-theme') || 'cyan';
document.getElementById('themeSelect').value = savedTheme;
changeTheme(savedTheme);
