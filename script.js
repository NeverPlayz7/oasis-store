import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-app.js";
import { getAuth, GoogleAuthProvider, signInWithPopup, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-auth.js";
import { getFirestore, collection, addDoc } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore.js";

const firebaseConfig = { /* APKA FIREBASE CONFIG YAHA */ };
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const provider = new GoogleAuthProvider();

let STATE = {
    user: null, cart: [],
    products: [
        {id: 1, name: "Silk Drape", price: 420, img: "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?q=80&w=500"},
        {id: 2, name: "Velvet Void", price: 850, img: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=500"},
        {id: 3, name: "Ivory Shell", price: 310, img: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=500"},
        {id: 4, name: "Noir Frame", price: 590, img: "https://images.unsplash.com/photo-1549298916-b41d501d3772?q=80&w=500"},
        {id: 5, name: "Satin Mist", price: 280, img: "https://images.unsplash.com/photo-1581044777550-4cfa60707c03?q=80&w=500"},
        {id: 6, name: "Onyx Vest", price: 920, img: "https://images.unsplash.com/photo-1509631179647-0177331693ae?q=80&w=500"},
        {id: 7, name: "Lace Archive", price: 1100, img: "https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?q=80&w=500"},
        {id: 8, name: "Pure Sand", price: 150, img: "https://images.unsplash.com/photo-1506152983158-b4a74a01c721?q=80&w=500"}
    ]
};

// --- AUTH ---
window.loginWithGoogle = () => signInWithPopup(auth, provider);
window.handleLogout = () => { if(confirm("End Session?")) signOut(auth).then(() => location.reload()); };

onAuthStateChanged(auth, (user) => {
    if (user) {
        STATE.user = user;
        document.getElementById('authScreen').classList.add('hidden');
        document.getElementById('mainApp').classList.remove('hidden');
        setTimeout(() => document.getElementById('mainApp').classList.add('opacity-100'), 100);
        document.getElementById('userImg').src = user.photoURL;
        renderProducts();
    }
});

// --- FANCY CURSOR LOGIC ---
const cursor = document.getElementById('cursor');
document.addEventListener('mousemove', e => {
    cursor.style.left = e.clientX + 'px';
    cursor.style.top = e.clientY + 'px';
});

// --- SHOP ENGINE ---
function renderProducts() {
    document.getElementById('productGrid').innerHTML = STATE.products.map(p => `
        <div class="product-card group" onclick="addToCart(${p.id})">
            <div class="img-container">
                <img src="${p.img}" alt="${p.name}">
                <div class="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <span class="text-white text-[8px] tracking-[4px] font-bold">+ ACQUIRE</span>
                </div>
            </div>
            <div class="info">
                <h3>${p.name}</h3>
                <b>$${p.price}</b>
            </div>
        </div>
    `).join('');
}

window.addToCart = (id) => {
    STATE.cart.push(STATE.products.find(x => x.id === id));
    updateCartUI();
    cursor.style.transform = 'scale(2.5)';
    setTimeout(() => cursor.style.transform = 'scale(1)', 200);
};

function updateCartUI() {
    const total = STATE.cart.reduce((a,b) => a + b.price, 0);
    document.getElementById('cartItems').innerHTML = STATE.cart.map((item, i) => `
        <div class="flex justify-between items-start border-b border-gray-50 pb-8 animate-up">
            <div>
                <p class="text-[9px] font-bold tracking-[3px] uppercase text-gray-400 mb-2">${item.name}</p>
                <span class="font-serif italic text-2xl">$${item.price}</span>
            </div>
            <button onclick="event.stopPropagation(); STATE.cart.splice(${i},1); updateCartUI();" class="text-[10px] underline tracking-widest">REMOVE</button>
        </div>
    `).join('');
    document.getElementById('cartTotal').innerText = `$${total}`;
    document.getElementById('cartCount').innerText = STATE.cart.length;
}

window.processPayment = async () => {
    if(!STATE.cart.length) return;
    await addDoc(collection(db, "orders"), {
        uid: STATE.user.uid,
        items: STATE.cart.map(i => i.name),
        total: STATE.cart.reduce((a,b)=>a+b.price,0),
        timestamp: new Date().toISOString()
    });
    confetti({ particleCount: 40, spread: 50, colors: ['#000', '#fff'] });
    alert("ORDER PROCESSED IN THE ARCHIVE.");
    STATE.cart = []; updateCartUI(); toggleCart();
};

window.toggleCart = () => document.getElementById('cartSidebar').classList.toggle('active');
