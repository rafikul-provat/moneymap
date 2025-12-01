// src/components/Dashboard/Charts/SavingsChart.jsx
import React from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Label,
} from "recharts";

const SavingsChart = ({ income, expense }) => {
  const savings = income - expense;
  const safeSavings = savings < 0 ? 0 : savings;

  // Savings percentage
  const percentage = income > 0 ? ((safeSavings / income) * 100).toFixed(1) : 0;

  // Determine status
  let status = "";
  let statusColor = "";

  if (percentage > 0 && percentage <= 5) {
    status = "Poor";
    statusColor = "#dc2626";
  } else if (percentage > 5 && percentage <= 10) {
    status = "Moderate";
    statusColor = "#f59e0b";
  } else if (percentage > 10 && percentage <= 20) {
    status = "Good";
    statusColor = "#10b981";
  } else if (percentage > 20 && percentage <= 25) {
    status = "Excellent";
    statusColor = "#3b82f6";
  } else if (percentage > 25) {
    status = "Extraordinary";
    statusColor = "#8b5cf6";
  }

  const data = [
    { name: "Income", value: income },
    { name: "Expense", value: expense },
    { name: "Savings", value: safeSavings },
  ];

  const COLORS = ["#22c55e", "#ef4444", "#3b82f6"];

  return (
    <div
      className="chart-box"
      style={{
        background: "#ffffff",
        borderRadius: "14px",
        padding: "20px",
        boxShadow: "0 6px 20px rgba(0,0,0,0.08)",
        position: "relative",
      }}
    >
      {/* STATUS BADGE (Top-right corner) */}
      <div
        style={{
          position: "absolute",
          top: "14px",
          right: "16px",
          background: statusColor,
          color: "white",
          padding: "4px 12px",
          borderRadius: "8px",
          fontSize: "13px",
          fontWeight: "600",
        }}
      >
        {status} ({percentage}%)
      </div>

      <h4
        style={{
          marginBottom: "10px",
          fontSize: "18px",
          fontWeight: "600",
          color: "#1e293b",
        }}
      >
        Savings
      </h4>

      <ResponsiveContainer width="100%" height={250}>
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            innerRadius={60}
            outerRadius={90}
            paddingAngle={2}
            stroke="none"
          >
            {data.map((entry, index) => (
              <Cell key={index} fill={COLORS[index]} />
            ))}

            <Label
              value={`৳ ${safeSavings.toLocaleString()}`}
              position="center"
              style={{
                fontSize: "18px",
                fill: "#1e293b",
                fontWeight: "700",
              }}
            />
          </Pie>

          <Tooltip
            contentStyle={{
              borderRadius: "8px",
              background: "#f8fafc",
              border: "1px solid #e2e8f0",
              color: "#1e293b",
            }}
          />
        </PieChart>
      </ResponsiveContainer>

      {/* Legends */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-around",
          marginTop: "10px",
          fontSize: "14px",
          fontWeight: "500",
        }}
      >
        <span style={{ color: COLORS[0] }}>● Income</span>
        <span style={{ color: COLORS[1] }}>● Expense</span>
        <span style={{ color: COLORS[2] }}>● Savings</span>
      </div>
    </div>
  );
};

export default SavingsChart;
