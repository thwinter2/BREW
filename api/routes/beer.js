var express = require('express');
const router = express.Router();
const Beer = require('../models/Beer');

router.route('/').get((req, res) => {
  Beer.find()
    .where('brewery_id').equals(req.query.brewery_id)
    .then(beers => res.json(beers))
    .catch(err => res.status(400).json('Beers Error: ' + err));
    
});

router.route('/:id').get((req, res) => {
  Beer.findById(req.params.id)
    .then(beer => res.json(beer))
    .catch(err => res.status(400).json('Error: ' + err))
});

router.route('/update/:id').post((req, res) => {
  Beer.find()
  .where('id').equals(req.params.id)
  .then(beers => {
    const beer = beers[0];
    const { like, email } = req.body;
    beer.liked_by = beer.liked_by ? beer.liked_by.filter(item => item != email) : [];
    if (like) {
      beer.liked_by.push(email);
    }
    beer.save()
    .then(() => res.json('Beer LikedBy Updated!'))
    .catch(err => res.status(400).json('Error: ' + err))
  })
  .catch(err => res.status(400).json('Error: ' + err))
});

module.exports = router;
