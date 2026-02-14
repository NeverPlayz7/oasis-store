<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Oasis Ultra Admin</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css">
</head>
<body class="bg-gray-100 font-sans">

    <div class="flex h-screen">
        <div class="w-64 bg-black text-white p-6">
            <h1 class="text-2xl font-bold mb-10">OASIS ADMIN</h1>
            <nav class="space-y-4">
                <button onclick="showTab('add-product')" class="block w-full text-left p-3 rounded hover:bg-gray-800"><i class="fa fa-plus-circle mr-2"></i> Add Product</button>
                <button onclick="showTab('view-orders')" class="block w-full text-left p-3 rounded hover:bg-gray-800"><i class="fa fa-shopping-cart mr-2"></i> View Orders</button>
                <button onclick="showTab('inventory')" class="block w-full text-left p-3 rounded hover:bg-gray-800"><i class="fa fa-box mr-2"></i> Inventory</button>
            </nav>
        </div>

        <div class="flex-1 p-10 overflow-y-auto">
            <div id="status" class="mb-4 font-bold"></div>

            <div id="add-product" class="tab-content bg-white p-8 rounded-xl shadow-lg max-w-lg">
                <h2 class="text-xl font-bold mb-6 text-gray-800">Add New Item</h2>
                <input type="text" id="p-name" placeholder="Product Name" class="w-full p-3 border rounded mb-4">
                <input type="number" id="p-price" placeholder="Price (PKR)" class="w-full p-3 border rounded mb-4">
                <input type="text" id="p-image" placeholder="Image URL (e.g. https://...)" class="w-full p-3 border rounded mb-6">
                <button onclick="handleGitHub('products', 'data.json')" class="w-full bg-green-600 text-white py-3 rounded-lg font-bold hover:bg-green-700">Push to Store</button>
            </div>

            <div id="view-orders" class="tab-content hidden">
                <h2 class="text-2xl font-bold mb-6">Customer Orders</h2>
                <div id="orders-list" class="grid gap-4">
                    <p class="text-gray-500">No orders yet.</p>
                </div>
            </div>

            <div id="inventory" class="tab-content hidden">
                <h2 class="text-2xl font-bold mb-6">Current Inventory</h2>
                <div id="inventory-list" class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    </div>
            </div>
        </div>
    </div>

<script>
    // ⚠️ UPDATE THESE
    const GITHUB_TOKEN = "YOUR_TOKEN_HERE"; 
    const REPO = "NeverPlayz7/oasis-frontend";

    function showTab(tabId) {
        document.querySelectorAll('.tab-content').forEach(t => t.classList.add('hidden'));
        document.getElementById(tabId).classList.remove('hidden');
        if(tabId === 'inventory') loadInventory();
        if(tabId === 'view-orders') loadOrders();
    }

    async function handleGitHub(type, fileName) {
        const name = document.getElementById('p-name').value;
        const price = document.getElementById('p-price').value;
        const image = document.getElementById('p-image').value;
        const status = document.getElementById('status');

        status.innerHTML = "⏳ Updating GitHub...";

        try {
            const res = await fetch(`https://api.github.com/repos/${REPO}/contents/${fileName}`, {
                headers: { "Authorization": `token ${GITHUB_TOKEN}` }
            });
            const data = await res.json();
            const currentContent = JSON.parse(atob(data.content));

            const newItem = { id: Date.now(), name, price, image, date: new Date().toLocaleDateString() };
            currentContent.push(newItem);

            const update = await fetch(`https://api.github.com/repos/${REPO}/contents/${fileName}`, {
                method: "PUT",
                headers: { "Authorization": `token ${GITHUB_TOKEN}`, "Content-Type": "application/json" },
                body: JSON.stringify({
                    message: `Admin update: ${name}`,
                    content: btoa(JSON.stringify(currentContent, null, 2)),
                    sha: data.sha
                })
            });

            if(update.ok) {
                status.innerHTML = "✅ Successfully Updated!";
                status.className = "text-green-600 mb-4 font-bold";
            }
        } catch (e) {
            status.innerHTML = "❌ Error: " + e.message;
            status.className = "text-red-600 mb-4 font-bold";
        }
    }

    async function loadInventory() {
        const res = await fetch(`https://raw.githubusercontent.com/${REPO}/main/data.json?t=${Date.now()}`);
        const products = await res.json();
        document.getElementById('inventory-list').innerHTML = products.map(p => `
            <div class="bg-white p-4 rounded shadow flex justify-between items-center">
                <div class="flex items-center gap-4">
                    <img src="${p.image}" class="w-12 h-12 object-cover rounded">
                    <div>
                        <p class="font-bold">${p.name}</p>
                        <p class="text-sm text-gray-500">Rs. ${p.price}</p>
                    </div>
                </div>
                <button class="text-red-500 hover:underline">Delete</button>
            </div>
        `).join('');
    }

    async function loadOrders() {
        const res = await fetch(`https://raw.githubusercontent.com/${REPO}/main/orders.json?t=${Date.now()}`);
        const orders = await res.json();
        document.getElementById('orders-list').innerHTML = orders.length ? orders.map(o => `
            <div class="bg-white p-6 rounded-lg shadow-sm border-l-4 border-green-500">
                <div class="flex justify-between">
                    <h3 class="font-bold text-lg">Order #${o.id}</h3>
                    <span class="text-gray-400 text-sm">${o.date}</span>
                </div>
                <p class="text-gray-700 mt-2"><b>Customer:</b> ${o.customerName} (${o.phone})</p>
                <p class="text-gray-700"><b>Product:</b> ${o.productName}</p>
                <p class="text-green-600 font-bold mt-2">Total: Rs. ${o.totalPrice}</p>
            </div>
        `).join('') : "No orders found.";
    }
</script>
</body>
</html>
