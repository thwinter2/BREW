var express = require('express');
const router = express.Router();
const Brewery = require('../models/Brewery');

router.route('/').get((req, res) => {
  const { name, formatted_address } = req.query;
  var query = Brewery.find();
  if (name && name != 'undefined') {
    query = query.where('name').equals(name)
  }
  if (formatted_address && formatted_address != 'undefined') {
    query = query.where('formatted_address').equals(formatted_address)
  }
  query
    .then(breweries => res.json(breweries))
    .catch(err => res.status(400).json('Breweries Error: ' + err));
    
});

router.route('/:id').get((req, res) => {
  Brewery.findById(req.params.id)
  .then(brewery => res.json(brewery))
  .catch(err => res.status(400).json('Error: ' + err))
});

module.exports = router;
