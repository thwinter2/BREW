const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const BrewerySchema = new Schema({
  id: {
    type: String,
  },
  name: {
    type: String,
  },
  address1: {
    type: String,
  },
  city: {
    type: String,
  },
  state: {
    type: String,
  },
  code: {
    type: String,
  },
  country: {
    type: String,
  },
  phone: {
    type: String,
  },
  website: {
    type: String,
  },
  descript: {
    type: String,
  },
  last_mod: {
    type: String,
  },
});

const Brewery = mongoose.model("breweries", BrewerySchema);

module.exports = Brewery;