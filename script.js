let total = 0;
let cartItems = [];

function addToCart(product, price) {
  document.getElementById("clickSound").play();

  cartItems.push({ product, price });

  const list = document.getElementById("cart-list");
  const item = document.createElement("li");
  item.textContent = product + " - Rs " + price;
  list.appendChild(item);

  total += price;
  document.getElementById("total").innerText = total;
}

function checkout() {
  if (cartItems.length === 0) {
    alert("Cart is empty!");
    return;
  }

  let message = "🔥 *New Order* 🔥%0A%0A";
  cartItems.forEach((item, i) => {
    message += `${i + 1}. ${item.product} - Rs ${item.price}%0A`;
  });
  message += `%0A*Total:* Rs ${total}`;

  // 👇 CHANGE THIS NUMBER TO YOUR WHATSAPP
  const phone = "923XXXXXXXXX";

  window.open(`https://wa.me/${phone}?text=${message}`, "_blank");
}

/* PARTICLES */
const canvas = document.getElementById("particles");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let particles = Array.from({ length: 90 }, () => ({
  x: Math.random() * canvas.width,
  y: Math.random() * canvas.height,
  r: Math.random() * 2 + 1,
  dx: Math.random() - 0.5,
  dy: Math.random() - 0.5
}));

function animateParticles() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  particles.forEach(p => {
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
    ctx.fillStyle = "rgba(0,255,180,0.7)";
    ctx.fill();

    p.x += p.dx;
    p.y += p.dy;

    if (p.x < 0 || p.x > canvas.width) p.dx *= -1;
    if (p.y < 0 || p.y > canvas.height) p.dy *= -1;
  });

  requestAnimationFrame(animateParticles);
}

animateParticles();
