const express = require('express');
const {
  createProvider,
  searchProviders,
  getProviderById,
  updateProvider,
  addReview
} = require('../controllers/providerController');
const { validateProvider, handleValidationErrors } = require('../middleware/validation');
const auth = require('../middleware/auth');

const router = express.Router();

router.post('/', auth, validateProvider, handleValidationErrors, createProvider);
router.get('/search', searchProviders);
router.get('/:id', getProviderById);
router.put('/profile', auth, updateProvider);
router.post('/:id/review', auth, addReview);

module.exports = router;
