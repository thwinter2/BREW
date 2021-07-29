const router = require('express').Router();
const {Style} = require('../models/Style');

router.route('/').get((req, res) => {
  Style.find()
    .then(styles => res.json(styles))
    .catch(err => res.status(400).json('Styles Error: ' + err));
});

router.route('/preferences').post((req, res) => {
  const userStylePreferences = req.body;
  Style.find()
    .where('id').in(userStylePreferences)
    .then(styles => res.json(styles))
    .catch(err => res.status(400).json('Style Current Preferences Error: ' + err));
});

module.exports = router;