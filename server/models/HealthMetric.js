const mongoose = require('mongoose');

const mealSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      required: true,
      trim: true
    },
    items: {
      type: [String],
      default: []
    },
    calories: {
      type: Number,
      required: true,
      min: 0
    },
    macros: {
      carbs: {
        type: Number,
        default: 0,
        min: 0
      },
      protein: {
        type: Number,
        default: 0,
        min: 0
      },
      fat: {
        type: Number,
        default: 0,
        min: 0
      }
    }
  },
  { timestamps: true }
);

const healthMetricSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true
    },
    totalCalories: {
      type: Number,
      default: 2200,
      min: 0
    },
    meals: {
      type: [mealSchema],
      default: []
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('HealthMetric', healthMetricSchema);
