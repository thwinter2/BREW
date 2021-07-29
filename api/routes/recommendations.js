var express = require('express');
const router = express.Router();
const Beer = require('../models/Beer');
const Style = require('../models/Style');
const Category = require('../models/Category');
const User = require('../models/User');
const { replaceOne } = require('../models/User');
const Brewery = require('../models/Brewery');

router.route('/byPreferences').post((req, res) => {
  const { preferences } = req.body;
  const userStylePreferences = preferences.styles
  Beer.find()
    .where('style_id').in(userStylePreferences)
    .then(beers => res.json(beers))
    .catch(err => res.status(400).json('Recommndations Error: ' + err));
});

router.route('/byOthers').post((req, res) => {
  const { selectBrew } = req.body;
  const zipcodes = selectBrew.address.match(/\b\d{5}(-\d{4})?\b/g);

  Brewery.find({ 'code': zipcodes ? zipcodes[0] : [] }, 'id', function (err, breweryIds) {
    if (err) return handleError(err);
    ids = []
    breweryIds.filter(brewery => ids.push(brewery.id))
    Beer.find()
    .where('brewery_id').in(ids)
    .then(beers => res.json(beers.filter(beer => beer.liked_by.length > 0)))
    .catch(err => res.status(400).json('Recommndations Error: ' + err));
  })
});

module.exports = router;
