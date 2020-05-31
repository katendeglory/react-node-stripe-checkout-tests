import React from 'react';
import { loadStripe } from '@stripe/stripe-js';
import axios from 'axios';

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY);

const NewStripeButton = () => {

  const [loading, setLoading] = React.useState(false);

  const handleClick = async e => {
    setLoading(true);

    const { data: { id } } = await axios.post("http://localhost:5000/checkout/create-session", {
      articleId: 3, quantity: 2
    });

    const stripe = await stripePromise;
    const { error } = await stripe.redirectToCheckout({ sessionId: id });
    if (error) alert(error.message);

    setLoading(false);
  };

  return (
    <button role="link" onClick={handleClick} disabled={loading}>{loading ? "Loading" : "Checkout"}</button>
  );
}

export default NewStripeButton;