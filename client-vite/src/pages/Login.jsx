import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import bgImage from "../assets/auth-bg.jpg";
import api from "../api/axiosConfig";

const Login = ({ onLoginSuccess }) => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  // -----------------------------
  // GOOGLE LOGIN CALLBACK
  // -----------------------------
  const handleGoogleResponse = async (response) => {
    try {
      const res = await api.post("/auth/google", {
        token: response.credential,
      });

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("userId", res.data.userId);
      localStorage.setItem("username", res.data.username);

      onLoginSuccess(res.data.username);
      navigate("/dashboard");
    } catch (err) {
      console.error(err);
      setError("Google login failed");
    }
  };

  // -----------------------------
  // INIT GOOGLE SIGN-IN
  // -----------------------------
  useEffect(() => {
    if (window.google && import.meta.env.VITE_GOOGLE_CLIENT_ID) {
      window.google.accounts.id.initialize({
        client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID, // ✅ FIXED
        callback: handleGoogleResponse,
      });

      window.google.accounts.id.renderButton(
        document.getElementById("googleBtn"),
        {
          theme: "outline",
          size: "large",
          width: 300,
        }
      );
    }
  }, []);

  // -----------------------------
  // EMAIL / PASSWORD LOGIN
  // -----------------------------
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
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div
        style={{
          maxWidth: "400px",
          width: "100%",
          padding: "30px",
          background: "rgba(255,255,255,0.15)",
          backdropFilter: "blur(5px)",
          borderRadius: "16px",
          color: "white",
        }}
      >
        <h2 style={{ textAlign: "center" }}>Login</h2>

        {error && <p style={{ color: "yellow" }}>{error}</p>}

        <form onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            style={inputStyle}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <div style={{ position: "relative" }}>
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              style={inputStyle}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <span
              onClick={() => setShowPassword(!showPassword)}
              style={{
                position: "absolute",
                right: "14px",
                top: "15%",
                cursor: "pointer",
                fontSize: "22px",
              }}
            >
              {showPassword ? "🙊" : "🙈"}
            </span>
          </div>

          <button type="submit" style={btnStyle}>
            Login
          </button>
        </form>

        {/* Divider */}
        <div style={{ textAlign: "center", margin: "15px 0" }}>
          — OR —
        </div>

        {/* Google Button */}
        <div
          id="googleBtn"
          style={{ display: "flex", justifyContent: "center" }}
        ></div>

        <p style={{ textAlign: "center", marginTop: "10px" }}>
          Don&apos;t have an account?{" "}
          <span
            style={{ color: "#facc15", cursor: "pointer" }}
            onClick={() => navigate("/signup")}
          >
            Signup
          </span>
        </p>
      </div>
    </div>
  );
};

// -----------------------------
// STYLES
// -----------------------------
const inputStyle = {
  width: "100%",
  padding: "12px",
  marginBottom: "18px",
  borderRadius: "10px",
  border: "1px solid #ccc",
};

const btnStyle = {
  width: "100%",
  padding: "12px",
  background: "#3b82f6",
  color: "#fff",
  border: "none",
  borderRadius: "10px",
  cursor: "pointer",
};

export default Login;
