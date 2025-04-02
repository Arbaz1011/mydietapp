// src/pages/Home.js
import React from "react";
import "./Home.css";

const Home = () => {
  return (
    <div className="home-container">
      <h1>Welcome to <span className="highlight">DietApp</span></h1>
      <p className="subtitle">Your personal diet and fitness tracker.</p>
      
      <div className="features">
        <div className="feature-box">
          <h3>📏 BMI Calculation</h3>
          <p>Track your Body Mass Index and stay on top of your health.</p>
        </div>
        <div className="feature-box">
          <h3>🥗 Personalized Meal Plans</h3>
          <p>Get customized meal plans tailored to your fitness goals.</p>
        </div>
      </div>
    </div>
  );
};

export default Home;
