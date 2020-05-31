const Router = require('express').Router();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

Router.post("/create-session", async (req, res) => {

  const { articleId, quantity } = req.body;
  const article = require('../data/articles').find(({ id }) => id == articleId);

  if (!article) res.status(404).send({ message: "Article Not Found!" });

  const product = await stripe.products.create({ name: article.title });

  const price = await stripe.prices.create({
    product: product.id,
    unit_amount: article.price * 100,
    currency: 'usd',
  });

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: [{
      price: price.id,
      quantity
    }],
    mode: 'payment',
    success_url: `http://localhost:5000/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: 'http://localhost:5000/checkout/cancel',
  });

  res.send(session);
});


Router.get("/cancel", (req, res) => {
  res.send({ message: "Transaction cancelled" });
});

Router.get("/success", (req, res) => {
  stripe.checkout.sessions.retrieve(
    req.query.session_id,
    (err, session) => {
      if (err) res.send(err);
      res.send(session);
    }
  );
});

module.exports = Router;