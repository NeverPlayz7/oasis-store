let products = JSON.parse(localStorage.getItem("products")) || [];

function addProduct(){
  products.push({
    name:name.value,
    price:price.value,
    img:img.value
  });
  localStorage.setItem("products",JSON.stringify(products));
  render();
}

function render(){
  list.innerHTML=products.map(p=>`<p>${p.name} - $${p.price}</p>`).join("");
}
render();
