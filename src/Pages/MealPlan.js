import React, { useState } from "react";
import "./MealPlan.css";

const MealPlan = () => {
  const [formData, setFormData] = useState({
    weight: "",
    height: "",
    bodyFat: "",
    goal: "",
  });

  const [mealPlan, setMealPlan] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editIndex, setEditIndex] = useState(null);
  const [editMealData, setEditMealData] = useState({ meal: "", description: "" });
  const [apiResponse, setApiResponse] = useState(null); // Store API response

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    calculateMealPlan();
  };

  const calculateMealPlan = async () => {
    const calories = formData.goal === "muscle" ? 15 * formData.weight : 12 * formData.weight;

    const meals = [
      { meal: "Breakfast", description: "Oats, eggs, and fruit" },
      { meal: "Lunch", description: "Chicken, rice, and veggies" },
      { meal: "Dinner", description: "Fish, quinoa, and steamed broccoli" },
    ];

    const mealPlanData = {
      weight: formData.weight,
      height: formData.height,
      bodyFat: formData.bodyFat,
      goal: formData.goal,
      calories: calories,
      meals: meals,
    };

    setMealPlan(mealPlanData);

    // **API Request**
    try {
      const response = await fetch(
        "https://651t3zxuh7.execute-api.us-east-1.amazonaws.com/Prod/diet-plan", // Ensure this is your correct API URL
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-api-key": "651t3zxuh7", // Your API key goes here
          },
          mode: "cors", // Added to help with CORS issues
          body: JSON.stringify(mealPlanData),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const text = await response.text();
      let data;

      try {
        data = JSON.parse(text); // Try parsing JSON
      } catch {
        data = {}; // If parsing fails, assume empty object
      }

      setApiResponse(
        `Meal Plan Saved! UserID: ${data.userId || "N/A"}, MealPlanID: ${data.mealPlanId || "N/A"}`
      );
    } catch (error) {
      console.error("Fetch error:", error);
    }
  };

  const handleMealEdit = (index) => {
    setIsEditing(true);
    setEditIndex(index);
    setEditMealData({
      meal: mealPlan.meals[index].meal,
      description: mealPlan.meals[index].description,
    });
  };

  const handleMealDelete = (index) => {
    const updatedMeals = mealPlan.meals.filter((_, i) => i !== index);
    setMealPlan({ ...mealPlan, meals: updatedMeals });
  };

  const handleSaveMeal = () => {
    const updatedMeals = [...mealPlan.meals];
    updatedMeals[editIndex] = editMealData;
    setMealPlan({ ...mealPlan, meals: updatedMeals });
    setIsEditing(false);
    setEditIndex(null);
  };

  const handleChangeMealData = (e) => {
    setEditMealData({ ...editMealData, [e.target.name]: e.target.value });
  };

  return (
    <div className="meal-plan-container">
      <h1>Customize Your Meal Plan</h1>
      {!mealPlan ? (
        <form className="meal-form" onSubmit={handleSubmit}>
          <label>Weight (kg):</label>
          <input type="number" name="weight" value={formData.weight} onChange={handleChange} required />
          <label>Height (cm):</label>
          <input type="number" name="height" value={formData.height} onChange={handleChange} required />
          <label>Body Fat (%):</label>
          <input type="number" name="bodyFat" value={formData.bodyFat} onChange={handleChange} required />
          <label>Goal:</label>
          <select name="goal" value={formData.goal} onChange={handleChange} required>
            <option value="">Select a goal</option>
            <option value="muscle">Muscle Gain</option>
            <option value="fatloss">Fat Loss</option>
          </select>
          <button type="submit">Generate Meal Plan</button>
        </form>
      ) : (
        <div className="meal-plan-result">
          <h2>Your Meal Plan</h2>
          <p>Total Calories Needed: {mealPlan.calories} kcal</p>
          <div className="meal-list">
            {mealPlan.meals.map((meal, index) => (
              <div key={index} className="meal-item">
                {isEditing && editIndex === index ? (
                  <div>
                    <label>Meal Name:</label>
                    <input type="text" name="meal" value={editMealData.meal} onChange={handleChangeMealData} />
                    <label>Description:</label>
                    <input type="text" name="description" value={editMealData.description} onChange={handleChangeMealData} />
                    <button onClick={handleSaveMeal}>Save</button>
                  </div>
                ) : (
                  <div>
                    <h3>{meal.meal}</h3>
                    <p>{meal.description}</p>
                    <button onClick={() => handleMealEdit(index)}>Edit</button>
                    <button onClick={() => handleMealDelete(index)}>Delete</button>
                  </div>
                )}
              </div>
            ))}
          </div>
          {apiResponse && <p className="api-response">{apiResponse}</p>}
        </div>
      )}
    </div>
  );
};

export default MealPlan;
