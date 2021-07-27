const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const StyleSchema = new Schema({
  id: {
    type: String,
  },
  cat_id: {
    type: String,
  },
style_name: {
    type: String,
},
last_mod: {
},
});

module.exports = Style = mongoose.model("styles", StyleSchema);