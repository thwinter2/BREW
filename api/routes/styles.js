const router = require('express').Router();
const mongoose = require("mongoose");
const Style = mongoose.model("styles");

router.route('/styles').get((req, res) => {
  Style.find()
    .then(styles => res.json(styles))
    .catch(err => res.status(400).json('Styles Error: ' + err));
});

module.exports = router;