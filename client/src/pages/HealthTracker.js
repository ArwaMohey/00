import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { useAuth } from '../components/AuthContext';
import './HealthTracker.css';

const HealthTracker = () => {
  const [healthData, setHealthData] = useState({
    meals: [],
    nutrition: [],
    totalCalories: 0,
    consumedCalories: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddMealForm, setShowAddMealForm] = useState(false);
  const [newMeal, setNewMeal] = useState({
    type: '',
    items: '', // comma separated
    calories: ''
  });
  const [addError, setAddError] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    const fetchHealthData = async () => {
      try {
        const response = await api.get('/health-tracker');
        setHealthData(response.data.data);
        setLoading(false);
      } catch (err) {
        // fallback بيانات وهمية
        setHealthData({
          meals: [
            { type: 'Breakfast', items: ['Oatmeal with Berries (320 cal)', 'Black Coffee (5 cal)', 'Banana (125 cal)'], calories: 450 },
            { type: 'Lunch', items: ['Chicken Salad Sandwich (450 cal)', 'Greek Yogurt (130 cal)', 'Apple (100 cal)'], calories: 680 },
            { type: 'Dinner', items: ['Grilled Salmon (280 cal)', 'Quinoa (120 cal)', 'Steamed Vegetables (120 cal)'], calories: 520 }
          ],
          nutrition: [
            { label: 'Carbs', value: 45, color: '#53bdbd' },
            { label: 'Protein', value: 25, color: '#ff7675' },
            { label: 'Fat', value: 30, color: '#fdcb6e' }
          ],
          totalCalories: 2200,
          consumedCalories: 1650
        });
        setError(null);
        setLoading(false);
      }
    };
    fetchHealthData();
  }, []);

  const handleAddMeal = () => {
    setShowAddMealForm(true);
    setAddError(null);
  };

  const handleFormChange = (e) => {
    setNewMeal({ ...newMeal, [e.target.name]: e.target.value });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setAddError(null);
    if (!newMeal.type || !newMeal.items || !newMeal.calories) {
      setAddError('Please fill all fields');
      return;
    }
    try {
      const mealData = {
        type: newMeal.type,
        items: newMeal.items.split(',').map(i => i.trim()),
        calories: parseInt(newMeal.calories)
      };
      await api.post('/health-tracker/meals', mealData);
      const response = await api.get('/health-tracker');
      setHealthData(response.data.data);
      setShowAddMealForm(false);
      setNewMeal({ type: '', items: '', calories: '' });
    } catch (err) {
      setAddError('Failed to add meal');
    }
  };

  const handleDeleteMeal = async (index) => {
    try {
      await api.delete(`/health-tracker/meals/${index}`);
      const response = await api.get('/health-tracker');
      setHealthData(response.data.data);
    } catch (err) {
      alert('Failed to delete meal');
    }
  };

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="health-tracker-container">
      <h1>Health Tracker</h1>
      <div className="health-tracker-content">
        {/* الكارد اليسار */}
        <div className="calorie-card">
          <h2>Daily Calorie Intake</h2>
          <div className="calorie-amount">
            <span className="calorie-main">{healthData.consumedCalories.toLocaleString()}</span>
            <span className="calorie-goal">of {healthData.totalCalories.toLocaleString()} cal</span>
          </div>
          <div className="calorie-progress-bar">
            <div
              className="calorie-progress"
              style={{
                width: `${Math.min(100, (healthData.consumedCalories / healthData.totalCalories) * 100)}%`
              }}
            />
          </div>
          <div style={{margin: '18px 0 0 0', fontWeight: 600}}>Today's Meals</div>
          {healthData.meals.map((meal, index) => (
            <div key={index} className="meal-block">
              <div className="meal-header">
                <span>{meal.type}</span>
                <span style={{color:'#6b7a85', fontWeight:400}}>{meal.calories} calories</span>
                <button
                  style={{
                    marginLeft: 10,
                    background: '#ff7675',
                    color: '#fff',
                    border: 'none',
                    borderRadius: 4,
                    padding: '2px 8px',
                    cursor: 'pointer'
                  }}
                  onClick={() => handleDeleteMeal(index)}
                >
                  Delete
                </button>
              </div>
              <ul className="meal-list">
                {meal.items.map((item, itemIndex) => (
                  <li key={itemIndex}>{item}</li>
                ))}
              </ul>
            </div>
          ))}
          <button className="add-meal-btn" onClick={handleAddMeal}>Add Meal</button>
        </div>
        {/* الكارد اليمين */}
        <div className="nutrition-card">
          <h2>Nutrition Breakdown</h2>
          <div className="donut-chart-wrapper">
            <svg width="120" height="120" viewBox="0 0 42 42" className="donut">
              {(() => {
                let acc = 0;
                return healthData.nutrition.map((item, i) => {
                  const val = (item.value / 100) * 100;
                  const dash = `${val} ${100 - val}`;
                  const el = (
                    <circle
                      key={i}
                      className="donut-segment"
                      cx="21" cy="21" r="15.91549430918954"
                      fill="transparent"
                      stroke={item.color}
                      strokeWidth="4"
                      strokeDasharray={dash}
                      strokeDashoffset={acc}
                    />
                  );
                  acc -= (item.value / 100) * 100;
                  return el;
                });
              })()}
            </svg>
          </div>
          <div className="nutrition-legend">
            {healthData.nutrition.map((item, i) => (
              <div key={i} className="legend-item">
                <span className="legend-label" style={{color:item.color}}>{item.value}%</span>
                <span>{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
      {/* فورم إضافة وجبة */}
      {showAddMealForm && (
        <div className="add-meal-form-modal" style={{background:'#0008',position:'fixed',top:0,left:0,right:0,bottom:0,display:'flex',alignItems:'center',justifyContent:'center',zIndex:1000}}>
          <form className="add-meal-form" onSubmit={handleFormSubmit} style={{background:'#fff',padding:24,borderRadius:8,minWidth:320,boxShadow:'0 2px 8px #0002'}}>
            <h2>Add New Meal</h2>
            <div style={{marginBottom:12}}>
              <label>Meal Type:</label>
              <input type="text" name="type" value={newMeal.type} onChange={handleFormChange} placeholder="e.g. Breakfast" style={{width:'100%'}} />
            </div>
            <div style={{marginBottom:12}}>
              <label>Items (comma separated):</label>
              <input type="text" name="items" value={newMeal.items} onChange={handleFormChange} placeholder="e.g. Oatmeal, Banana" style={{width:'100%'}} />
            </div>
            <div style={{marginBottom:12}}>
              <label>Calories:</label>
              <input type="number" name="calories" value={newMeal.calories} onChange={handleFormChange} placeholder="e.g. 350" style={{width:'100%'}} />
            </div>
            {addError && <div style={{color:'red',marginBottom:8}}>{addError}</div>}
            <div style={{display:'flex',gap:8}}>
              <button type="submit" style={{background:'#00b894',color:'#fff',border:'none',padding:'8px 16px',borderRadius:4}}>Add</button>
              <button type="button" onClick={()=>setShowAddMealForm(false)} style={{background:'#eee',color:'#222',border:'none',padding:'8px 16px',borderRadius:4}}>Cancel</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default HealthTracker;
