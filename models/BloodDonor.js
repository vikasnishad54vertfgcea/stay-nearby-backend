const mongoose = require('mongoose');

const bloodDonorSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  name: {
    type: String,
    required: true
  },
  bloodGroup: {
    type: String,
    required: true,
    enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']
  },
  contact: {
    type: String,
    required: true
  },
  location: {
    pincode: {
      type: String,
      required: true
    },
    city: String,
    state: String
  },
  availability: {
    type: Boolean,
    default: true
  },
  lastDonation: Date,
  age: {
    type: Number,
    min: 18,
    max: 65
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('BloodDonor', bloodDonorSchema);
