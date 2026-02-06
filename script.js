import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-app.js";
import { getAuth, GoogleAuthProvider, signInWithPopup, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-auth.js";
import { getFirestore, collection, addDoc } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore.js";

const firebaseConfig = { /* APKA FIREBASE CONFIG YAHA DAALEIN */ };
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
        // Mazeed products add karein taaki PC pe 6 columns bhare huye lagyein
    ]
};

// --- AUTH ---
window.loginWithGoogle = () => signInWithPopup(auth, provider);
onAuthStateChanged(auth, (user) => {
    if (user) {
        STATE.user = user;
        document.getElementById('authScreen').classList.add('opacity-0', 'pointer-events-none');
        document.getElementById('mainApp').classList.remove('hidden');
        setTimeout(() => document.getElementById('mainApp').classList.add('opacity-100'), 100);
        document.getElementById('userImg').src = user.photoURL;
        renderProducts();
    }
});

// --- SHOP ---
function renderProducts() {
    document.getElementById('productGrid').innerHTML = STATE.products.map(p => `
        <div class="product-card group" onclick="addToCart(${p.id})">
            <div class="overflow-hidden bg-gray-100">
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
    // Subtle luxury vibration/feedback
    if (navigator.vibrate) navigator.vibrate(10);
};

function updateCartUI() {
    let total = STATE.cart.reduce((a,b)=> a+b.price, 0);
    document.getElementById('cartItems').innerHTML = STATE.cart.map((item, i) => `
        <div class="flex justify-between items-center border-b border-gray-50 pb-4">
            <div>
                <p class="text-[9px] font-bold tracking-widest uppercase">${item.name}</p>
                <span class="font-serif italic">$${item.price}</span>
            </div>
            <button onclick="event.stopPropagation(); STATE.cart.splice(${i},1); updateCartUI();" class="text-xs text-gray-400 hover:text-black">REMOVE</button>
        </div>
    `).join('');
    document.getElementById('cartTotal').innerText = `$${total}`;
    document.getElementById('cartCount').innerText = STATE.cart.length;
}

window.processPayment = async () => {
    if(!STATE.cart.length) return;
    await addDoc(collection(db, "orders"), {
        uid: STATE.user.uid,
        total: STATE.cart.reduce((a,b)=>a+b.price,0),
        timestamp: new Date().toISOString()
    });
    confetti({ particleCount: 50, spread: 60, colors: ['#000000', '#C5A37D'] });
    alert("ORDER CONFIRMED. THANK YOU FOR CHOOSING OASIS.");
    STATE.cart = []; updateCartUI(); toggleCart();
};

window.toggleCart = () => document.getElementById('cartSidebar').classList.toggle('active');

window.changeTheme = (theme) => {
    document.body.setAttribute('data-theme', theme);
};
