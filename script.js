// Initial Products Data
let products = [
    { id: 1, name: "Cool Sneakers", price: 120, img: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400" },
    { id: 2, name: "Smart Watch", price: 250, img: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400" }
];

let cart = [];
let wishlist = [];

// Display Products
function renderProducts() {
    const grid = document.getElementById('product-grid');
    grid.innerHTML = products.map(p => `
        <div class="product-card p-4 rounded-xl relative group">
            <img src="${p.img}" class="w-full h-48 object-cover rounded-lg mb-4">
            <h3 class="font-bold text-lg">${p.name}</h3>
            <p class="text-cyan-400 font-bold">$${p.price}</p>
            <div class="mt-4 flex gap-2">
                <button onclick="addToCart(${p.id})" class="flex-1 bg-cyan-500 text-black font-bold py-2 rounded hover:bg-cyan-400">Add to Cart</button>
                <button onclick="addToWish(${p.id})" class="p-2 border border-gray-600 rounded hover:bg-gray-800 text-red-500"><i class="fas fa-heart"></i></button>
            </div>
        </div>
    `).join('');
}

// Modal Toggle
function toggleModal(id) {
    document.getElementById(id).classList.toggle('hidden');
}

// Cart Logic
function addToCart(id) {
    const product = products.find(p => p.id === id);
    cart.push(product);
    updateCounters();
    alert(product.name + " added to cart!");
}

function addToWish(id) {
    wishlist.push(id);
    updateCounters();
}

function updateCounters() {
    document.getElementById('cart-count').innerText = cart.length;
    document.getElementById('wish-count').innerText = wishlist.length;
    
    // Update Cart Modal List
    const cartList = document.getElementById('cart-items');
    cartList.innerHTML = cart.map(item => `<div class="flex justify-between py-2 border-b border-gray-800"><span>${item.name}</span><span>$${item.price}</span></div>`).join('');
}

// Admin Logic
function adminAddProduct() {
    const name = document.getElementById('pName').value;
    const price = document.getElementById('pPrice').value;
    const img = document.getElementById('pImage').value || 'https://via.placeholder.com/400';

    if(name && price) {
        const newProduct = { id: Date.now(), name, price, img };
        products.push(newProduct);
        renderProducts();
        toggleModal('adminModal');
        alert("Product Added Successfully!");
    }
}

// Checkout Placeholder
function checkout(method) {
    alert(`Redirecting to ${method} Gateway... Total: $${cart.reduce((s, i) => s + Number(i.price), 0)}`);
}

// Init
renderProducts();
