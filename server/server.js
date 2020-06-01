require('dotenv').config();
require('./utils/stripe');

const express = require('express');
const app = express();
const cors = require('cors');

app.use(cors());

/* To avoid the corruption of the webhook signature by the parser, use it above the express.json() middleware */
app.use("/webhook", require('./routes/webhook'));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => res.send("Welcome to my lovely site 😀"));
app.use("/charge", require('./routes/charge'));
app.use("/checkout", require('./routes/checkout'));
app.use("/articles", require('./routes/articles'));

const port = process.env.PORT || 5000;
app.listen(port);

// git commit -am "Initial commit" && git push heroku master