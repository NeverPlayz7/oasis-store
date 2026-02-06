// Glitch Fix: State Management
let products = [
    { id: 1, name: "Neon Stealth One", price: 189, cat: "Footwear", img: "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=600" },
    { id: 2, name: "Cipher G-Series", price: 340, cat: "Gadgets", img: "https://images.unsplash.com/photo-1508685096489-7aac291bd5b3?w=600" },
    { id: 3, name: "Vantablack Hoodie", price: 95, cat: "Apparel", img: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=600" }
];

let cart = JSON.parse(localStorage.getItem('oasis_cart')) || [];

// Glitch Fix: Proper Rendering without duplicates
function renderProducts(data = products) {
    const grid = document.getElementById('product-grid');
    if(!grid) return;
    
    grid.innerHTML = data.map(p => `
        <div class="product-card group" onclick="openDetail(${p.id})">
            <div class="overflow-hidden rounded-2xl h-64 mb-4 relative">
                <img src="${p.img}" class="w-full h-full object-cover transition duration-700 group-hover:scale-110">
                <div class="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
                    <span class="text-xs font-bold tracking-widest bg-white text-black px-4 py-2 rounded-full">VIEW PRODUCT</span>
                </div>
            </div>
            <div class="flex justify-between items-start">
                <div>
                    <h3 class="font-bold text-gray-200">${p.name}</h3>
                    <p class="text-cyan-400 font-bold">$${p.price}</p>
                </div>
                <button onclick="event.stopPropagation(); addToCart(${p.id})" class="nav-icon hover:bg-cyan-500">
                    <i class="fa-solid fa-plus text-sm"></i>
                </button>
            </div>
        </div>
    `).join('');
    updateCartCount();
}

// Fixed Cart System with LocalStorage
function addToCart(id) {
    const p = products.find(prod => prod.id === id);
    cart.push({...p, cartId: Date.now()});
    saveCart();
    showToast(`${p.name} added to cart!`);
}

function saveCart() {
    localStorage.setItem('oasis_cart', JSON.stringify(cart));
    updateCartCount();
    renderCart();
}

function updateCartCount() {
    document.getElementById('cart-count').innerText = cart.length;
}

// Professional WhatsApp Order Logic
function sendWhatsAppOrder() {
    if(cart.length === 0) return alert("Your cart is empty!");
    const phone = "923001234567";
    let text = "*OASIS STORE - NEW ORDER*%0A--------------------------%0A";
    let total = 0;
    cart.forEach((item, i) => {
        text += `${i+1}. ${item.name} - $${item.price}%0A`;
        total += item.price;
    });
    text += `--------------------------%0A*Total: $${total}*%0A%0A_Please confirm my order._`;
    window.open(`https://wa.me/${phone}?text=${text}`);
}

// Error-free Toast Notification
function showToast(msg) {
    const toast = document.createElement('div');
    toast.className = "fixed bottom-10 left-10 bg-cyan-500 text-black px-6 py-3 rounded-full font-bold z-[1000] animate-bounce";
    toast.innerText = msg;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
}

// Glitch Fix: Modal Logic
function toggleModal(id) {
    const modal = document.getElementById(id);
    if(modal) modal.classList.toggle('hidden');
}

function toggleCart() {
    const sidebar = document.getElementById('cartSidebar');
    if(sidebar) sidebar.classList.toggle('active');
}

// Start
document.addEventListener('DOMContentLoaded', () => {
    renderProducts();
    // Particles JS init code here
});
