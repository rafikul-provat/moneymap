import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

import Home from "./pages/Home.jsx";
import Login from "./pages/Login.jsx";
import Signup from "./pages/Signup.jsx";
import Dashboard from "./components/Dashboard/Dashboard.jsx";
import Reports from "./components/pages/Reports.jsx";
import Tax from "./components/pages/Tax.jsx";
import Wallet from "./components/pages/Wallet.jsx";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    const savedUser = localStorage.getItem("username");

    if (!token || !savedUser) {
      setIsLoggedIn(false);
      return;
    }

    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      const now = Date.now() / 1000;

      if (payload.exp && payload.exp < now) {
        localStorage.removeItem("token");
        localStorage.removeItem("username");
        setIsLoggedIn(false);
        return;
      }

      setIsLoggedIn(true);
      setUsername(savedUser);
    } catch (e) {
      localStorage.clear();
      setIsLoggedIn(false);
    }
  }, []);

  const handleLoginSuccess = (username) => {
    setIsLoggedIn(true);
    setUsername(username);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    setIsLoggedIn(false);
  };

  return (
    <Router>
      <Routes>

        {/* PUBLIC ROUTES */}
        <Route path="/" element={<Home />} />

        <Route
          path="/login"
          element={
            isLoggedIn ? (
              <Navigate to="/dashboard" />
            ) : (
              <Login onLoginSuccess={handleLoginSuccess} />
            )
          }
        />

        <Route
          path="/signup"
          element={
            isLoggedIn ? (
              <Navigate to="/dashboard" />
            ) : (
              <Signup onSignupSuccess={handleLoginSuccess} />
            )
          }
        />

        {/* PROTECTED ROUTES */}
        <Route
          path="/dashboard"
          element={
            isLoggedIn ? (
              <Dashboard username={username} onLogout={handleLogout} />
            ) : (
              <Navigate to="/login" />
            )
          }
        />

        <Route
          path="/reports"
          element={
            isLoggedIn ? (
              <Reports onLogout={handleLogout} />
            ) : (
              <Navigate to="/login" />
            )
          }
        />

        <Route
          path="/tax"
          element={
            isLoggedIn ? (
              <Tax onLogout={handleLogout} />
            ) : (
              <Navigate to="/login" />
            )
          }
        />

        <Route
          path="/wallet"
          element={
            isLoggedIn ? (
              <Wallet onLogout={handleLogout} />
            ) : (
              <Navigate to="/login" />
            )
          }
        />

        {/* CATCH ALL */}
        <Route path="*" element={<Navigate to="/" />} />

      </Routes>
    </Router>
  );
}

export default App;
