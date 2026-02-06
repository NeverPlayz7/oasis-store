// 1. Core State & Error Handling
const STATE = {
    products: [
        { id: 1, name: "Vantablack V1 Sneakers", price: 210, cat: "Footwear", img: "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=800" },
        { id: 2, name: "Cipher G-Series Watch", price: 420, cat: "Gadgets", img: "https://images.unsplash.com/photo-1508685096489-7aac291bd5b3?w=800" },
        { id: 3, name: "Ghost-Shell Hoodie", price: 145, cat: "Apparel", img: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=800" },
        { id: 4, name: "Neon-Link Headphones", price: 310, cat: "Gadgets", img: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800" }
    ],
    cart: JSON.parse(localStorage.getItem('OASIS_CART_SECURE')) || [],
    currentSort: 'default',
    filter: 'All'
};

// 2. Initialize App
document.addEventListener('DOMContentLoaded', () => {
    initParticles();
    renderProducts();
    updateScrollProgress();
    window.addEventListener('scroll', updateScrollProgress);
});

// 3. Robust Rendering (Glitch-Free)
function renderProducts() {
    const grid = document.getElementById('product-grid');
    if(!grid) return;

    let displayData = [...STATE.products];
    
    // Filter
    if(STATE.filter !== 'All') {
        displayData = displayData.filter(p => p.cat === STATE.filter);
    }

    // Sort
    if(STATE.currentSort === 'low') displayData.sort((a,b) => a.price - b.price);
    if(STATE.currentSort === 'high') displayData.sort((a,b) => b.price - a.price);

    grid.innerHTML = displayData.map(p => `
        <article class="product-card group">
            <div class="img-box mb-6">
                <img src="${p.img}" loading="lazy">
                <div class="absolute bottom-4 left-4 right-4 translate-y-12 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-500">
                    <button onclick="addToCart(${p.id})" class="w-full bg-white text-black font-black py-3 rounded-xl text-[10px] tracking-widest uppercase hover:bg-cyan-500 transition-colors">Add to Bag</button>
                </div>
            </div>
            <div class="flex justify-between items-start px-2">
                <div>
                    <h3 class="text-sm font-bold text-gray-300 group-hover:text-cyan-400 transition-colors uppercase tracking-tight">${p.name}</h3>
                    <p class="text-[10px] font-bold text-gray-500 uppercase tracking-widest mt-1">${p.cat}</p>
                </div>
                <span class="text-lg font-black italic">$${p.price}</span>
            </div>
        </article>
    `).join('');
    updateCartUI();
}

// 4. Cart Logic with Direct Feedback
function addToCart(id) {
    const product = STATE.products.find(p => p.id === id);
    const existing = STATE.cart.find(item => item.id === id);

    if(existing) {
        existing.qty++;
    } else {
        STATE.cart.push({...product, qty: 1, addedAt: Date.now()});
    }

    syncStorage();
    showNotify(`${product.name} SECURED IN BAG`);
}

function updateCartUI() {
    const container = document.getElementById('cart-container');
    const badge = document.getElementById('cart-count');
    const info = document.getElementById('cart-info-count');
    const totalEl = document.getElementById('total-price');

    const totalQty = STATE.cart.reduce((acc, i) => acc + i.qty, 0);
    badge.innerText = totalQty;
    info.innerText = `${totalQty} ITEMS`;

    let totalVal = 0;
    container.innerHTML = STATE.cart.map(item => {
        totalVal += item.price * item.qty;
        return `
            <div class="flex gap-6 items-center">
                <img src="${item.img}" class="w-20 h-24 object-cover rounded-xl grayscale hover:grayscale-0 transition duration-500">
                <div class="flex-1">
                    <h4 class="font-black text-xs uppercase tracking-tight mb-1">${item.name}</h4>
                    <p class="text-cyan-400 font-bold text-xs">$${item.price}</p>
                    <div class="flex items-center gap-4 mt-3 bg-white/5 w-fit rounded-full px-4 py-1.5 border border-white/5">
                        <button onclick="changeQty(${item.id}, -1)" class="text-gray-500 hover:text-white">-</button>
                        <span class="text-[10px] font-bold">${item.qty}</span>
                        <button onclick="changeQty(${item.id}, 1)" class="text-gray-500 hover:text-white">+</button>
                    </div>
                </div>
                <button onclick="removeItem(${item.id})" class="text-gray-700 hover:text-red-500 transition"><i class="fa-solid fa-trash-can"></i></button>
            </div>
        `;
    }).join('');

    totalEl.innerText = `$${totalVal.toFixed(2)}`;
}

// 5. Utility Functions
function changeQty(id, delta) {
    const item = STATE.cart.find(i => i.id === id);
    item.qty += delta;
    if(item.qty < 1) return removeItem(id);
    syncStorage();
}

function removeItem(id) {
    STATE.cart = STATE.cart.filter(i => i.id !== id);
    syncStorage();
}

function syncStorage() {
    localStorage.setItem('OASIS_CART_SECURE', JSON.stringify(STATE.cart));
    updateCartUI();
}

function toggleCart() {
    document.getElementById('cartSidebar').classList.toggle('open');
}

function filterCategory(cat) {
    STATE.filter = cat;
    renderProducts();
}

function sortProducts(val) {
    STATE.currentSort = val;
    renderProducts();
}

function showNotify(msg) {
    const n = document.createElement('div');
    n.className = "fixed top-24 right-10 bg-white text-black px-8 py-4 rounded-xl font-black text-[10px] tracking-[3px] uppercase z-[2000] shadow-2xl animate-slide";
    n.innerText = msg;
    document.body.appendChild(n);
    setTimeout(() => n.remove(), 3000);
}

function updateScrollProgress() {
    const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
    const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrolled = (winScroll / height) * 100;
    document.getElementById("scrollProgress").style.width = scrolled + "%";
}

function initParticles() {
    particlesJS("particles-js", {
        particles: {
            number: { value: 60, density: { enable: true, value_area: 800 } },
            color: { value: "#00f2ff" },
            opacity: { value: 0.2 },
            size: { value: 1 },
            line_linked: { enable: true, distance: 150, color: "#00f2ff", opacity: 0.05, width: 1 },
            move: { enable: true, speed: 0.8, out_mode: "out" }
        },
        interactivity: { events: { onhover: { enable: true, mode: "grab" } } }
    });
}

function sendWhatsAppOrder() {
    if(!STATE.cart.length) return alert("Empty Cart");
    let msg = "*ORDER ARCHIVE - OASIS*%0A%0A";
    STATE.cart.forEach(i => msg += `• ${i.name} (x${i.qty})%0A`);
    window.open(`https://wa.me/923001234567?text=${msg}`);
}
