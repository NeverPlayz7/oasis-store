// 1. Particle Background
particlesJS("particles-js", {
    particles: {
        number: { value: 60 },
        color: { value: "#00f2ff" },
        opacity: { value: 0.4 },
        size: { value: 2 },
        line_linked: { enable: true, color: "#00f2ff", opacity: 0.1 },
        move: { enable: true, speed: 1.5 }
    }
});

// 2. Initial Data
let products = [
    { id: 1, name: "Neon Sneakers", price: 189, img: "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=400" },
    { id: 2, name: "Cipher Watch", price: 340, img: "https://images.unsplash.com/photo-1508685096489-7aac291bd5b3?w=400" },
    { id: 3, name: "Void Headset", price: 210, img: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400" },
    { id: 4, name: "Ghost Hoodie", price: 85, img: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=400" }
];

let cart = [];
let wishlist = new Set();
const ADMIN_PASS = "admin123";

// 3. Core Functions
function renderProducts(data = products) {
    const grid = document.getElementById('product-grid');
    grid.innerHTML = data.map(p => `
        <div class="product-card">
            <div class="img-container">
                <img src="${p.img}">
                <button onclick="toggleLike(${p.id}, this)" class="absolute top-4 right-4 text-white/30 text-2xl ${wishlist.has(p.id) ? 'liked' : ''}">
                    <i class="fa-solid fa-heart"></i>
                </button>
            </div>
            <div class="p-6">
                <h3 class="font-bold text-xl mb-1">${p.name}</h3>
                <p class="text-cyan-400 font-bold mb-4">$${p.price}</p>
                <button onclick="addToCart(${p.id})" class="w-full bg-white/5 border border-white/10 py-3 rounded-xl hover:bg-cyan-500 hover:text-black transition-all font-bold">
                    ADD TO CART
                </button>
            </div>
        </div>
    `).join('');
}

// 4. Admin Auth Logic
function checkAdminPassword() {
    const pass = document.getElementById('adminPassword').value;
    if(pass === ADMIN_PASS) {
        document.getElementById('adminAuthSection').classList.add('hidden');
        document.getElementById('adminFormSection').classList.remove('hidden');
    } else {
        alert("Wrong Password!");
    }
}

function lockAdmin() {
    document.getElementById('adminAuthSection').classList.remove('hidden');
    document.getElementById('adminFormSection').classList.add('hidden');
    toggleModal('adminModal');
}

function adminAddProduct() {
    const name = document.getElementById('pName').value;
    const price = Number(document.getElementById('pPrice').value);
    const img = document.getElementById('pImage').value || 'https://via.placeholder.com/400';
    if(name && price) {
        products.unshift({ id: Date.now(), name, price, img });
        renderProducts();
        alert("Product Published!");
    }
}

// 5. Cart & Checkout
function addToCart(id) {
    cart.push({ ...products.find(p => p.id === id), cartId: Date.now() });
    updateUI();
    toggleCart(true);
}

function updateUI() {
    document.getElementById('cart-count').innerText = cart.length;
    document.getElementById('wish-count').innerText = wishlist.size;
    
    let total = 0;
    document.getElementById('cart-items-container').innerHTML = cart.map(item => {
        total += item.price;
        return `<div class="flex gap-4 bg-white/5 p-3 rounded-2xl">
                    <img src="${item.img}" class="w-16 h-16 object-cover rounded-xl">
                    <div class="flex-1"><h4>${item.name}</h4><p class="text-cyan-400 text-sm">$${item.price}</p></div>
                    <button onclick="removeFromCart(${item.cartId})" class="text-gray-500"><i class="fa-solid fa-trash"></i></button>
                </div>`;
    }).join('');
    document.getElementById('cart-total').innerText = `$${total.toFixed(2)}`;
}

function openCheckout() {
    if(cart.length === 0) return alert("Cart is empty!");
    toggleCart();
    document.getElementById('checkout-total-label').innerText = `Total Items: ${cart.length}`;
    document.getElementById('checkout-total-price').innerText = document.getElementById('cart-total').innerText;
    toggleModal('checkoutModal');
}

function processPayment() {
    alert("Payment Successful! Order Confirmed.");
    cart = [];
    updateUI();
    toggleModal('checkoutModal');
}

// Utility
function toggleModal(id) { document.getElementById(id).classList.toggle('hidden'); }
function toggleCart(force) { 
    const c = document.getElementById('cartSidebar');
    force ? c.classList.add('cart-open') : c.classList.toggle('cart-open');
}
function searchProducts() {
    const q = document.getElementById('searchInput').value.toLowerCase();
    renderProducts(products.filter(p => p.name.toLowerCase().includes(q)));
}
function toggleLike(id, btn) {
    wishlist.has(id) ? wishlist.delete(id) : wishlist.add(id);
    btn.classList.toggle('liked');
    document.getElementById('wish-count').innerText = wishlist.size;
}

renderProducts();
