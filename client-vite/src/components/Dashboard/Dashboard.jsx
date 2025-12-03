// client/src/components/Dashboard/Dashboard.js
import React, { useState, useEffect, useCallback } from "react";
import Sidebar from "../Sidebar";
import Modal from "../Modal";
import SummaryBox from "./Summary/SummaryBox";
import AddTransactionForm from "./Transactions/AddTransactionForm";
import TransactionList from "./Transactions/TransactionList";
import IncomeChart from "./Charts/IncomeChart";
import ExpenseChart from "./Charts/ExpenseChart";
import SavingsChart from "./Charts/SavingsChart";
import MonthlyChart from "./Charts/MonthlyChart";
import "./Dashboard.css";
import api from "@/api/axiosConfig";

const Dashboard = ({ username, onLogout }) => {
  const [transactions, setTransactions] = useState([]);
  const [monthlyData, setMonthlyData] = useState({});

  const [incomeModal, setIncomeModal] = useState(false);
  const [expenseModal, setExpenseModal] = useState(false);

  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("userId"); // must be real ObjectId

  // --------------------------------
  // LOAD ALL TRANSACTIONS
  // --------------------------------
  const loadTx = useCallback(async () => {
    try {
      const res = await api.get(`/transactions/${userId}`);



      setTransactions(res.data);
    } catch (err) {
      console.error("Transaction load error:", err);
    }
  }, [token, userId]);

  // --------------------------------
  // LOAD MONTHLY DATA
  // --------------------------------
  const loadMonthly = useCallback(async () => {
    try {
      const today = new Date();
      const year = today.getFullYear();
      const month = String(today.getMonth() + 1).padStart(2, "0");

      const res = await api.get(`/transactions/monthly/${year}/${month}`);

      setMonthlyData(res.data);
    } catch (err) {
      console.error("Monthly load error:", err);
    }
  }, [token, userId]);

  // LOAD ON START
  useEffect(() => {
    loadTx();
    loadMonthly();
  }, [loadTx, loadMonthly]);

  
  // --------------------------------
// MONTHLY SUMMARY VALUES
// --------------------------------
const now = new Date();
const thisYear = now.getFullYear();
const thisMonth = String(now.getMonth() + 1).padStart(2, "0");

const monthlyTx = transactions.filter((t) => {
  const txMonth = t.date.slice(0, 7); // YYYY-MM
  return txMonth === `${thisYear}-${thisMonth}`;
});

const income = monthlyTx
  .filter((t) => t.type === "Income")
  .reduce((a, b) => a + b.amount, 0);

const expense = monthlyTx
  .filter((t) => t.type === "Expense")
  .reduce((a, b) => a + b.amount, 0);
  // --------------------------------
  // FIX: Calculate TODAY Income 
  // --------------------------------
  const todayKey = new Date().toISOString().split("T")[0];

  const todayIncome = transactions
    .filter((t) => t.type === "Income" && t.date.startsWith(todayKey))
    .reduce((a, b) => a + b.amount, 0);

  const todayExpense = transactions
    .filter((t) => t.type === "Expense" && t.date.startsWith(todayKey))
    .reduce((a, b) => a + b.amount, 0);

  return (
    <div className="dash-layout">
      <Sidebar onLogout={onLogout} />

      <div className="dash-main">
        <h2>Welcome, {username}</h2>

        {/* SUMMARY */}
        <div className="summary-row">
          <SummaryBox label="Income" value={income} type="income" />
          <SummaryBox label="Expense" value={expense} type="expense" />
        </div>

        {/* BUTTONS */}
        <div className="btn-row">
          <button onClick={() => setIncomeModal(true)}>Add Income</button>
          <button onClick={() => setExpenseModal(true)}>Add Expense</button>
        </div>

        {/* MONTHLY GRAPH */}
        <MonthlyChart data={monthlyData} />

        {/* TODAY CHARTS */}
        <div className="chart-row">
          <IncomeChart income={todayIncome} />
          <ExpenseChart expense={todayExpense} />
          <SavingsChart income={income} expense={expense} />
        </div>

        <h3 style={{ marginTop: 30 }}>Recent Transactions</h3>
        <TransactionList
         transactions={transactions}
           onDelete={(id) => {
            setTransactions((prev) => prev.filter((t) => t._id !== id));
           loadMonthly();
         }}
/>
      </div>

      {/* INCOME MODAL */}
      <Modal open={incomeModal} onClose={() => setIncomeModal(false)}>
        <h2>Add Income</h2>
        <AddTransactionForm
          type="Income"
          onAdd={() => {
            setIncomeModal(false);
            loadTx();
            loadMonthly();
          }}
        />
      </Modal>

      {/* EXPENSE MODAL */}
      <Modal open={expenseModal} onClose={() => setExpenseModal(false)}>
        <h2>Add Expense</h2>
        <AddTransactionForm
          type="Expense"
          onAdd={() => {
            setExpenseModal(false);
            loadTx();
            loadMonthly();
          }}
        />
      </Modal>
    </div>
  );
};

export default Dashboard;
