const router = require('express').Router();
const stripe = require('../utils/stripe');

router.post("/create-session", async (req, res) => {

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
    client_reference_id: "theosassler@star.labs.com",
    payment_method_types: ['card'],
    line_items: [{
      price: price.id,
      quantity
    }],
    mode: 'payment',
    success_url: `https://still-journey-20024.herokuapp.com/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: 'https://still-journey-20024.herokuapp.com/checkout/cancel',
  });

  res.send(session);
});

router.get("/cancel", (req, res) => {
  res.send({ message: "Transaction cancelled" });
});

router.get("/success", (req, res) => {
  stripe.checkout.sessions.retrieve(
    req.query.session_id,
    (err, session) => {
      if (err) res.send(err);
      res.send(session);
    }
  );
});

module.exports = router;