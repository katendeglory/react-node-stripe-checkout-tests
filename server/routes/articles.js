const Router = require('express').Router();
const Fuse = require('fuse.js');

Router.get("/", (req, res) => res.send(require("../data/articles")));

Router.get("/:id", (req, res) => res.send(require("../data/articles").filter(({ id }) => id == req.params.id)));

Router.get("/search/:searchkey", (req, res) => {
  const fuse = new Fuse(require("../data/articles"), { keys: ['type', 'title'] })
  res.send(fuse.search(req.params.searchkey));
});

module.exports = Router;