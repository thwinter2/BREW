var express = require('express');
const router = express.Router();
const Beer = require('../models/Beer');
const Style = require('../models/Style');
const Category = require('../models/Category');
const User = require('../models/User');
const { replaceOne } = require('../models/User');

router.route('/byPreferences').post((req, res) => {
  const { preferences } = req.body;
  const userStylePreferences = preferences.styles
  Beer.find()
    .where('style_id').in(userStylePreferences)
    .then(beers => res.json(beers))
    .catch(err => res.status(400).json('Recommndations Error: ' + err));
});

module.exports = router;
