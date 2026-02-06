function checkout(){
  fetch("http://localhost:4242/checkout",{
    method:"POST"
  })
  .then(res=>res.json())
  .then(data=>{
    window.location = data.url;
  })
  .catch(err=>{
    alert("Stripe server not running");
  });
}
