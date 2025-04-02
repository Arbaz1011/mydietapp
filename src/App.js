import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Register from './components/Register';
import Login from './components/Login';
import ResetPassword from './components/ResetPassword';
import Navbar from './components/Navbar';
import Logout from './components/Logout';
import Home from './Pages/Home';
import MealPlan from './Pages/MealPlan';
import NearbyNutritionShops from './Pages/NearbyNutritionShops'; 
import WorkoutPlan from './Pages/WorkoutPlan'; // ✅ Import Workout Plan page

import 'font-awesome/css/font-awesome.min.css';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
    const accessToken = localStorage.getItem('accessToken');
    return accessToken ? children : <Navigate to="/login" />;
};

function App() {
    const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('accessToken'));

    useEffect(() => {
        const token = localStorage.getItem('accessToken');
        setIsAuthenticated(!!token);
    }, []);

    const handleLogin = (accessToken, idToken) => {
        localStorage.setItem('accessToken', accessToken);
        localStorage.setItem('idToken', idToken);
        setIsAuthenticated(true);
    };

    const handleLogout = () => {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('idToken');
        setIsAuthenticated(false);
    };

    return (
        <Router>
            <div>
                {/* Show Navbar only if user is authenticated */}
                {isAuthenticated && <Navbar />}

                <Routes>
                    {/* Home Page Redirects Correctly After Login */}
                    <Route path="/" element={isAuthenticated ? <Home /> : <Navigate to="/login" />} />

                    {/* Public Routes */}
                    <Route path="/login" element={<Login onLogin={handleLogin} />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/forgot-password" element={<ResetPassword />} />

                    {/* Protected Routes */}
                    <Route
                        path="/meal-plan"
                        element={
                            <ProtectedRoute>
                                <MealPlan />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/nearby-nutrition-shops"
                        element={
                            <ProtectedRoute>
                                <NearbyNutritionShops />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/workout-plan" // ✅ Added Workout Plan route
                        element={
                            <ProtectedRoute>
                                <WorkoutPlan />
                            </ProtectedRoute>
                        }
                    />
                    <Route path="/logout" element={<Logout onLogout={handleLogout} />} />

                    {/* Fallback Route */}
                    <Route path="*" element={<Navigate to={isAuthenticated ? "/" : "/login"} />} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;
