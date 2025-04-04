// src/components/Navbar.js
import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "./Navbar.css";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Hide navbar on login and register pages
  if (location.pathname === "/login" || location.pathname === "/register") {
    return null;
  }

  const handleLogout = () => {
    localStorage.clear(); // Clear authentication tokens
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="nav-logo">
          DietApp
        </Link>
        <ul className="nav-menu">
          <li><Link to="/">Home</Link></li>
          <li><Link to="/meal-plan">Meal Plan</Link></li>
          <li><Link to="/nearby-nutrition-shops">Nearby Nutrition Shops</Link></li>
          <li><Link to="/workout-plan">Workout Plan</Link></li>
          <li><button onClick={handleLogout} className="logout-btn">Logout</button></li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
