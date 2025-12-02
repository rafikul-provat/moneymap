import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import bgImage from "../assets/auth-bg.jpg";
import api from "../api/axiosConfig";


const Login = ({ onLoginSuccess }) => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
  e.preventDefault();
  setError("");

  try {
    const res = await api.post("/auth/login", { email, password });

    localStorage.setItem("token", res.data.token);
    localStorage.setItem("userId", res.data.userId);
    localStorage.setItem("username", res.data.username);

    onLoginSuccess(res.data.username);
    navigate("/dashboard");
  } catch (err) {
    setError("Invalid email or password");
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
        padding: "0px",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "400px",
          background: "rgba(255,255,255,0.15)",
          padding: "30px",
          borderRadius: "16px",
          backdropFilter: "blur(5px)",
          color: "white",
          boxShadow: "0 8px 25px rgba(0,0,0,0.4)",
          animation: "fadeIn 1s ease",
        }}
      >
        <h2
          style={{
            textAlign: "center",
            marginBottom: "15px",
            animation: "slideDown 0.7s ease",
          }}
        >
          Login
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

        <form onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            style={inputStyle}
            className="input-anim"
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            style={inputStyle}
            className="input-anim"
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button type="submit" style={btnStyle} className="btn-anim">
            Login
          </button>
        </form>

        <p style={{ textAlign: "center", marginTop: "10px" }}>
          Don't have an account?{" "}
          <span
            style={{ color: "#facc15", cursor: "pointer" }}
            onClick={() => navigate("/signup")}
          >
            Signup
          </span>
        </p>
      </div>

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
          border-color: #3b82f6 !important;
          background: white;
          box-shadow: 0 0 12px rgba(59,130,246,0.8);
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
  border: "1px solid rgba(0,0,0,0.35)",
  background: "#ffffff",
  color: "#000000",
  fontSize: "1rem",
  boxSizing: "border-box",
  transition: "0.25s ease",
};

const btnStyle = {
  width: "100%",
  padding: "12px",
  fontSize: "1.1rem",
  backgroundColor: "#3b82f6",
  color: "white",
  border: "none",
  borderRadius: "10px",
  cursor: "pointer",
  transition: "0.25s ease",
};

export default Login;
