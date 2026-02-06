// State & Mock Data
const products = [
    { id: 1, name: "ORACLE RUNNER V1", price: 299, cat: "FOOTWEAR", desc: "Equipped with graviton suspension and bioluminescent mesh. Designed for night-runners of the future.", specs: ["Liquid-gel sole", "Carbon-fiber frame", "Neural lace sync"], img: "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=800" },
    { id: 2, name: "NEURAL WATCH O1", price: 540, cat: "GADGETS", desc: "Direct synaptic connection monitor. Tracks your physiological state with nano-precision.", specs: ["OLED 5.0 Display", "20-Day Battery", "Mind-Sync Tech"], img: "https://images.unsplash.com/photo-1508685096489-7aac291bd5b3?w=800" }
];

let cart = [];

// 1. Auth Logic (Next Level Aesthetic Flow)
function toggleAuth() {
    const l = document.getElementById('loginForm');
    const r = document.getElementById('registerForm');
    l.classList.toggle('hidden');
    r.classList.toggle('hidden');
}

function bypassAuth() {
    const auth = document.getElementById('authScreen');
    const app = document.getElementById('mainApp');
    
    auth.style.transition = '1s ease';
    auth.style.opacity = '0';
    auth.style.transform = 'scale(1.1)';
    
    setTimeout(() => {
        auth.classList.add('hidden');
        app.classList.remove('hidden');
        renderProducts();
        initAppParticles();
    }, 1000);
}

function logout() { location.reload(); }

// 2. Immersive Detail Logic
function openDetail(id) {
    const p = products.find(prod => prod.id === id);
    const content = document.getElementById('detailContent');
    
    content.innerHTML = `
        <p class="text-cyan-500 font-black tracking-[4px] text-[10px] mb-2 uppercase">${p.cat}</p>
        <h2 class="text-5xl font-black mb-6 tracking-tighter">${p.name}</h2>
        <img src="${p.img}" class="detail-img">
        <p class="text-gray-400 leading-relaxed mb-10 text-lg">${p.desc}</p>
        <div class="grid grid-cols-1 gap-4 mb-10">
            ${p.specs.map(s => `<div class="bg-white/5 p-4 rounded-xl border-l-2 border-cyan-500 text-xs font-bold">${s}</div>`).join('')}
        </div>
        <div class="flex items-center justify-between">
            <span class="text-3xl font-black">$${p.price}</span>
            <button onclick="addToCart(${p.id}); closeDetail();" class="bg-white text-black px-10 py-5 rounded-2xl font-black text-xs hover:bg-cyan-500 transition-all">SECURE ARCHIVE</button>
        </div>
    `;

    const panel = document.getElementById('detailPanel');
    const overlay = document.getElementById('detailOverlay');
    const container = document.getElementById('productDetail');
    
    container.classList.remove('pointer-events-none');
    overlay.classList.replace('opacity-0', 'opacity-100');
    panel.classList.replace('translate-x-full', 'translate-x-0');
}

function closeDetail() {
    const panel = document.getElementById('detailPanel');
    const overlay = document.getElementById('detailOverlay');
    const container = document.getElementById('productDetail');
    
    panel.classList.replace('translate-x-0', 'translate-x-full');
    overlay.classList.replace('opacity-100', 'opacity-0');
    setTimeout(() => container.classList.add('pointer-events-none'), 500);
}

// 3. Rendering
function renderProducts() {
    const grid = document.getElementById('product-grid');
    grid.innerHTML = products.map(p => `
        <div class="product-card group" onclick="openDetail(${p.id})">
            <div class="img-container mb-6">
                <img src="${p.img}">
            </div>
            <div class="flex justify-between items-end">
                <div>
                    <h3 class="font-bold text-gray-300 text-lg">${p.name}</h3>
                    <p class="text-cyan-400 font-black text-xl mt-2">$${p.price}</p>
                </div>
                <div class="text-[10px] font-black text-gray-600 tracking-widest uppercase">Details &rarr;</div>
            </div>
        </div>
    `).join('');
}

// Initial Particles for Login
function initAppParticles() {
    particlesJS("particles-js", {
        particles: {
            number: { value: 60 },
            color: { value: "#00f2ff" },
            opacity: { value: 0.1 },
            move: { speed: 1.5 }
        }
    });
}
