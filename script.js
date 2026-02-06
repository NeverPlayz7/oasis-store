// Initialize Particles.js
particlesJS("particles-js", {
    particles: {
        number: { value: 80, density: { enable: true, value_area: 800 } },
        color: { value: "#00f2ff" },
        shape: { type: "circle" },
        opacity: { value: 0.2, random: true },
        size: { value: 2, random: true },
        line_linked: { enable: true, distance: 150, color: "#00f2ff", opacity: 0.1, width: 1 },
        move: { enable: true, speed: 1.5, direction: "none", random: true, out_mode: "out" }
    },
    interactivity: {
        detect_on: "canvas",
        events: { onhover: { enable: true, mode: "grab" }, onclick: { enable: true, mode: "push" } }
    }
});

// Advanced Product List
let products = [
    { id: 1, name: "Neon Sneakers", price: 189, img: "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=400" },
    { id: 2, name: "Cypher Watch", price: 340, img: "https://images.unsplash.com/photo-1508685096489-7aac291bd5b3?w=400" },
    { id: 3, name: "Void Headset", price: 210, img: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400" },
    { id: 4, name: "Ghost Hoodie", price: 85, img: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=400" }
];

function renderProducts() {
    const grid = document.getElementById('product-grid');
    grid.innerHTML = products.map(p => `
        <div class="product-card group">
            <div class="img-container">
                <img src="${p.img}" class="w-full h-64 object-cover">
                <div class="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                    <button class="text-white text-xs font-bold uppercase tracking-widest">View Details</button>
                </div>
            </div>
            <div class="p-6">
                <div class="flex justify-between items-start mb-2">
                    <h3 class="font-bold text-xl group-hover:text-cyan-400 transition-colors">${p.name}</h3>
                    <span class="text-cyan-400 font-black">$${p.price}</span>
                </div>
                <div class="flex gap-3 mt-6">
                    <button onclick="addToCart(${p.id})" class="flex-1 bg-white text-black font-black py-3 rounded-lg hover:bg-cyan-400 transition-all active:scale-95">
                        <i class="fa-solid fa-plus mr-2"></i> ADD TO CART
                    </button>
                </div>
            </div>
        </div>
    `).join('');
}

renderProducts();
