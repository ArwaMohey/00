const express = require('express');
const auth = require('../middleware/auth');
const createRateLimiter = require('../middleware/rateLimit');
const {
  getHealthData,
  addMeal,
  updateMeal,
  deleteMeal,
  updateTargetCalories
} = require('../controllers/healthTrackerController');

const router = express.Router();
const healthTrackerRateLimiter = createRateLimiter({ windowMs: 15 * 60 * 1000, max: 240 });

router.use(healthTrackerRateLimiter);
router.get('/', auth, getHealthData);
router.post('/meals', auth, addMeal);
router.put('/meals/:mealId', auth, updateMeal);
router.delete('/meals/:mealId', auth, deleteMeal);
router.put('/target-calories', auth, updateTargetCalories);

module.exports = router;
