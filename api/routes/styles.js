const router = require('express').Router();
let Style = require('../models/Style');

router.route('/styles').get((req, res) => {
  Style.find()
    .then(styles => res.json(styles))
    .catch(err => res.status(400).json('Error: ' + err));
});

module.exports = router;