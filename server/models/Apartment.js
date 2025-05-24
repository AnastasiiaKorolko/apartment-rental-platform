const { default: mongoose } = require('mongoose');
const mongose = require('mongoose');

const apartmentSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    maxlength: 90
  },
  description: {
    type: String,
    required: true,
    maxlength: 335
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  rooms: {
    type: Number,
    required: true,
    enum: [1, 2, 3]
  },
  images: {
    type: [String],
    default: []
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Apartment', apartmentSchema);