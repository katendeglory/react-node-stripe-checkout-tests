const Router = require('express').Router();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

Router.post("/", (req, res) => {
  const { articleId, tokenId } = req.body;

  console.log("Request data:");
  console.log({ articleId, tokenId });
  console.log("\n\n");

  const article = require('../data/articles').find(({ id }) => id == articleId);

  if (!article) res.status(404).send({ error: "Article not found" });

  else stripe.charges
    .create({
      amount: article.price * 100,
      currency: 'usd',
      source: tokenId,
      description: `Payment for the following article: ${article.title}`,
    })
    .then(result => {
      console.log(`Payment successfull: ${result}`);
      res.send(result);
    })
    .catch(err => {
      console.log(`Payment failed: ${err.message}`);
      res.status(404).send({ message: "Payment failed 😟", error: err.message });
    });
});

module.exports = Router;