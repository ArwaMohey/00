const express = require('express');
const router = express.Router();

// بيانات في الذاكرة (تظل حتى إعادة تشغيل السيرفر)
let meals = [
  { type: 'Breakfast', items: ['Oatmeal with Berries (320 cal)', 'Black Coffee (5 cal)', 'Banana (125 cal)'], calories: 450 },
  { type: 'Lunch', items: ['Chicken Salad Sandwich (450 cal)', 'Greek Yogurt (130 cal)', 'Apple (100 cal)'], calories: 680 },
  { type: 'Dinner', items: ['Grilled Salmon (280 cal)', 'Quinoa (120 cal)', 'Steamed Vegetables (120 cal)'], calories: 520 }
];

let nutrition = [
  { label: 'Carbs', value: 45, color: '#53bdbd' },
  { label: 'Protein', value: 25, color: '#ff7675' },
  { label: 'Fat', value: 30, color: '#fdcb6e' }
];

let totalCalories = 2200;

const getConsumedCalories = () => meals.reduce((sum, m) => sum + m.calories, 0);

router.get('/', (req, res) => {
  res.json({
    data: {
      meals,
      nutrition,
      totalCalories,
      consumedCalories: getConsumedCalories()
    }
  });
});

router.post('/meals', (req, res) => {
  const { type, items, calories } = req.body;
  if (!type || !items || !calories) {
    return res.status(400).json({ message: 'Missing fields' });
  }
  meals.push({ type, items, calories });
  res.json({ message: 'Meal added successfully!' });
});

// حذف وجبة حسب رقمها في القائمة (index)
router.delete('/meals/:index', (req, res) => {
  const idx = parseInt(req.params.index);
  if (isNaN(idx) || idx < 0 || idx >= meals.length) {
    return res.status(400).json({ message: 'Invalid meal index' });
  }
  meals.splice(idx, 1);
  res.json({ message: 'Meal deleted successfully!' });
});

module.exports = router;
