const mongoose = require('mongoose');

const providerSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true,
    enum: ['Doctor', 'Electrician', 'Plumber', 'Tutor', 'Helper', 'Mechanic', 'Carpenter', 'Other']
  },
  contact: {
    type: String,
    required: true
  },
  whatsapp: String,
  location: {
    pincode: {
      type: String,
      required: true
    },
    address: String,
    city: String,
    state: String
  },
  services: [String],
  charges: String,
  availability: {
    type: Boolean,
    default: true
  },
  rating: {
    type: Number,
    default: 0
  },
  totalReviews: {
    type: Number,
    default: 0
  },
  reviews: [{
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    userName: String,
    rating: {
      type: Number,
      min: 1,
      max: 5
    },
    comment: String,
    date: {
      type: Date,
      default: Date.now
    }
  }],
  verified: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Provider', providerSchema);
