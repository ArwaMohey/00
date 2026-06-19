const HealthMetric = require('../models/HealthMetric');

const nutritionColors = {
  Carbs: '#1d4ed8',
  Protein: '#0f766e',
  Fat: '#475569'
};

const getOrCreateMetric = async (userId) => {
  let healthMetric = await HealthMetric.findOne({ userId });
  if (!healthMetric) {
    healthMetric = await HealthMetric.create({ userId, meals: [] });
  }
  return healthMetric;
};

const buildNutritionData = (meals) => {
  const totals = meals.reduce(
    (acc, meal) => {
      acc.carbs += meal.macros?.carbs || 0;
      acc.protein += meal.macros?.protein || 0;
      acc.fat += meal.macros?.fat || 0;
      return acc;
    },
    { carbs: 0, protein: 0, fat: 0 }
  );

  const totalMacros = totals.carbs + totals.protein + totals.fat;

  if (totalMacros === 0) {
    return [
      { label: 'Carbs', value: 0, color: nutritionColors.Carbs },
      { label: 'Protein', value: 0, color: nutritionColors.Protein },
      { label: 'Fat', value: 0, color: nutritionColors.Fat }
    ];
  }

  return [
    {
      label: 'Carbs',
      value: Math.round((totals.carbs / totalMacros) * 100),
      color: nutritionColors.Carbs
    },
    {
      label: 'Protein',
      value: Math.round((totals.protein / totalMacros) * 100),
      color: nutritionColors.Protein
    },
    {
      label: 'Fat',
      value: Math.round((totals.fat / totalMacros) * 100),
      color: nutritionColors.Fat
    }
  ];
};

const formatResponseData = (healthMetric) => {
  const consumedCalories = healthMetric.meals.reduce((sum, meal) => sum + meal.calories, 0);

  return {
    _id: healthMetric._id,
    totalCalories: healthMetric.totalCalories,
    consumedCalories,
    remainingCalories: Math.max(healthMetric.totalCalories - consumedCalories, 0),
    meals: healthMetric.meals,
    nutrition: buildNutritionData(healthMetric.meals)
  };
};

exports.getHealthData = async (req, res) => {
  try {
    const healthMetric = await getOrCreateMetric(req.user._id);

    res.status(200).json({
      success: true,
      data: formatResponseData(healthMetric)
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch health data'
    });
  }
};

exports.addMeal = async (req, res) => {
  try {
    const { type, items, calories, macros } = req.body;

    if (!type || !Array.isArray(items) || items.length === 0 || Number.isNaN(Number(calories))) {
      return res.status(400).json({
        success: false,
        message: 'Meal type, items, and calories are required'
      });
    }

    const healthMetric = await getOrCreateMetric(req.user._id);

    healthMetric.meals.push({
      type,
      items,
      calories: Number(calories),
      macros: {
        carbs: Number(macros?.carbs || 0),
        protein: Number(macros?.protein || 0),
        fat: Number(macros?.fat || 0)
      }
    });

    await healthMetric.save();

    res.status(201).json({
      success: true,
      data: formatResponseData(healthMetric)
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to add meal'
    });
  }
};

exports.updateMeal = async (req, res) => {
  try {
    const { mealId } = req.params;
    const { type, items, calories, macros } = req.body;

    const healthMetric = await getOrCreateMetric(req.user._id);
    const meal = healthMetric.meals.id(mealId);

    if (!meal) {
      return res.status(404).json({
        success: false,
        message: 'Meal not found'
      });
    }

    if (type) meal.type = type;
    if (Array.isArray(items)) meal.items = items;
    if (calories !== undefined) meal.calories = Number(calories);

    if (macros) {
      if (macros.carbs !== undefined) meal.macros.carbs = Number(macros.carbs);
      if (macros.protein !== undefined) meal.macros.protein = Number(macros.protein);
      if (macros.fat !== undefined) meal.macros.fat = Number(macros.fat);
    }

    await healthMetric.save();

    res.status(200).json({
      success: true,
      data: formatResponseData(healthMetric)
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to update meal'
    });
  }
};

exports.deleteMeal = async (req, res) => {
  try {
    const { mealId } = req.params;
    const healthMetric = await getOrCreateMetric(req.user._id);

    const meal = healthMetric.meals.id(mealId);
    if (!meal) {
      return res.status(404).json({
        success: false,
        message: 'Meal not found'
      });
    }

    meal.deleteOne();
    await healthMetric.save();

    res.status(200).json({
      success: true,
      data: formatResponseData(healthMetric)
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to delete meal'
    });
  }
};

exports.updateTargetCalories = async (req, res) => {
  try {
    const { totalCalories } = req.body;

    if (Number.isNaN(Number(totalCalories)) || Number(totalCalories) < 0) {
      return res.status(400).json({
        success: false,
        message: 'A valid total calorie target is required'
      });
    }

    const healthMetric = await getOrCreateMetric(req.user._id);
    healthMetric.totalCalories = Number(totalCalories);

    await healthMetric.save();

    res.status(200).json({
      success: true,
      data: formatResponseData(healthMetric)
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to update target calories'
    });
  }
};
