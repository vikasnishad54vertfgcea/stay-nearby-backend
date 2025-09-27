const BloodDonor = require('../models/BloodDonor');

const addBloodDonor = async (req, res) => {
  try {
    const donorData = {
      ...req.body,
      userId: req.user._id
    };

    const donor = new BloodDonor(donorData);
    await donor.save();

    res.status(201).json({
      message: 'Blood donor registered successfully',
      donor
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const searchBloodDonors = async (req, res) => {
  try {
    const { bloodGroup, pincode, availability } = req.query;
    
    let query = {};
    
    if (bloodGroup) {
      query.bloodGroup = bloodGroup;
    }
    
    if (pincode) {
      query['location.pincode'] = pincode;
    }
    
    if (availability !== undefined) {
      query.availability = availability === 'true';
    }

    const donors = await BloodDonor.find(query)
      .sort({ createdAt: -1 });

    res.json({
      message: 'Blood donors found',
      count: donors.length,
      donors
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const updateDonorAvailability = async (req, res) => {
  try {
    const { availability } = req.body;
    
    const donor = await BloodDonor.findOne({ userId: req.user._id });
    if (!donor) {
      return res.status(404).json({ message: 'Donor profile not found' });
    }

    donor.availability = availability;
    await donor.save();

    res.json({
      message: 'Availability updated successfully',
      donor
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const getEmergencyContacts = async (req, res) => {
  try {
    const emergencyContacts = {
      ambulance: '108',
      police: '100',
      fire: '101',
      women_helpline: '1091',
      child_helpline: '1098',
      disaster_management: '108'
    };

    res.json({
      message: 'Emergency contacts',
      contacts: emergencyContacts
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  addBloodDonor,
  searchBloodDonors,
  updateDonorAvailability,
  getEmergencyContacts
};
