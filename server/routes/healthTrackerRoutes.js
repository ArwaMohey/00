const express = require('express');
const auth = require('../middleware/auth');
const {
  getHealthData,
  addMeal,
  updateMeal,
  deleteMeal,
  updateTargetCalories
} = require('../controllers/healthTrackerController');

const router = express.Router();

router.get('/', auth, getHealthData);
router.post('/meals', auth, addMeal);
router.put('/meals/:mealId', auth, updateMeal);
router.delete('/meals/:mealId', auth, deleteMeal);
router.put('/target-calories', auth, updateTargetCalories);

module.exports = router;
