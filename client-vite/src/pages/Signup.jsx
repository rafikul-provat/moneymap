import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import bgImage from "../assets/auth-bg.jpg";
import api from "../api/axiosConfig";

const Signup = () => {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const handleSignup = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await api.post("/auth/register", {
        username: name,
        email,
        password,
      });

      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.message || "Signup failed");
    }
  };

  return (
    <div
      style={{
        backgroundImage: `url(${bgImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        height: "100vh",
        width: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "400px",
          background: "rgba(255,255,255,0.15)",
          padding: "30px",
          borderRadius: "16px",
          boxShadow: "0 8px 20px rgba(0,0,0,0.3)",
          backdropFilter: "blur(6px)",
          color: "white",
          animation: "fadeIn 1s ease",
        }}
      >
        <h2
          style={{
            textAlign: "center",
            animation: "slideDown 0.8s ease",
            fontWeight: "800",
            marginBottom: "18px",
          }}
        >
          Sign Up
        </h2>

        {error && (
          <p
            style={{
              color: "yellow",
              textAlign: "center",
              animation: "shake 0.4s ease",
            }}
          >
            {error}
          </p>
        )}

        <form onSubmit={handleSignup}>
          {/* Full Name */}
          <input
            type="text"
            placeholder="Full Name"
            className="input-anim"
            style={inputStyle}
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

          {/* Email */}
          <input
            type="email"
            placeholder="Email"
            className="input-anim"
            style={inputStyle}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          {/* Password + Eye Icon */}
          <div style={{ position: "relative", width: "100%" }}>
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              className="input-anim"
              style={inputStyle}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <span
              onClick={() => setShowPassword(!showPassword)}
              style={{
                position: "absolute",
                right: "14px",
                top: "15%",
                transform: "translateY(-50%)",
                cursor: "pointer",
                userSelect: "none",
                fontSize: "24px",
                color: "#555",
              }}
            >
              {showPassword ? "🙊" : "🙈"}
            </span>
          </div>

          <button type="submit" className="btn-anim" style={btnStyle}>
            Create Account
          </button>
        </form>

        <p style={{ textAlign: "center", marginTop: "15px" }}>
          Already have an account?{" "}
          <span
            style={{ cursor: "pointer", color: "#facc15" }}
            onClick={() => navigate("/login")}
          >
            Login
          </span>
        </p>
      </div>

      {/* Animations */}
      <style>{`
        @keyframes fadeIn {
          0% { opacity: 0; transform: scale(0.95); }
          100% { opacity: 1; transform: scale(1); }
        }

        @keyframes slideDown {
          0% { opacity: 0; transform: translateY(-15px); }
          100% { opacity: 1; transform: translateY(0); }
        }

        @keyframes shake {
          0% { transform: translateX(0); }
          25% { transform: translateX(-4px); }
          50% { transform: translateX(4px); }
          75% { transform: translateX(-4px); }
          100% { transform: translateX(0); }
        }

        .input-anim:focus {
          outline: none;
          border-color: #10b981 !important;
          box-shadow: 0 0 12px rgba(16,185,129,0.8);
          background: #ffffff;
          transform: scale(1.01);
          transition: 0.25s ease;
        }

        .btn-anim:hover {
          transform: scale(1.07);
          transition: 0.25s ease;
        }

        .btn-anim:active {
          transform: scale(0.94);
        }
      `}</style>
    </div>
  );
};

const inputStyle = {
  width: "100%",
  padding: "12px",
  marginBottom: "18px",
  borderRadius: "10px",
  border: "1px solid rgba(0,0,0,0.3)",
  fontSize: "1rem",
  background: "#ffffff",
  color: "#000000",
  boxSizing: "border-box",
  transition: "0.25s ease",
};

const btnStyle = {
  width: "100%",
  padding: "12px",
  backgroundColor: "#10b981",
  color: "white",
  fontSize: "1.1rem",
  border: "none",
  borderRadius: "10px",
  cursor: "pointer",
  transition: "0.25s ease",
};

export default Signup;
