const router = require('express').Router();
// const mongoose = require("mongoose");
const {Category} = require('../models/Category');

router.route('/').get((req, res) => {
  Category.find()
    .then(categories => res.json(categories))
    .catch(err => res.status(400).json('Categories Error: ' + err));
});

module.exports = router;