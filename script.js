let products = [
    { id: 1, name: "Neon Sneakers", price: 189, cat: "Footwear", img: "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=600" },
    { id: 2, name: "Cipher Watch", price: 340, cat: "Gadgets", img: "https://images.unsplash.com/photo-1508685096489-7aac291bd5b3?w=600" },
    { id: 3, name: "Ghost Hoodie", price: 85, cat: "Apparel", img: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=600" },
    { id: 4, name: "Void Headset", price: 210, cat: "Gadgets", img: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600" }
];

let cart = [];
let currentCategory = 'All';
let detailProduct = null;

// 1. Theme Toggle
function toggleTheme() {
    document.body.classList.toggle('light-mode');
    const icon = document.querySelector('#themeBtn i');
    icon.className = document.body.classList.contains('light-mode') ? 'fa-solid fa-sun' : 'fa-solid fa-moon';
}

// 2. WhatsApp Ordering System
function sendWhatsAppOrder() {
    if(cart.length === 0) return alert("Cart is empty!");
    let phone = "923001234567"; // Apna number yahan dalein
    let message = "New Order from Oasis Store:%0A%0A";
    let total = 0;
    
    cart.forEach(item => {
        message += `- ${item.name} ($${item.price})%0A`;
        total += item.price;
    });
    
    message += `%0A*Total Amount: $${total}*%0APlease confirm my order.`;
    window.open(`https://wa.me/${phone}?text=${message}`, '_blank');
}

// 3. Product Detail Modal
function openDetail(id) {
    detailProduct = products.find(p => p.id === id);
    document.getElementById('detailImg').src = detailProduct.img;
    document.getElementById('detailTitle').innerText = detailProduct.name;
    document.getElementById('detailCat').innerText = detailProduct.cat;
    document.getElementById('detailPrice').innerText = `$${detailProduct.price}`;
    toggleModal('detailModal');
}

function addToCartFromDetail() {
    if(detailProduct) addToCart(detailProduct.id);
    toggleModal('detailModal');
}

// 4. Categories Filter
function filterCategory(cat) {
    currentCategory = cat;
    document.querySelectorAll('.cat-btn').forEach(btn => {
        btn.classList.toggle('active', btn.innerText === cat);
    });
    const filtered = cat === 'All' ? products : products.filter(p => p.cat === cat);
    renderProducts(filtered);
}

// 5. Core Render
function renderProducts(data = products) {
    const grid = document.getElementById('product-grid');
    grid.innerHTML = data.map(p => `
        <div class="product-card group" onclick="openDetail(${p.id})">
            <div class="img-container mb-4">
                <img src="${p.img}" class="w-full h-full object-cover rounded-2xl">
            </div>
            <div class="flex justify-between items-center">
                <div>
                    <h3 class="font-bold text-lg">${p.name}</h3>
                    <p class="text-cyan-400 text-sm">$${p.price}</p>
                </div>
                <button onclick="event.stopPropagation(); addToCart(${p.id})" class="icon-btn hover:bg-cyan-500"><i class="fa-solid fa-plus"></i></button>
            </div>
        </div>
    `).join('');
}

// Initial Call
renderProducts();

// ... [Existing Cart & Modal functions from previous responses] ...
