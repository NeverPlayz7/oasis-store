import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-app.js";
import { getAuth, GoogleAuthProvider, signInWithPopup, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-auth.js";
import { getFirestore, collection, addDoc, query, where, getDocs, orderBy } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore.js";

const firebaseConfig = { /* APKA FIREBASE CONFIG YAHA */ };
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const provider = new GoogleAuthProvider();

let STATE = {
    user: null, cart: [], wishlist: [],
    products: [
        {id: 1, name: "Silk Drape", price: 420, img: "https://picsum.photos/400/600?random=1"},
        {id: 2, name: "Noir Frame", price: 590, img: "https://picsum.photos/400/600?random=2"},
        {id: 3, name: "Aura Mist", price: 150, img: "https://picsum.photos/400/600?random=3"},
        {id: 4, name: "Velvet Void", price: 850, img: "https://picsum.photos/400/600?random=4"},
        {id: 5, name: "Satin Shell", price: 280, img: "https://picsum.photos/400/600?random=5"},
        {id: 6, name: "Onyx Gaze", price: 340, img: "https://picsum.photos/400/600?random=6"},
        {id: 7, name: "Pure Sand", price: 120, img: "https://picsum.photos/400/600?random=7"},
        {id: 8, name: "Lace Archive", price: 900, img: "https://picsum.photos/400/600?random=8"}
    ]
};

// --- AUDIO HELPERS ---
window.playSound = (id) => {
    const s = document.getElementById(id);
    if(s) { s.currentTime = 0; s.play(); }
};

// --- AUTH ---
onAuthStateChanged(auth, (user) => {
    if (user) {
        STATE.user = user;
        document.getElementById('authScreen').classList.add('hidden');
        document.getElementById('mainApp').classList.remove('hidden');
        setTimeout(() => document.getElementById('mainApp').classList.add('opacity-100'), 100);
        document.getElementById('userImg').src = user.photoURL;
        renderProducts();
        fetchHistory();
    }
});
window.loginWithGoogle = () => signInWithPopup(auth, provider);
window.handleLogout = () => signOut(auth).then(() => location.reload());

// --- SHOP ENGINE ---
function renderProducts() {
    document.getElementById('productGrid').innerHTML = STATE.products.map(p => `
        <div class="product-card group relative cursor-pointer">
            <div class="overflow-hidden bg-gray-100 relative">
                <img src="${p.img}" alt="${p.name}">
                <div class="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center gap-4">
                    <button onclick="addToWishlist(${p.id}); event.stopPropagation()" class="bg-white p-3 rounded-full hover:bg-black hover:text-white transition"><i class="fa-solid fa-heart"></i></button>
                    <button onclick="addToCart(${p.id}); event.stopPropagation()" class="bg-white p-3 rounded-full hover:bg-black hover:text-white transition"><i class="fa-solid fa-plus"></i></button>
                </div>
            </div>
            <div class="info mt-3 text-center">
                <h3 class="text-[9px] font-bold uppercase tracking-widest text-gray-400">${p.name}</h3>
                <b class="text-xl font-serif italic">$${p.price}</b>
            </div>
        </div>
    `).join('');
}

window.addToCart = (id) => {
    STATE.cart.push(STATE.products.find(x => x.id === id));
    playSound('snd-cart');
    updateUI();
};

window.addToWishlist = (id) => {
    if(!STATE.wishlist.find(x => x.id === id)) {
        STATE.wishlist.push(STATE.products.find(x => x.id === id));
        playSound('snd-click');
        updateUI();
    }
};

function updateUI() {
    document.getElementById('cartCount').innerText = STATE.cart.length;
    document.getElementById('wishCount').innerText = STATE.wishlist.length;
    
    document.getElementById('cartItems').innerHTML = STATE.cart.map((item, i) => `
        <div class="flex justify-between items-center border-b pb-4">
            <div><p class="text-[10px] font-bold uppercase">${item.name}</p><b class="font-serif italic">$${item.price}</b></div>
            <button onclick="STATE.cart.splice(${i},1); updateUI()" class="text-gray-400 text-xs">REMOVE</button>
        </div>
    `).join('');
    
    const total = STATE.cart.reduce((a,b) => a + b.price, 0);
    document.getElementById('cartTotal').innerText = `$${total}`;
}

window.processPayment = async () => {
    if(!STATE.cart.length) return;
    playSound('snd-checkout');
    const orderData = {
        uid: STATE.user.uid,
        items: STATE.cart.map(i => i.name),
        total: STATE.cart.reduce((a,b)=>a+b.price, 0),
        status: "Acquired",
        timestamp: new Date().toISOString()
    };
    await addDoc(collection(db, "orders"), orderData);
    confetti({ particleCount: 150, spread: 70, colors: ['#000', '#C5A37D'] });
    STATE.cart = []; updateUI(); toggleSidebar('cartSidebar');
    fetchHistory();
};

// Sidebars & Tracking
window.toggleSidebar = (id) => document.getElementById(id).classList.toggle('active');
window.toggleHistory = () => toggleSidebar('historySidebar');

async function fetchHistory() {
    const q = query(collection(db, "orders"), where("uid", "==", STATE.user.uid), orderBy("timestamp", "desc"));
    const snap = await getDocs(q);
    document.getElementById('historyItems').innerHTML = snap.docs.map(doc => `
        <div class="p-4 border rounded-xl">
            <div class="flex justify-between text-[10px] font-bold mb-2">
                <span>${doc.data().status.toUpperCase()}</span>
                <span class="font-serif italic text-lg">$${doc.data().total}</span>
            </div>
            <div class="w-full bg-gray-100 h-1 rounded-full"><div class="bg-black h-full" style="width: 30%"></div></div>
        </div>
    `).join('');
}

// Cursor
document.addEventListener('mousemove', e => {
    const c = document.getElementById('cursor');
    c.style.left = e.clientX + 'px';
    c.style.top = e.clientY + 'px';
});
