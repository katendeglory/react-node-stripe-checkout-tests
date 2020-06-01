const express = require('express');
const router = express.Router();
const stripe = require('../utils/stripe');

router.post('/stripe', express.raw({ type: 'application/json' }), (req, res) => {
  const signature = req.headers['stripe-signature'];
  let endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;
  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, signature, endpointSecret);
  } catch (err) {
    return res.status(400).send(`😞 Webhook Error: ${err.message}`);
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    //Make things happen here...
    console.log("🔔 Payment Successfull");
    res.json({ received: true, message: "🔔 Payment Successfull", session });
  }
  else {
    console.log("🔔 Payment Failed");
    res.json({ received: false, message: "🔔 Payment Failed", session });
  }
});

module.exports = router;