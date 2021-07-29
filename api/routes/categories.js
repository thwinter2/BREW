const router = require('express').Router();
const { response } = require('express');
const {Category} = require('../models/Category');

router.route('/').get((req, res) => {
  Category.find()
    .then(categories => res.json(categories))
    .catch(err => res.status(400).json('Categories Error: ' + err));
});

router.route('/preferences').post((req, res) => {
  const userCategoryPreferences = req.body;
  Category.find()
    .where('id').in(userCategoryPreferences)
    .then(categories => res.json(categories))
    .catch(err => res.status(400).json('Category Current Preferences Error: ' + err));
});

module.exports = router;