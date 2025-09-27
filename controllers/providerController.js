const Provider = require('../models/Provider');
const User = require('../models/User');

const createProvider = async (req, res) => {
  try {
    const providerData = {
      ...req.body,
      userId: req.user._id
    };

    const provider = new Provider(providerData);
    await provider.save();

    // Update user role to provider
    await User.findByIdAndUpdate(req.user._id, { role: 'provider' });

    res.status(201).json({
      message: 'Provider profile created successfully',
      provider
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const searchProviders = async (req, res) => {
  try {
    const { pincode, category, availability } = req.query;
    
    let query = {};
    
    if (pincode) {
      query['location.pincode'] = pincode;
    }
    
    if (category) {
      query.category = category;
    }
    
    if (availability !== undefined) {
      query.availability = availability === 'true';
    }

    const providers = await Provider.find(query)
      .populate('userId', 'name email')
      .sort({ rating: -1, createdAt: -1 });

    res.json({
      message: 'Providers found',
      count: providers.length,
      providers
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const getProviderById = async (req, res) => {
  try {
    const provider = await Provider.findById(req.params.id)
      .populate('userId', 'name email');

    if (!provider) {
      return res.status(404).json({ message: 'Provider not found' });
    }

    res.json(provider);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const updateProvider = async (req, res) => {
  try {
    const provider = await Provider.findOne({ userId: req.user._id });
    
    if (!provider) {
      return res.status(404).json({ message: 'Provider profile not found' });
    }

    Object.assign(provider, req.body);
    await provider.save();

    res.json({
      message: 'Provider profile updated successfully',
      provider
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const addReview = async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const providerId = req.params.id;

    const provider = await Provider.findById(providerId);
    if (!provider) {
      return res.status(404).json({ message: 'Provider not found' });
    }

    // Check if user already reviewed
    const existingReview = provider.reviews.find(
      review => review.userId.toString() === req.user._id.toString()
    );

    if (existingReview) {
      return res.status(400).json({ message: 'You have already reviewed this provider' });
    }

    // Add review
    provider.reviews.push({
      userId: req.user._id,
      userName: req.user.name,
      rating,
      comment
    });

    // Update average rating
    const totalRating = provider.reviews.reduce((sum, review) => sum + review.rating, 0);
    provider.rating = totalRating / provider.reviews.length;
    provider.totalReviews = provider.reviews.length;

    await provider.save();

    res.json({
      message: 'Review added successfully',
      rating: provider.rating,
      totalReviews: provider.totalReviews
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  createProvider,
  searchProviders,
  getProviderById,
  updateProvider,
  addReview
};
