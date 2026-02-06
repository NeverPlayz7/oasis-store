let cart = [];
let wishlist = new Set(); // Using Set for unique likes

// 1. Search System
function searchProducts() {
    let input = document.getElementById('searchInput').value.toLowerCase();
    let filtered = products.filter(p => p.name.toLowerCase().includes(input));
    renderProducts(filtered);
}

// 2. Dynamic Rendering with Like Status
function renderProducts(productsToDisplay = products) {
    const grid = document.getElementById('product-grid');
    grid.innerHTML = productsToDisplay.map(p => `
        <div class="product-card group">
            <div class="img-container">
                <img src="${p.img}" class="w-full h-64 object-cover">
                <button onclick="toggleLike(${p.id}, this)" class="absolute top-4 right-4 text-white/50 text-xl transition-all ${wishlist.has(p.id) ? 'liked' : ''}">
                    <i class="fa-solid fa-heart"></i>
                </button>
            </div>
            <div class="p-6">
                <h3 class="font-bold text-xl">${p.name}</h3>
                <p class="text-cyan-400 font-black mb-4">$${p.price}</p>
                <button onclick="addToCart(${p.id})" class="w-full bg-white/5 border border-white/20 py-2 rounded-lg group-hover:bg-cyan-500 group-hover:text-black transition-all">
                    ADD TO CART
                </button>
            </div>
        </div>
    `).join('');
}

// 3. Like System
function toggleLike(id, btn) {
    if (wishlist.has(id)) {
        wishlist.delete(id);
        btn.classList.remove('liked');
    } else {
        wishlist.add(id);
        btn.classList.add('liked');
    }
    document.getElementById('wish-count').innerText = wishlist.size;
}

// 4. Advanced Cart System
function addToCart(id) {
    const product = products.find(p => p.id === id);
    cart.push({ ...product, cartId: Date.now() }); // Unique ID for each entry
    updateCartUI();
    if (!document.getElementById('cartSidebar').classList.contains('cart-open')) {
        toggleCart(); // Auto open cart on add
    }
}

function removeFromCart(cartId) {
    cart = cart.filter(item => item.cartId !== cartId);
    updateCartUI();
}

function updateCartUI() {
    const container = document.getElementById('cart-items-container');
    const totalEl = document.getElementById('cart-total');
    const countEl = document.getElementById('cart-count');

    countEl.innerText = cart.length;
    
    let total = 0;
    container.innerHTML = cart.map(item => {
        total += item.price;
        return `
            <div class="cart-item">
                <img src="${item.img}" class="w-16 h-16 object-cover rounded-lg">
                <div class="flex-1">
                    <h4 class="text-sm font-bold">${item.name}</h4>
                    <p class="text-cyan-400 text-xs">$${item.price}</p>
                </div>
                <button onclick="removeFromCart(${item.cartId})" class="text-gray-500 hover:text-red-500">
                    <i class="fa-solid fa-trash-can"></i>
                </button>
            </div>
        `;
    }).join('');

    totalEl.innerText = `$${total.toFixed(2)}`;
}

// UI Helpers
function toggleCart() {
    document.getElementById('cartSidebar').classList.toggle('cart-open');
}

function toggleModal(id) {
    document.getElementById(id).classList.toggle('hidden');
}

// Initialize
renderProducts();
