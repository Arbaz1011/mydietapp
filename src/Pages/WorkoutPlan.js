import React, { useState } from "react";
import "./WorkoutPlan.css";

const WorkoutPlan = () => {
  const [name, setName] = useState("");
  const [workoutPlan, setWorkoutPlan] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // ✅ Automatically switch between local (proxy) and production (full URL)
  const isLocal = window.location.hostname === "localhost";
  const WORKOUT_API_URL = isLocal
    ? "/Prod/workout"
    : "https://ej9wc7ktl1.execute-api.us-east-1.amazonaws.com/Prod/workout";

  const fetchWorkoutPlan = async () => {
    const trimmedName = name.trim();
    if (!trimmedName) {
      setError("Please enter a valid name.");
      return;
    }

    setLoading(true);
    setError("");
    setWorkoutPlan(null);

    try {
      const response = await fetch(`${WORKOUT_API_URL}?name=${encodeURIComponent(trimmedName)}`);

      if (!response.ok) {
        throw new Error("User not found or API error.");
      }

      const data = await response.json();

      if (!data || !data[0] || !data[0].workoutPlan) {
        throw new Error("No workout plan found for this user.");
      }

      setWorkoutPlan(data[0]); // Access the first item from DynamoDB
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="workout-container">
      <h2>Enter Name for Workout Plan</h2>

      <input
        type="text"
        className="workout-input"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Enter Name"
      />

      <button className="workout-button" onClick={fetchWorkoutPlan} disabled={loading}>
        {loading ? "Fetching..." : "Get Workout Plan"}
      </button>

      {error && <p className="error">{error}</p>}

      {workoutPlan && (
        <div className="workout-details">
          <h3>Workout Plan for {workoutPlan.name}</h3>
          <p><strong>Age:</strong> {workoutPlan.age}</p>
          <p><strong>Weight:</strong> {workoutPlan.weight} kg</p>
          <p><strong>Plan:</strong> {workoutPlan.workoutPlan}</p>
          <p><strong>Summary:</strong> {workoutPlan.workoutSummary}</p>
        </div>
      )}
    </div>
  );
};

export default WorkoutPlan;
