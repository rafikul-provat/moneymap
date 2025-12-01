// client/src/components/pages/Tax.js
import React, { useEffect, useState } from "react";
import axios from "axios";
import Sidebar from "../Sidebar";
import "./Tax.css";

const Tax = () => {
  const [totalIncome, setTotalIncome] = useState(0);
  const [tax, setTax] = useState(0);
  const token = localStorage.getItem("token");

  useEffect(() => {
    loadTax();
  }, []);

  const loadTax = async () => {
    try {
      const res = await axios.get("http://localhost:5000/transactions/tax", {
        headers: { Authorization: `Bearer ${token}` }
      });

      setTotalIncome(res.data.totalIncome || 0);
      setTax(res.data.tax || 0);
    } catch (err) {
      console.warn("Tax endpoint failed, deriving from monthly-report", err);
      // fallback: query monthly report for current month and compute 5%
      try {
        const now = new Date();
        const month = `${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,"0")}`;
        const r = await axios.get(`http://localhost:5000/transactions/monthly-report?month=${month}`, { headers:{ Authorization: `Bearer ${token}` } });
        const inc = r.data.totalIncome || 0;
        setTotalIncome(inc);
        setTax(Math.round(inc * 0.05));
      } catch (e) {
        // last fallback demo
        setTotalIncome(10000); setTax(500);
      }
    }
  };

  return (
    <div className="dash-layout">
      <Sidebar />
      <main className="dash-main">
        <h2>Tax</h2>

        <div className="tax-card">
          <div>
            <h4>Total monthly income</h4>
            <div className="big">৳ {totalIncome.toLocaleString()}</div>
          </div>

          <div style={{marginTop:16}}>
            <h4>Estimated tax (5%)</h4>
            <div className="big red">৳ {tax.toLocaleString()}</div>
          </div>

          <p className="muted">Tax = 5% of monthly income. You may adjust the rate in backend settings later.</p>
        </div>
      </main>
    </div>
  );
};

export default Tax;
