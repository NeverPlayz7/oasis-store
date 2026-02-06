// 1. Particles Configuration
particlesJS("particles-js", {
    particles: {
        number: { value: 60, density: { enable: true, value_area: 800 } },
        color: { value: "#00f2ff" },
        opacity: { value: 0.3, random: true },
        size: { value: 2, random: true },
        line_linked: { enable: true, distance: 150, color: "#00f2ff", opacity: 0.1, width: 1 },
        move: { enable: true, speed: 2, direction: "none", random: true, out_mode: "out" }
    },
    interactivity: {
        detect_on: "canvas",
        events: { onhover: { enable: true, mode: "grab" }, onclick: { enable: true, mode: "push" } }
    }
});

// 2. Data State
let products = [
    { id: 1, name: "Neon Sneakers V1", price: 189, img: "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=400" },
    { id: 2, name: "Cipher Smart Watch", price: 340, img: "https://images.unsplash.com/photo-1508685096489-7aac291bd5b3?w=400" },
    { id: 3, name: "Void Pro Headset", price: 210, img: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400" },
    { id: 4, name: "Ghost Tech Hoodie", price: 85, img: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=400" }
];

let cart = [];
let wishlist = new Set();

// 3. Render Products
function renderProducts(data = products) {
    const grid = document.getElementById('product-grid');
    grid.innerHTML = data.map(p => `
        <div class="product-card group">
            <div class="img-container">
                <img src="${p.img}">
                <button onclick="toggleLike(${p.id}, this)" class="absolute top-3 right-3 text-white/30 text-xl transition-all ${wishlist.has(p.id) ? 'liked' : ''}">
                    <i class="fa-solid fa-heart"></i>
                </button>
            </div>
            <div class="p-4">
                <h3 class="font-bold text-lg mb-1">${p.name}</h3>
                <p class="text-cyan-400 font-black mb-4">$${p.price}</p>
                <button onclick="addToCart(${p.id})" class="w-full bg-white/5 border border-white/10 py-2.5 rounded-xl hover:bg-cyan-500 hover:text-black transition-all font-bold">
                    ADD TO CART
                </button>
            </div>
        </div>
    `).join('');
}

// 4. Search
function searchProducts() {
    const query = document.getElementById('searchInput').value.toLowerCase();
    const filtered = products.filter(p => p.name.toLowerCase().includes(query));
    renderProducts(filtered);
}

// 5. Cart Logic
function addToCart(id) {
    const item = products.find(p => p.id === id);
    cart.push({ ...item, cartId: Date.now() });
    updateUI();
    toggleCart(true); // Open cart automatically
}

function removeFromCart(cartId) {
    cart = cart.filter(item => item.cartId !== cartId);
    updateUI();
}

function updateUI() {
    // Update Badge
    document.getElementById('cart-count').innerText = cart.length;
    document.getElementById('wish-count').innerText = wishlist.size;

    // Render Cart Items
    const container = document.getElementById('cart-items-container');
    let total = 0;
    container.innerHTML = cart.map(item => {
        total += item.price;
        return `
            <div class="flex items-center gap-4 bg-white/5 p-3 rounded-2xl">
                <img src="${item.img}" class="w-16 h-16 object-cover rounded-xl">
                <div class="flex-1">
                    <h4 class="text-sm font-bold truncate w-32">${item.name}</h4>
                    <p class="text-cyan-400 text-xs">$${item.price}</p>
                </div>
                <button onclick="removeFromCart(${item.cartId})" class="text-gray-500 hover:text-red-500"><i class="fa-solid fa-trash"></i></button>
            </div>
        `;
    }).join('');
    document.getElementById('cart-total').innerText = `$${total.toFixed(2)}`;
}

// 6. Helpers
function toggleLike(id, btn) {
    wishlist.has(id) ? wishlist.delete(id) : wishlist.add(id);
    btn.classList.toggle('liked');
    document.getElementById('wish-count').innerText = wishlist.size;
}

function toggleCart(forceOpen = false) {
    const sidebar = document.getElementById('cartSidebar');
    forceOpen ? sidebar.classList.add('cart-open') : sidebar.classList.toggle('cart-open');
}

function toggleModal(id) {
    document.getElementById(id).classList.toggle('hidden');
}

function adminAddProduct() {
    const name = document.getElementById('pName').value;
    const price = Number(document.getElementById('pPrice').value);
    const img = document.getElementById('pImage').value || 'https://via.placeholder.com/400';

    if (name && price) {
        products.unshift({ id: Date.now(), name, price, img });
        renderProducts();
        toggleModal('adminModal');
        // Clear inputs
        document.getElementById('pName').value = '';
        document.getElementById('pPrice').value = '';
        document.getElementById('pImage').value = '';
    }
}

function checkout() {
    if (cart.length === 0) return alert("Cart is empty!");
    alert("Redirecting to Secure Gateway...");
}

// Start
renderProducts();
