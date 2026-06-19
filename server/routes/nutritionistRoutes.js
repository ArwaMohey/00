const express = require('express');
const router = express.Router();
const nutritionistController = require('../controllers/nutritionistController');
const auth = require('../middleware/auth');

// Public routes
router.get('/', nutritionistController.getAllNutritionists);
router.get('/:id', nutritionistController.getNutritionistById);

// Protected routes (require authentication)
router.post('/', auth, nutritionistController.createNutritionist);
router.put('/:id', auth, nutritionistController.updateNutritionist);
router.delete('/:id', auth, nutritionistController.deleteNutritionist);
router.post('/:id/reviews', auth, nutritionistController.addReview);

module.exports = router; 