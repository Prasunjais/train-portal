const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// schema
const trainSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  number: {
    type: String,
    required: true
  },
  startTimeInMin: {
    type: Number,
    required: true
  },
  stops: [{
    stopId: {
      type: String,
      required: true
    },
    stopName: {
      type: String,
      required: true
    },
    stopInitial: {
      type: String,
      required: true
    },
    stopSeq: {
      type: Number,
      required: true
    },
    reachTimeInMin: {
      type: Number,
      required: true
    }
  }],
  status: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

trainSchema.index({
  'name': 1,
  'number': 1
});

// exporting the entire module
module.exports = mongoose.model('trains', trainSchema);