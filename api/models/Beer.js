const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const BeerSchema = new Schema({
  id: {
    type: String,
  },
  brewery_id: {
    type: String,
  },
  name: {
    type: String,
  },
  cat_id: {
    type: String,
  },
  style_id: {
    type: String,
  },
  abv: {
    type: String,
  },
  ibu: {
    type: String,
  },
  srm: {
    type: String,
  },
  upc: {
    type: String,
  },
  descript: {
    type: String,
  },
  last_mod: {
    type: String,
  },
  liked_by: {
    type: Array,
  }
});

const Beer = mongoose.model("beers", BeerSchema);

module.exports = Beer;