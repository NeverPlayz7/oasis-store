if(localStorage.getItem("admin")!=="true"){
  location.href="login.html";
}

function addProduct(){
  let data=JSON.parse(localStorage.getItem("products"))||[];
  data.push({
    name:name.value,
    price:+price.value,
    img:img.value
  });
  localStorage.setItem("products",JSON.stringify(data));
  alert("Product added");
  location.reload();
}
