var express = require('express');
const router = express.Router();
const User = require('../models/User');

router.route('/').get((req, res) => {
  User.find()
    .then(styles => res.json(styles))
    .catch(err => res.status(400).json('Styles Error: ' + err));
});

router.route('/:id').get((req, res) => {
  User.findById(req.params.id)
  .then(user => res.json(user))
  .catch(err => res.status(400).json('Error: ' + err))
});

router.route('/update/:id').post((req, res) => {
  User.findById(req.params.id)
  .then(user => {
    user.preferences = req.body.preferences;

    user.save()
    .then(() => res.json('User Preferences Updated!'))
    .catch(err => res.status(400).json('Error: ' + err))
  })
  .catch(err => res.status(400).json('Error: ' + err))
});

module.exports = router;
