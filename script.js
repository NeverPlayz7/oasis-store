let products = JSON.parse(localStorage.getItem("products")) || [
  {name:"Demo Product",price:999,img:"images/demo.png"}
];

let cart=[], total=0;
const phone="923XXXXXXXXX";

const box=document.getElementById("products");
products.forEach(p=>{
  box.innerHTML+=`
  <div class="card">
    <img src="${p.img}">
    <h3>${p.name}</h3>
    <p>Rs ${p.price}</p>
    <button onclick="add('${p.name}',${p.price})">Add</button>
  </div>`;
});

function add(n,p){
  cart.push(`${n} Rs${p}`);
  total+=p;
  document.getElementById("cart").innerHTML+=`<li>${n}</li>`;
  document.getElementById("total").innerText=total;
  document.getElementById("waBtn").href=
  `https://wa.me/${phone}?text=Order:%0A${cart.join("%0A")}%0ATotal:${total}`;
}

function toggleTheme(){
  document.body.classList.toggle("light");
}
