import React from 'react';
import axios from 'axios';
import StripeCheckout from 'react-stripe-checkout';

const StripeButton = () => {

  const handleToken = token => {
    axios
      .post("http://localhost:5000/charge", { tokenId: token.id, articleId: 1 })
      .then(res => {
        alert(`Transaction successful`);
        console.log(res.data);
      })
      .catch(err => {
        console.log(err);
        alert(`Error : ${err.message}`);
      });
  }

  return (
    <StripeCheckout
      token={handleToken}
      amount={1000}
      currency="USD"
      stripeKey={process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY}
    />
  );
}

export default StripeButton;