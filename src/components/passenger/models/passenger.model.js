const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// schema
const passengerSchema = new Schema({
  firstName: {
    type: String,
    required: true
  },
  lastName: {
    type: String,
    required: true
  },
  gender: {
    type: String,
    required: true
  },
  status: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

passengerSchema.index({
  'firstName': 1,
  'lastName': 1
});

// exporting the entire module
module.exports = mongoose.model('passengers', passengerSchema);