const express = require("express");
const Stripe = require("stripe");
const app = express();
const stripe = Stripe("sk_test_YOUR_SECRET_KEY");

app.use(express.json());

app.post("/checkout", async (req,res)=>{
  const session = await stripe.checkout.sessions.create({
    payment_method_types:["card"],
    line_items:[{
      price_data:{
        currency:"usd",
        product_data:{name:"Oasis Order"},
        unit_amount:5000
      },
      quantity:1
    }],
    mode:"payment",
    success_url:"http://localhost:5500/index.html",
    cancel_url:"http://localhost:5500/index.html"
  });
  res.json({url:session.url});
});

app.listen(4242,()=>console.log("Stripe running"));
