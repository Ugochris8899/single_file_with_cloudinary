const mongoose = require("mongoose");

// Define club schema
const clubSchema = new mongoose.Schema({
  league: {
    type: String,
    require: true
},
clubName: {
  type: String,
  require: true
},
logo: {
  type: String,
  require: true
},
}, { timestamps: true });
  
  const clubModel = mongoose.model('club', clubSchema);

  module.exports = clubModel