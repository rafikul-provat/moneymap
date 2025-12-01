import React from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer
} from "recharts";

const MonthlyChart = ({ data }) => {
  if (!data || Object.keys(data).length === 0) return null;

  // Extract dates
  const sortedKeys = Object.keys(data).sort();

  // Get year + month
  const [year, month] = sortedKeys[0].split("-").map(Number);
  const totalDays = new Date(year, month, 0).getDate();

  // Prepare daily income/expense (default 0)
  let daily = Array(totalDays + 1).fill(null).map(() => ({
    income: 0,
    expense: 0
  }));

  // Insert real values
  sortedKeys.forEach(dateStr => {
    const day = Number(dateStr.split("-")[2]);
    daily[day] = {
      income: data[dateStr].income || 0,
      expense: data[dateStr].expense || 0
    };
  });

  // Build cumulative chart data
  let cumulativeIncome = 0;
  let cumulativeExpense = 0;
  let chartData = [];

  for (let d = 1; d <= totalDays; d++) {
    cumulativeIncome = daily[d].income;
    cumulativeExpense = daily[d].expense;

    chartData.push({
      day: d,
      income: cumulativeIncome,
      expense: cumulativeExpense
    });
  }

  return (
    <div className="chart-box">
      <h4>Monthly Cumulative Graph</h4>

      <ResponsiveContainer width="100%" height={280}>
        <AreaChart data={chartData}>

          <defs>
            <linearGradient id="greenFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="rgba(0,200,83,0.4)" />
              <stop offset="100%" stopColor="rgba(0,200,83,0.05)" />
            </linearGradient>

            <linearGradient id="redFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="rgba(213,0,0,0.4)" />
              <stop offset="100%" stopColor="rgba(213,0,0,0.05)" />
            </linearGradient>
          </defs>

          <XAxis dataKey="day" />
          <YAxis />

          <Tooltip />

          <Area
            type="monotone"
            dataKey="income"
            stroke="#00C853"
            fill="url(#greenFill)"
            strokeWidth={3}
          />

          <Area
            type="monotone"
            dataKey="expense"
            stroke="#D50000"
            fill="url(#redFill)"
            strokeWidth={3}
          />

        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default MonthlyChart;
