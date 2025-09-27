const express = require('express');
const {
  addBloodDonor,
  searchBloodDonors,
  updateDonorAvailability,
  getEmergencyContacts
} = require('../controllers/emergencyController');
const auth = require('../middleware/auth');

const router = express.Router();

router.post('/blood-donor', auth, addBloodDonor);
router.get('/blood-donors', searchBloodDonors);
router.put('/blood-donor/availability', auth, updateDonorAvailability);
router.get('/contacts', getEmergencyContacts);

module.exports = router;
