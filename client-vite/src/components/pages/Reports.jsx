import React, { useEffect, useState, useMemo } from "react";
import api from "@/api/axiosConfig";
import Sidebar from "../Sidebar";

// ✅ ADD THESE TWO LINES
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

// PREMIUM COLORS
const COLORS = [
  "#6366F1", // Indigo
  "#06B6D4", // Cyan
  "#EC4899", // Pink
  "#F59E0B", // Amber
  "#10B981", // Emerald
  "#8B5CF6", // Violet
];

const formatCurrency = (n) =>
  n == null ? "BDT 0" : `BDT ${Number(n).toLocaleString()}`;

const formatPDFMoney = (n) =>
  n == null ? "BDT 0" : `BDT ${Number(n).toLocaleString()}`;

const Reports = () => {
  const token = localStorage.getItem("token");

  const [month, setMonth] = useState(() => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
  });

  const [transactions, setTransactions] = useState([]);
  const [categoryData, setCategoryData] = useState([]);
  const [summary, setSummary] = useState({
    totalIncome: 0,
    totalExpense: 0,
    wallet: 0,
  });
  const [loading, setLoading] = useState(false);

  /* ======================= EXPORT PDF ======================= */
  const exportPDF = () => {
    if (!transactions.length) {
      alert("No data to export");
      return;
    }

    const doc = new jsPDF("p", "mm", "a4");
    doc.setCharSpace(0); // FIX digit spacing

    const pageWidth = doc.internal.pageSize.width;
    let y = 15;

    /* ---------- HEADER ---------- */
    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    doc.text("Money Map", pageWidth - 14, y, { align: "right" });

    y += 8;
    doc.setFontSize(12);
    doc.text("Statement of Accounts", pageWidth - 14, y, { align: "right" });

    y += 6;
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text(`Period: ${month}`, pageWidth - 14, y, { align: "right" });

    /* ---------- TO ---------- */
    let leftY = 45;
    doc.text("To,", 14, leftY);
    doc.text("Customer", 14, (leftY += 5));
    doc.text("Dhaka, Bangladesh", 14, (leftY += 5));

    /* ---------- SUMMARY BOX ---------- */
    const boxY = 45;
    doc.setDrawColor(120);
    doc.rect(pageWidth - 90, boxY, 76, 30);

    doc.setFont("helvetica", "bold");
    doc.text("Account Summary", pageWidth - 86, boxY + 6);

    doc.setFont("helvetica", "normal");

    doc.text("Total Income", pageWidth - 86, boxY + 18);
    doc.text(formatPDFMoney(summary.totalIncome), pageWidth - 18, boxY + 18, {
      align: "right",
    });

    doc.text("Total Expense", pageWidth - 86, boxY + 24);
    doc.text(formatPDFMoney(summary.totalExpense), pageWidth - 18, boxY + 24, {
      align: "right",
    });

    doc.setFont("helvetica", "bold");
    doc.text("Balance Due", pageWidth - 86, boxY + 30);
    doc.text(formatPDFMoney(summary.wallet), pageWidth - 18, boxY + 30, {
      align: "right",
    });

    /* ---------- TABLE DATA ---------- */
    let balance = 0;
    const tableData = [
      [`${month}-01`, "Opening Balance", "", "", "BDT 0.00"],
    ];

    transactions.forEach((t) => {
      balance += t.type === "Income" ? t.amount : -t.amount;
      tableData.push([
        t.date.slice(0, 10),
        t.title,
        t.type === "Expense" ? formatPDFMoney(t.amount) : "",
        t.type === "Income" ? formatPDFMoney(t.amount) : "",
        formatPDFMoney(balance),
      ]);
    });

    /* ---------- TABLE ---------- */
    autoTable(doc, {
      startY: 90,
      head: [["Date", "Description", "Debit", "Credit", "Balance"]],
      body: tableData,
      theme: "grid",
      styles: {
        fontSize: 10,
        cellPadding: 4,
        valign: "middle",
      },
      headStyles: {
        fillColor: [60, 60, 60],
        textColor: 255,
        halign: "center",
      },
      columnStyles: {
        0: { cellWidth: 30 },
        1: { cellWidth: 60 },
        2: { cellWidth: 30, halign: "right" },
        3: { cellWidth: 30, halign: "right" },
        4: { cellWidth: 32, halign: "right" },
      },
    });

    /* ---------- FOOTER ---------- */
    doc.setFontSize(9);
    doc.text(
      "This is a system generated statement. No signature is required.",
      pageWidth / 2,
      290,
      { align: "center" }
    );

    doc.save(`MoneyMap_Statement_${month}.pdf`);
  };


  // ---------------- LOAD REPORT ----------------
  useEffect(() => {
    const load = async () => {
      setLoading(true);

      try {
       const res = await api.get(`/transactions/monthly-report?month=${month}`);

        const data = res.data;
        setTransactions(data.transactions || []);
        setSummary({
          totalIncome: data.totalIncome || 0,
          totalExpense: data.totalExpense || 0,
          wallet: data.wallet || 0,
        });

        setCategoryData(data.categoryBreakdown || []);
      } catch (err) {
        console.log("Failed to load report:", err);
      }

      setLoading(false);
    };

    load();
  }, [month, token]);

  // ---------------- WEEKLY BAR CHART ----------------
  const weeklyData = useMemo(() => {
    const result = [
      { name: "Week 1", income: 0, expense: 0 },
      { name: "Week 2", income: 0, expense: 0 },
      { name: "Week 3", income: 0, expense: 0 },
      { name: "Week 4", income: 0, expense: 0 },
    ];

    transactions.forEach((t) => {
      const day = new Date(t.date).getDate();
      const weekIndex = Math.min(Math.floor((day - 1) / 7), 3);

      if (t.type === "Income") result[weekIndex].income += t.amount;
      else result[weekIndex].expense += t.amount;
    });

    return result;
  }, [transactions]);

  // ---------------- TOP EXPENSES ----------------
  const topExpenses = useMemo(() => {
    const map = {};

    transactions.forEach((t) => {
      if (t.type !== "Expense") return;
      map[t.title] = (map[t.title] || 0) + t.amount;
    });

    return Object.entries(map)
      .map(([title, value]) => ({ title, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 6);
  }, [transactions]);

  return (
    <div style={{ display: "flex", height: "100vh", overflow: "hidden" }}>
      <Sidebar />

      {/* MAIN PAGE AREA */}
      <main
        style={{
          flex: 1,
          padding: 32,
          overflowY: "auto",
          background: "linear-gradient(to bottom right, #F8FAFC, #EEF2FF)",
        }}
      >
        <div style={{ maxWidth: 1250, margin: "0 auto" }}>
          <h1
            style={{
              marginBottom: 15,
              fontWeight: 700,
              fontSize: 26,
              color: "#1E293B",
            }}
          >
            📊 Monthly Financial Report
          </h1>

          {/* MONTH SELECTOR */}
          <div
  style={{
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 25,
  }}
>
  {/* MONTH SELECTOR */}
  <div>
    <label style={{ marginRight: 12, fontWeight: 500 }}>
      Select Month:
    </label>
    <input
      type="month"
      value={month}
      onChange={(e) => setMonth(e.target.value)}
      style={{
        padding: "10px 14px",
        borderRadius: 10,
        border: "1px solid #CBD5E1",
        fontSize: 15,
      }}
    />
  </div>

  {/* EXPORT PDF BUTTON */}
  <button
    onClick={exportPDF}
    style={{
      padding: "10px 16px",
      background: "#2563EB",
      color: "white",
      border: "none",
      borderRadius: 10,
      cursor: "pointer",
      fontWeight: 500,
    }}
  >
    📄 Export PDF
  </button>
</div>


          {/* ---------------- SUMMARY CARDS ---------------- */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3,1fr)",
              gap: 20,
              marginBottom: 30,
            }}
          >
            {/* INCOME */}
            <div
              style={{
                background: "linear-gradient(135deg,#10B981,#34D399)",
                padding: 26,
                borderRadius: 18,
                color: "white",
                boxShadow: "0 12px 30px rgba(16,185,129,0.25)",
              }}
            >
              <h4 style={{ opacity: 0.9 }}>Total Income</h4>
              <h1 style={{ fontSize: 32 }}>{formatCurrency(summary.totalIncome)}</h1>
            </div>

            {/* EXPENSE */}
            <div
              style={{
                background: "linear-gradient(135deg,#EF4444,#F87171)",
                padding: 26,
                borderRadius: 18,
                color: "white",
                boxShadow: "0 12px 30px rgba(239,68,68,0.25)",
              }}
            >
              <h4 style={{ opacity: 0.9 }}>Total Expense</h4>
              <h1 style={{ fontSize: 32 }}>{formatCurrency(summary.totalExpense)}</h1>
            </div>

            {/* SAVINGS */}
            <div
              style={{
                background: "linear-gradient(135deg,#3B82F6,#60A5FA)",
                padding: 26,
                borderRadius: 18,
                color: "white",
                boxShadow: "0 12px 30px rgba(59,130,246,0.25)",
              }}
            >
              <h4 style={{ opacity: 0.9 }}>Net Savings</h4>
              <h1 style={{ fontSize: 32 }}>{formatCurrency(summary.wallet)}</h1>
            </div>
          </div>

          {/* ---------------- WEEKLY CHART ---------------- */}
          <div
            style={{
              background: "white",
              padding: 22,
              borderRadius: 18,
              marginBottom: 30,
              boxShadow: "0 8px 20px rgba(0,0,0,0.08)",
            }}
          >
            <h3 style={{ marginBottom: 10 }}>Income vs Expense (Weekly)</h3>

            <div style={{ width: "100%", height: 330 }}>
  <ResponsiveContainer>
    <BarChart data={weeklyData}>
      
      {/* Light grid */}
      <CartesianGrid strokeDasharray="3 3" opacity={0.15} />

      <XAxis dataKey="name" tick={{ fontSize: 13, fill: "#475569" }} />
      <YAxis tick={{ fontSize: 13, fill: "#475569" }} />
      <Tooltip
        contentStyle={{
          background: "#ffffff",
          borderRadius: 12,
          border: "1px solid #e2e8f0",
        }}
      />

      {/* GRADIENT DEFINITIONS */}
      <defs>
        <linearGradient id="incomeGradient" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#02248cff" stopOpacity="0.85" />
          <stop offset="100%" stopColor="#244ae233" stopOpacity="0.3" />
        </linearGradient>

        <linearGradient id="expenseGradient" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#e67a14ff" stopOpacity="0.85" />
          <stop offset="100%" stopColor="#eb780d33" stopOpacity="0.3" />
        </linearGradient>
      </defs>

      {/* INCOME BAR */}
      <Bar
        dataKey="income"
        fill="url(#incomeGradient)"
        radius={[6, 6, 0, 0]}
        barSize={60}
      />

      {/* EXPENSE BAR */}
      <Bar
        dataKey="expense"
        fill="url(#expenseGradient)"
        radius={[6, 6, 0, 0]}
        barSize={60}
      />
    </BarChart>
  </ResponsiveContainer>
</div>

          </div>

          {/* ---------------- TOP EXPENSES ---------------- */}
          <div
            style={{
              background: "white",
              padding: 22,
              borderRadius: 18,
              marginBottom: 30,
              boxShadow: "0 8px 20px rgba(0,0,0,0.08)",
            }}
          >
            <h3 style={{ marginBottom: 15 }}>Top Expenses</h3>

            <ul style={{ listStyle: "none", margin: 0, padding: 0 }}>
              {topExpenses.length === 0 && (
                <p style={{ color: "#94A3B8" }}>No expenses this month.</p>
              )}

              {topExpenses.map((t, i) => (
                <li
                  key={i}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    padding: "10px 5px",
                    borderBottom: "1px solid #E2E8F0",
                  }}
                >
                  <span>{t.title}</span>
                  <strong>{formatCurrency(t.value)}</strong>
                </li>
              ))}
            </ul>
          </div>

          {/* ---------------- CATEGORY PIE + TX LIST ---------------- */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 28,
            }}
          >
            {/* PIE CHART */}
            <div
              style={{
                background: "white",
                padding: 22,
                borderRadius: 18,
                boxShadow: "0 8px 20px rgba(0,0,0,0.08)",
              }}
            >
              <h3 style={{ marginBottom: 15 }}>Spending by Category</h3>

              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={categoryData}
                    dataKey="value"
                    nameKey="category"
                    innerRadius={55}
                    outerRadius={90}
                    label
                  >
                    {categoryData.map((_, i) => (
                      <Cell key={i} fill={COLORS[i % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* TX TABLE */}
            <div
              style={{
                background: "white",
                padding: 22,
                borderRadius: 18,
                boxShadow: "0 8px 20px rgba(0,0,0,0.08)",
              }}
            >
              <h3>Transactions</h3>

              <table style={{ width: "100%", marginTop: 10 }}>
                <thead>
                  <tr>
                    <th align="left">Title</th>
                    <th align="left">Amount</th>
                    <th align="left">Type</th>
                    <th align="left">Date</th>
                  </tr>
                </thead>

                <tbody>
                  {transactions.length === 0 && (
                    <tr>
                      <td colSpan="4" style={{ padding: 12, color: "#94A3B8" }}>
                        No transactions
                      </td>
                    </tr>
                  )}

                  {transactions.map((t) => (
                    <tr key={t._id} style={{ height: 38 }}>
                      <td>{t.title}</td>
                      <td>{formatCurrency(t.amount)}</td>
                      <td
                        style={{
                          color: t.type === "Income" ? "#059669" : "#DC2626",
                          fontWeight: 600,
                        }}
                      >
                        {t.type}
                      </td>
                      <td>{t.date.slice(0, 10)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Reports;
