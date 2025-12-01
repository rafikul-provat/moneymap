// AddTransactionForm.js
import React, { useState } from "react";

import "./AddTransactionForm.css";
import api from "@/api/axiosConfig";

const AddTransactionForm = ({ type, onAdd }) => {
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState("");
  const [note, setNote] = useState("");
  const [category, setCategory] = useState("");

  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("userId");

  // ------------------------------
  // 🚀 FIX: Date handling without timezone issues
  // ------------------------------
  const isValidDate = (input) => {
    if (!input) return false;

    // YYYY-MM-DD → check if valid manually
    const [y, m, d] = input.split("-").map(Number);
    const test = new Date(y, m - 1, d);

    return (
      test.getFullYear() === y &&
      test.getMonth() === m - 1 &&
      test.getDate() === d
    );
  };

  const today = new Date().toISOString().split("T")[0]; // CLEAN YYYY-MM-DD

  const submit = async (e) => {
    e.preventDefault();

    // 1️⃣ Validate date format
    if (!isValidDate(date)) {
      alert("Invalid date format. Please select a valid date.");
      return;
    }

    // 2️⃣ Prevent future dates
    if (date > today) {
      alert("Future transactions are not allowed.");
      return;
    }

    try {
      const res = await api.post("/transactions",
        {
          userId,
          title,
          amount: Number(amount),
          type,
          date, // ✔ EXACT YYYY-MM-DD (never shifts)
          note,
          ...(type === "Expense" && { category }),
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      // Reset
      setTitle("");
      setAmount("");
      setDate("");
      setNote("");
      setCategory("Food");

      onAdd(res.data); // send added transaction to parent

    } catch (err) {
      console.error("Add transaction failed:", err);
      alert("Failed to add transaction");
    }
  };

  return (
    <form className="tx-form" onSubmit={submit}>
      <label>Title</label>
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />

      <label>Amount</label>
      <input
        type="number"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        required
      />

      <label>Date</label>
      <input
        type="date"
        value={date}
        max={today}
        onChange={(e) => setDate(e.target.value)}
        required
      />

      {type === "Expense" && (
  <>
    <label>Category</label>
    <select
      value={category}
      onChange={(e) => setCategory(e.target.value)}
      required
    >
      <option value="" disabled>Select Category</option>
      <option value="Food">Food</option>
      <option value="Shopping">Shopping</option>
      <option value="Transport">Transport</option>
      <option value="Bills">Bills</option>
      <option value="Health">Health</option>
      <option value="Entertainment">Entertainment</option>
      <option value="Other">Other</option>
    </select>
  </>
)}


      <label>Note</label>
      <textarea
        value={note}
        onChange={(e) => setNote(e.target.value)}
      />

      <button className="tx-btn">Add {type}</button>
    </form>
  );
};

export default AddTransactionForm;
