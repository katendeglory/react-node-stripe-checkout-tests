require('dotenv').config();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/charge", require('./routes/charge'));
app.use("/checkout", require('./routes/checkout'));
app.use("/articles", require('./routes/articles'));

const port = process.env.PORT || 5000;
app.listen(port);