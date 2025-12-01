import React from "react";
import { useNavigate } from "react-router-dom";
import bgImage from "../assets/auth-bg.jpg";


const Home = () => {
  const navigate = useNavigate();

  return (
    <div
      style={{
        minHeight: "100vh",
        width: "100%",
        overflowY: "auto",
        backgroundImage: `
          linear-gradient(135deg, rgba(0,0,0,0.45), rgba(0,0,0,0.45)),
          url(${bgImage})
        `,
        backgroundSize: "cover",
        backgroundPosition: "center",
        color: "white",
        fontFamily: "Inter, sans-serif",
      }}
    >
      {/* NAVBAR */}
      <div
        style={{
          width: "100%",
          maxWidth: "1300px",
          margin: "0 auto",
          padding: "0px 0px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          position: "sticky",
          top: 0,
          backdropFilter: "blur(6px)",
          zIndex: 5,
        }}
      >
        <h1 style={{ fontSize: "1.9rem", fontWeight: "900", color: "#ffcd4c" }}>
          MoneyMap
        </h1>

        <div>
          <button
            onClick={() => navigate("/login")}
            style={buttonOutline}
          >
            Login
          </button>

          <button
            onClick={() => navigate("/signup")}
            style={buttonRed}
          >
            Signup
          </button>
        </div>
      </div>

      {/* HERO SECTION */}
      <div
        style={{
          textAlign: "center",
          marginTop: "10px",
          padding: "0 10px",
          animation: "fadeUp 1.2s ease",
        }}
      >
        <h1
          style={{
            fontSize: "3rem",
            fontWeight: "800",
            lineHeight: "1.3",
          }}
        >
          Track Your Money Early with <br />
          <span style={{ color: "#ffd34f" }}>Money Map</span>
        </h1>

        <p
          style={{
            marginTop: "11px",
            fontSize: "1.25rem",
            maxWidth: "650px",
            margin: "auto",
            opacity: 0.9,
            lineHeight: "1.6",
          }}
        >
          Take control of your finances with intuitive tools and guided insights
          that help you improve your financial life.
        </p>

        <button
          onClick={() => navigate("/login")}
          style={buttonGreen}
        >
          Get Started
        </button>
      </div>

      {/* FEATURE CARDS */}
      <div
        style={{
          marginTop: "25px",
          display: "flex",
          justifyContent: "center",
          gap: "25px",
          flexWrap: "wrap",
          paddingBottom: "5px",
        }}
      >
        <div style={{ ...cardStyle, animation: "fadeUp 1.5s ease" }}>
          <div style={iconStyle}>❤️</div>
          <h3 style={cardTitle}>Track Your Heart</h3>
          <p style={cardText}>
            Personalized insights that monitor your financial health and habits.
          </p>
        </div>

        <div style={{ ...cardStyle, animation: "fadeUp 1.8s ease" }}>
          <div style={iconStyle}>📊</div>
          <h3 style={cardTitle}>Monitor Expenses</h3>
          <p style={cardText}>
            Track your expenses easily with clean visual reports and categories.
          </p>
        </div>

        <div style={{ ...cardStyle, animation: "fadeUp 2.1s ease" }}>
          <div style={iconStyle}>🎓</div>
          <h3 style={cardTitle}>Efficient Finance Courses</h3>
          <p style={cardText}>
            Learn smart money management through simple educational content.
          </p>
        </div>
      </div>

      {/* ANIMATION KEYFRAMES */}
      <style>
        {`
          @keyframes fadeUp {
            0% {
              opacity: 0;
              transform: translateY(40px);
            }
            100% {
              opacity: 1;
              transform: translateY(0);
            }
          }

          button:hover {
            transform: scale(1.05);
            transition: 0.25s ease;
          }

          button:active {
            transform: scale(0.96);
          }
        `}
      </style>
    </div>
  );
};

/* ------------------------- BUTTON STYLES ------------------------- */
const buttonOutline = {
  padding: "10px 22px",
  borderRadius: "30px",
  background: "transparent",
  border: "2px solid white",
  color: "white",
  cursor: "pointer",
  marginRight: "10px",
  fontSize: "1rem",
  fontWeight: "600",
  transition: "0.2s ease",
};

const buttonRed = {
  padding: "10px 22px",
  borderRadius: "30px",
  background: "#ff5c5c",
  border: "none",
  color: "white",
  cursor: "pointer",
  fontSize: "1rem",
  fontWeight: "600",
  transition: "0.2s ease",
};

const buttonGreen = {
  marginTop: "25px",
  padding: "14px 40px",
  borderRadius: "30px",
  background: "linear-gradient(135deg, #00e59b, #00c48c)",
  border: "none",
  color: "white",
  fontSize: "1.2rem",
  fontWeight: "700",
  cursor: "pointer",
  transition: "0.3s ease",
  boxShadow: "0px 4px 12px rgba(0,0,0,0.3)",
};

/* ------------------------- CARD STYLE ------------------------- */
const cardStyle = {
  width: "300px",
  padding: "25px",
  borderRadius: "20px",
  background: "rgba(255, 255, 255, 0.08)",
  border: "1px solid rgba(255, 255, 255, 0.15)",
  backdropFilter: "blur(12px)",
  textAlign: "center",
};

const iconStyle = {
  fontSize: "45px",
  marginBottom: "10px",
};

const cardTitle = {
  fontSize: "1.3rem",
  fontWeight: "700",
};

const cardText = {
  opacity: 0.85,
  marginTop: "10px",
  lineHeight: "1.5",
};

export default Home;
