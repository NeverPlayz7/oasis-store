// State & Persistence
let products = [
    { id: 1, name: "Neon Stealth One", price: 189, cat: "Footwear", img: "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=600" },
    { id: 2, name: "Cipher G-Series", price: 340, cat: "Gadgets", img: "https://images.unsplash.com/photo-1508685096489-7aac291bd5b3?w=600" },
    { id: 3, name: "Vantablack Hoodie", price: 95, cat: "Apparel", img: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=600" },
    { id: 4, name: "Apex Pro Gen-2", price: 210, cat: "Gadgets", img: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600" }
];

let cart = JSON.parse(localStorage.getItem('OASIS_CART')) || [];

// Particles Init
particlesJS("particles-js", {
    particles: {
        number: { value: 60 },
        color: { value: "#00f2ff" },
        opacity: { value: 0.2 },
        size: { value: 1 },
        line_linked: { enable: true, distance: 150, color: "#00f2ff", opacity: 0.05, width: 1 },
        move: { enable: true, speed: 1 }
    }
});

// Advanced Rendering
function renderProducts(data = products) {
    const grid = document.getElementById('product-grid');
    grid.innerHTML = data.map(p => `
        <div class="product-card group" onclick="openDetail(${p.id})">
            <div class="relative overflow-hidden rounded-[24px] h-[300px] mb-6">
                <img src="${p.img}" class="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110">
                <div class="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm">
                    <button class="bg-white text-black px-6 py-2 rounded-full font-black text-[10px] tracking-widest">QUICK LOOK</button>
                </div>
            </div>
            <div class="flex justify-between items-start">
                <div>
                    <p class="text-[10px] text-gray-500 font-bold uppercase tracking-widest mb-1">${p.cat}</p>
                    <h3 class="font-bold text-lg tracking-tight">${p.name}</h3>
                    <p class="text-cyan-400 font-black mt-2 text-xl">$${p.price}</p>
                </div>
                <button onclick="event.stopPropagation(); addToCart(${p.id})" class="nav-icon hover:bg-cyan-500 hover:text-black">
                    <i class="fa-solid fa-plus text-xs"></i>
                </button>
            </div>
        </div>
    `).join('');
    updateCartUI();
}

// Cart System with Quantity Logic
function addToCart(id) {
    const product = products.find(p => p.id === id);
    const existing = cart.find(item => item.id === id);
    
    if (existing) {
        existing.qty++;
    } else {
        cart.push({...product, qty: 1});
    }
    
    saveAndNotify(`${product.name} added to cart!`);
}

function updateCartUI() {
    const container = document.getElementById('cart-items-container');
    const countEl = document.getElementById('cart-count');
    const totalEl = document.getElementById('cart-total');
    
    countEl.innerText = cart.reduce((acc, item) => acc + item.qty, 0);
    
    let total = 0;
    container.innerHTML = cart.map(item => {
        total += item.price * item.qty;
        return `
            <div class="flex gap-4 group">
                <img src="${item.img}" class="w-20 h-20 object-cover rounded-2xl">
                <div class="flex-1">
                    <h4 class="font-bold text-sm">${item.name}</h4>
                    <p class="text-cyan-400 text-xs font-black mb-2">$${item.price}</p>
                    <div class="flex items-center gap-4 bg-white/5 w-fit rounded-full px-3 py-1">
                        <button onclick="changeQty(${item.id}, -1)" class="text-xs hover:text-cyan-400">-</button>
                        <span class="text-xs font-bold">${item.qty}</span>
                        <button onclick="changeQty(${item.id}, 1)" class="text-xs hover:text-cyan-400">+</button>
                    </div>
                </div>
                <button onclick="removeFromCart(${item.id})" class="opacity-0 group-hover:opacity-100 text-gray-600 hover:text-red-500 transition">
                    <i class="fa-solid fa-trash-can text-xs"></i>
                </button>
            </div>
        `;
    }).join('');
    
    totalEl.innerText = `$${total.toFixed(2)}`;
    document.getElementById('cart-items-info').innerText = `${cart.length} Items`;
}

function changeQty(id, delta) {
    const item = cart.find(i => i.id === id);
    item.qty += delta;
    if (item.qty < 1) return removeFromCart(id);
    saveAndNotify();
}

function removeFromCart(id) {
    cart = cart.filter(item => item.id !== id);
    saveAndNotify('Item removed.');
}

function saveAndNotify(msg) {
    localStorage.setItem('OASIS_CART', JSON.stringify(cart));
    updateCartUI();
    if(msg) showToast(msg);
}

// WhatsApp Professional Integration
function sendWhatsAppOrder() {
    if(!cart.length) return showToast("Cart is empty!");
    const phone = "923001234567";
    let message = "📦 *NEW ORDER - OASIS*%0A---------------------------%0A";
    let total = 0;
    cart.forEach(i => {
        message += `• ${i.name} [x${i.qty}] - $${i.price * i.qty}%0A`;
        total += i.price * i.qty;
    });
    message += `---------------------------%0A*Total: $${total}*%0A%0AConfirm this order?`;
    window.open(`https://wa.me/${phone}?text=${message}`);
}

// Dynamic Toast System
function showToast(msg) {
    const t = document.createElement('div');
    t.className = "fixed top-24 right-10 bg-white text-black px-8 py-4 rounded-2xl font-black text-[10px] tracking-widest uppercase shadow-2xl z-[2000] animate-slide-in";
    t.innerText = msg;
    document.body.appendChild(t);
    setTimeout(() => t.remove(), 3000);
}

// UI Handlers
function toggleCart() { document.getElementById('cartSidebar').classList.toggle('active'); }
function toggleModal(id) { document.getElementById(id).classList.toggle('hidden'); }
function searchProducts() {
    const q = document.getElementById('searchInput').value.toLowerCase();
    renderProducts(products.filter(p => p.name.toLowerCase().includes(q)));
}

// App Initialization
window.onload = () => {
    setTimeout(() => renderProducts(), 1000); // Artificial delay for premium feel
};
