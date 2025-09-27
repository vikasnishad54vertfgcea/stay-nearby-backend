const express = require('express');
const User = require('../models/User');
const Provider = require('../models/Provider');
const auth = require('../middleware/auth');

const router = express.Router();

// Update user profile
router.put('/profile', auth, async (req, res) => {
  try {
    const { name, location } = req.body;
    
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { name, location },
      { new: true }
    ).select('-password');

    res.json({
      message: 'Profile updated successfully',
      user
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Add/Remove favorite provider
router.post('/favorites/:providerId', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const providerId = req.params.providerId;

    const isAlreadyFavorite = user.favorites.includes(providerId);

    if (isAlreadyFavorite) {
      user.favorites = user.favorites.filter(id => id.toString() !== providerId);
    } else {
      user.favorites.push(providerId);
    }

    await user.save();

    res.json({
      message: isAlreadyFavorite ? 'Removed from favorites' : 'Added to favorites',
      favorites: user.favorites
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get user favorites
router.get('/favorites', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate({
      path: 'favorites',
      select: 'name category rating location availability contact'
    });

    res.json({
      message: 'Favorites retrieved',
      favorites: user.favorites
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
