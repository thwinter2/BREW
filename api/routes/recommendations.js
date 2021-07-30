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

router.route('/byOthersTastes').post(async (req, res) => {
  console.log('In /byOthersTastes');
  let beers = req.body.beers;
  let userPreferences = req.body.preferences;

  try {
    for (var i = 0; i < beers.length; i++) {
      var beer = beers[i];
      console.log("Current beer: " + beer.name);
      beers[i].isRecommended = false;

      if (!beer.liked_by || beer.liked_by.length == 0) continue;

      for (var j = 0; j < beer.liked_by.length; j++) {
        var liked_by = beer.liked_by[j];
        console.log(liked_by);
        var user = await User.findOne({ 'email': liked_by }).exec()
        if (!user) return;

        var common = userPreferences.styles.filter(x => user.preferences.styles.indexOf(x) !== -1);
        if (common.length > 0 && userPreferences.styles.includes(beer.style_id)) {
          beers[i].isRecommended = true;
          break;
        }
      }
    }

    res.json(beers);
  }
  catch (err) {
    console.log(err);
    res.status(400).json('Recommndations Error: ' + err);
  }
});

module.exports = router;
