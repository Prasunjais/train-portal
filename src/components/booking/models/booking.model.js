const mongoose = require('mongoose');
const autopopulate = require('mongoose-autopopulate');

const Schema = mongoose.Schema;

// schema
const bookingSchema = new Schema({
  trainId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'trains',
  },
  passengerIds: [{
    passenger: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'passengers',
      autopopulate: {
        select: ['firstName', 'lastName', 'gender']
      }
    },
  }],
  status: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// creating a new index
bookingSchema.index({
  'trainId': 1
});

// autocomplete 
bookingSchema.plugin(autopopulate);

// exporting the entire module
module.exports = mongoose.model('bookings', bookingSchema);