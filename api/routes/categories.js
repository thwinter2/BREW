const router = require('express').Router();
const mongoose = require("mongoose");
const Category = mongoose.model("categories");

router.route('/styles').get((req, res) => {
  Category.find()
    .then(categories => res.json(categories))
    .catch(err => res.status(400).json('Categories Error: ' + err));
});

module.exports = router;