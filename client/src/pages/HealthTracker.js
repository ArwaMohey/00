import React, { useState, useEffect, useMemo } from 'react';
import api from '../services/api';
import './HealthTracker.css';

const defaultHealthData = {
  meals: [],
  nutrition: [],
  totalCalories: 2200,
  consumedCalories: 0,
  remainingCalories: 2200
};

const HealthTracker = () => {
  const [healthData, setHealthData] = useState(defaultHealthData);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showAddMealForm, setShowAddMealForm] = useState(false);
  const [newMeal, setNewMeal] = useState({
    type: '',
    items: '',
    calories: '',
    carbs: '',
    protein: '',
    fat: ''
  });
  const [targetCalories, setTargetCalories] = useState(2200);

  const fetchHealthData = async () => {
    try {
      const response = await api.get('/health-tracker');
      const data = response.data.data || defaultHealthData;
      setHealthData(data);
      setTargetCalories(data.totalCalories || 2200);
      setError('');
    } catch (err) {
      setError('Unable to load health tracker data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHealthData();
  }, []);

  const handleFormChange = (e) => {
    setNewMeal({ ...newMeal, [e.target.name]: e.target.value });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    if (!newMeal.type || !newMeal.items || !newMeal.calories) {
      setError('Please complete meal type, items, and calories.');
      return;
    }

    try {
      await api.post('/health-tracker/meals', {
        type: newMeal.type,
        items: newMeal.items.split(',').map((item) => item.trim()).filter(Boolean),
        calories: Number(newMeal.calories),
        macros: {
          carbs: Number(newMeal.carbs || 0),
          protein: Number(newMeal.protein || 0),
          fat: Number(newMeal.fat || 0)
        }
      });

      setNewMeal({ type: '', items: '', calories: '', carbs: '', protein: '', fat: '' });
      setShowAddMealForm(false);
      await fetchHealthData();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add meal.');
    }
  };

  const handleDeleteMeal = async (mealId) => {
    try {
      await api.delete(`/health-tracker/meals/${mealId}`);
      await fetchHealthData();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete meal.');
    }
  };

  const handleTargetUpdate = async (e) => {
    e.preventDefault();

    try {
      await api.put('/health-tracker/target-calories', {
        totalCalories: Number(targetCalories)
      });
      await fetchHealthData();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update target calories.');
    }
  };

  const nutritionWithPercentages = useMemo(() => {
    const source = Array.isArray(healthData.nutrition) ? healthData.nutrition : [];
    const total = source.reduce((sum, item) => sum + Number(item.value || 0), 0);

    if (total === 0) {
      return [];
    }

    let cumulative = 0;
    return source.map((item) => {
      const value = Number(item.value || 0);
      const percentage = Math.max(0, (value / total) * 100);
      const entry = {
        ...item,
        percentage,
        strokeDasharray: `${percentage} ${100 - percentage}`,
        strokeDashoffset: -cumulative
      };
      cumulative += percentage;
      return entry;
    });
  }, [healthData.nutrition]);

  const progressPercentage =
    healthData.totalCalories > 0
      ? Math.min(100, (healthData.consumedCalories / healthData.totalCalories) * 100)
      : 0;

  if (loading) return <div className="loading-state">Loading health tracker...</div>;

  return (
    <div className="health-tracker-container">
      <h1>Health Tracker</h1>
      <p className="health-tracker-subtitle">Track your daily meals, calories, and nutrient balance.</p>

      {error && <div className="health-error">{error}</div>}

      <div className="health-tracker-content">
        <section className="calorie-card">
          <h2>Daily Calorie Intake</h2>

          <form className="target-form" onSubmit={handleTargetUpdate}>
            <label htmlFor="targetCalories">Daily Target (cal)</label>
            <input
              id="targetCalories"
              type="number"
              min="0"
              value={targetCalories}
              onChange={(e) => setTargetCalories(e.target.value)}
              required
            />
            <button type="submit">Update</button>
          </form>

          <div className="calorie-amount">
            <span className="calorie-main">{healthData.consumedCalories}</span>
            <span className="calorie-goal">of {healthData.totalCalories} cal</span>
          </div>

          <div className="calorie-progress-bar">
            <div className="calorie-progress" style={{ width: `${progressPercentage}%` }} />
          </div>
          <p className="remaining-calories">Remaining: {healthData.remainingCalories} calories</p>

          <div className="meal-header-row">
            <h3>Today&apos;s Meals</h3>
            <button type="button" className="add-meal-btn" onClick={() => setShowAddMealForm(true)}>
              Add Meal
            </button>
          </div>

          <div className="meals-list">
            {healthData.meals.length === 0 ? (
              <p className="empty-state">No meals added yet.</p>
            ) : (
              healthData.meals.map((meal) => (
                <article key={meal._id} className="meal-block">
                  <div className="meal-main">
                    <div>
                      <strong>{meal.type}</strong>
                      <p>{meal.calories} calories</p>
                      <p>
                        Carbs: {meal.macros?.carbs || 0}g · Protein: {meal.macros?.protein || 0}g · Fat:{' '}
                        {meal.macros?.fat || 0}g
                      </p>
                    </div>
                    <button type="button" onClick={() => handleDeleteMeal(meal._id)}>
                      Delete
                    </button>
                  </div>
                  <ul>
                    {meal.items.map((item) => (
                      <li key={`${meal._id}-${item}`}>{item}</li>
                    ))}
                  </ul>
                </article>
              ))
            )}
          </div>
        </section>

        <section className="nutrition-card">
          <h2>Nutrition Breakdown</h2>
          <div className="donut-chart-wrapper">
            <svg width="160" height="160" viewBox="0 0 42 42" className="donut">
              <circle cx="21" cy="21" r="15.915" fill="transparent" stroke="#e2e8f0" strokeWidth="4" />
              {nutritionWithPercentages.map((item) => (
                <circle
                  key={item.label}
                  cx="21"
                  cy="21"
                  r="15.915"
                  fill="transparent"
                  stroke={item.color}
                  strokeWidth="4"
                  strokeDasharray={item.strokeDasharray}
                  strokeDashoffset={item.strokeDashoffset}
                />
              ))}
            </svg>
          </div>

          <div className="nutrition-legend">
            {nutritionWithPercentages.length === 0 ? (
              <p className="empty-state">Add meals with macros to view nutrition percentages.</p>
            ) : (
              nutritionWithPercentages.map((item) => (
                <div key={item.label} className="legend-item">
                  <span className="legend-color" style={{ backgroundColor: item.color }} />
                  <span>{item.label}</span>
                  <strong>{Math.round(item.percentage)}%</strong>
                </div>
              ))
            )}
          </div>
        </section>
      </div>

      {showAddMealForm && (
        <div className="meal-modal-backdrop">
          <form className="add-meal-form" onSubmit={handleFormSubmit}>
            <h2>Add New Meal</h2>

            <label htmlFor="mealType">Meal Type</label>
            <input id="mealType" type="text" name="type" value={newMeal.type} onChange={handleFormChange} required />

            <label htmlFor="mealItems">Items (comma separated)</label>
            <input
              id="mealItems"
              type="text"
              name="items"
              value={newMeal.items}
              onChange={handleFormChange}
              required
            />

            <label htmlFor="mealCalories">Calories</label>
            <input
              id="mealCalories"
              type="number"
              min="0"
              name="calories"
              value={newMeal.calories}
              onChange={handleFormChange}
              required
            />

            <div className="macro-grid">
              <div>
                <label htmlFor="mealCarbs">Carbs (g)</label>
                <input id="mealCarbs" type="number" min="0" name="carbs" value={newMeal.carbs} onChange={handleFormChange} />
              </div>
              <div>
                <label htmlFor="mealProtein">Protein (g)</label>
                <input
                  id="mealProtein"
                  type="number"
                  min="0"
                  name="protein"
                  value={newMeal.protein}
                  onChange={handleFormChange}
                />
              </div>
              <div>
                <label htmlFor="mealFat">Fat (g)</label>
                <input id="mealFat" type="number" min="0" name="fat" value={newMeal.fat} onChange={handleFormChange} />
              </div>
            </div>

            <div className="modal-actions">
              <button type="submit" className="modal-primary">Add Meal</button>
              <button type="button" className="modal-secondary" onClick={() => setShowAddMealForm(false)}>
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default HealthTracker;
