const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// schema
const stopSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  stopInitial: {
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

stopSchema.index({
  'name': 1,
});

// exporting the entire module
module.exports = mongoose.model('stops', stopSchema);