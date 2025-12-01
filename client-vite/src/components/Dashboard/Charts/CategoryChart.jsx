import React from "react";

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const CategoryChart = ({ transactions }) => {
  const totals = {};

  transactions.forEach((t) => {
    if (t.type === "Expense") {
      totals[t.category] = (totals[t.category] || 0) + t.amount;
    }
  });

  const data = Object.keys(totals).map((key) => ({
    name: key,
    value: totals[key],
  }));

  const COLORS = ["#ef4444", "#f59e0b", "#10b981", "#3b82f6", "#6366f1", "#8b5cf6"];

  return (
    <div className="chart-box">
      <h4>Expenses by Category</h4>

      <ResponsiveContainer width="100%" height={260}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            dataKey="value"
            outerRadius={100}
            label
          >
            {data.map((_, i) => (
              <Cell key={i} fill={COLORS[i % COLORS.length]} />
            ))}
          </Pie>

          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default CategoryChart;
