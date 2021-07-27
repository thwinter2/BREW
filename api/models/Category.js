const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const categorySchema = new Schema({
  id: {
    type: String,
  },
  cat_name: {
    type: String,
  },
});

const Category = mongoose.model("categories", categorySchema);

module.exports = {Category, categorySchema};