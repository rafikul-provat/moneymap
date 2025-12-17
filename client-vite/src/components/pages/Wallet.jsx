import React, { useEffect, useState } from "react";
import api from "@/api/axiosConfig";
import Sidebar from "../Sidebar";
import "./Wallet.css";

const formatBD = (num) => "৳ " + Number(num || 0).toLocaleString("en-IN");

const Wallet = () => {
  const [yearIncome, setYearIncome] = useState(0);
  const [yearExpense, setYearExpense] = useState(0);
  const [tax, setTax] = useState(0);
  const [netSavings, setNetSavings] = useState(0);

  const [accounts, setAccounts] = useState([]);

  // Add modal
  const [showAddModal, setShowAddModal] = useState(false);
  const [accType, setAccType] = useState("Bank");
  const [accProvider, setAccProvider] = useState("");
  const [accNumber, setAccNumber] = useState("");
  const [accBalance, setAccBalance] = useState("");

  // Edit modal
  const [showEditModal, setShowEditModal] = useState(false);
  const [editId, setEditId] = useState("");
  const [editType, setEditType] = useState("");
  const [editProvider, setEditProvider] = useState("");
  const [editNumber, setEditNumber] = useState("");
  const [editBalance, setEditBalance] = useState("");

  /* ---------------------------------------------------------
     LOAD YEAR SUMMARY
  --------------------------------------------------------- */
  const loadYearSummary = async () => {
    try {
      const now = new Date();
      const year = now.getFullYear();

      const res = await api.get(`/transactions/yearly-summary?year=${year}`);

      const income = res.data.totalIncome || 0;
      const expense = res.data.totalExpense || 0;

      let calculatedTax = 0;

      if (income > 350000) {
        calculatedTax += Math.min(income - 350000, 350000) * 0.05;
      }
      if (income > 700000) {
        calculatedTax += Math.min(income - 700000, 500000) * 0.1;
      }
      if (income > 1200000) {
        calculatedTax += (income - 1200000) * 0.15;
      }

      setYearIncome(income);
      setYearExpense(expense);
      setTax(Math.round(calculatedTax));
      setNetSavings(income - expense - Math.round(calculatedTax));
    } catch (err) {
      console.error("Year summary error:", err);
    }
  };

  /* ---------------------------------------------------------
     LOAD ACCOUNTS
  --------------------------------------------------------- */
  const loadAccounts = async () => {
    try {
      const res = await api.get("/wallet/accounts");
      setAccounts(res.data || []);
    } catch (err) {
      console.error("Account load error:", err);
    }
  };

  /* ---------------------------------------------------------
     ADD ACCOUNT
  --------------------------------------------------------- */
  const addAccount = async () => {
    try {
      await api.post("/wallet/accounts", {
        type: accType,
        provider: accProvider,
        number: accNumber,
        balance: Number(accBalance),
      });

      setShowAddModal(false);
      setAccProvider("");
      setAccNumber("");
      setAccBalance("");

      loadAccounts();
    } catch (err) {
      console.error("Add account error", err);
      alert("Failed to add account");
    }
  };

  /* ---------------------------------------------------------
     OPEN EDIT MODAL
  --------------------------------------------------------- */
  const openEdit = (acc) => {
    setEditId(acc._id);
    setEditType(acc.type);
    setEditProvider(acc.provider);
    setEditNumber(acc.number);
    setEditBalance(acc.balance);
    setShowEditModal(true);
  };

  /* ---------------------------------------------------------
     UPDATE ACCOUNT
  --------------------------------------------------------- */
  const updateAccount = async () => {
    try {
      await api.put(`/wallet/accounts/${editId}`, {
        type: editType,
        provider: editProvider,
        number: editNumber,
        balance: Number(editBalance),
      });

      setShowEditModal(false);
      loadAccounts();
    } catch (err) {
      console.error("Update account error", err);
      alert("Failed to update account");
    }
  };

  /* ---------------------------------------------------------
     DELETE ACCOUNT
  --------------------------------------------------------- */
  const deleteAccount = async (id) => {
    if (!window.confirm("Delete this account?")) return;

    try {
      await api.delete(`/wallet/accounts/${id}`);
      loadAccounts();
    } catch (err) {
      console.error("Delete error:", err);
    }
  };

  useEffect(() => {
    loadYearSummary();
    loadAccounts();
  }, []);

  return (
    <div className="dash-layout">
      <Sidebar />

      <main className="dash-main">
        <h2>Wallet Overview</h2>

        {/* SUMMARY CARD */}
        <div className="wallet-card">
          <h3>Net Balance (After Tax)</h3>
          <div className="wallet-amount">{formatBD(netSavings)}</div>

          <div className="wallet-details">
            <div>
              Yearly Income: <strong className="inc">{formatBD(yearIncome)}</strong>
            </div>
            <div>
              Yearly Expense: <strong className="exp">{formatBD(yearExpense)}</strong>
            </div>
            <div>
              Income Tax: <strong className="tax">{formatBD(tax)}</strong>
            </div>
          </div>
        </div>

        {/* ACCOUNT HEADER */}
        <div className="wallet-header">
          <h3>💳 Bank & Mobile Banking Accounts</h3>
          <button className="add-btn" onClick={() => setShowAddModal(true)}>
            + Add Account
          </button>
        </div>

        {/* ACCOUNT LIST */}
        <div className="account-list">
          {accounts.length === 0 && <p className="no-acc">No accounts added yet.</p>}

          {accounts.map((a) => (
            <div key={a._id} className="account-card">
              <h4>{a.type}</h4>
              <p><strong>{a.provider}</strong></p>
              <p>Account No: {a.number}</p>
              <p>Balance: {formatBD(a.balance)}</p>

              <div className="acc-actions">
                <button className="edit-btn" onClick={() => openEdit(a)}>
                  Edit
                </button>
                <button className="delete-btn" onClick={() => deleteAccount(a._id)}>
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* ADD ACCOUNT MODAL */}
        {showAddModal && (
          <div className="modal-bg">
            <div className="modal-box">
              <h3>Add Account</h3>

              <label>Type</label>
              <select value={accType} onChange={(e) => setAccType(e.target.value)}>
                <option value="Bank">Bank</option>
                <option value="MFS">MFS</option>
                <option value="Bond">Bond</option>
              </select>

              <label>Provider</label>
              <input value={accProvider} onChange={(e) => setAccProvider(e.target.value)} />

              <label>Account Number</label>
              <input value={accNumber} onChange={(e) => setAccNumber(e.target.value)} />

              <label>Balance</label>
              <input
                type="number"
                value={accBalance}
                onChange={(e) => setAccBalance(e.target.value)}
              />

              <div className="modal-actions">
                <button className="save-btn" onClick={addAccount}>
                  Save
                </button>
                <button className="cancel-btn" onClick={() => setShowAddModal(false)}>
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* EDIT ACCOUNT MODAL */}
        {showEditModal && (
          <div className="modal-bg">
            <div className="modal-box">
              <h3>Edit Account</h3>

              <label>Type</label>
              <select value={editType} onChange={(e) => setEditType(e.target.value)}>
                <option value="Bank">Bank</option>
                <option value="MFS">MFS</option>
                <option value="Bond">Bond</option>
              </select>

              <label>Provider</label>
              <input value={editProvider} onChange={(e) => setEditProvider(e.target.value)} />

              <label>Account Number</label>
              <input value={editNumber} onChange={(e) => setEditNumber(e.target.value)} />

              <label>Balance</label>
              <input
                type="number"
                value={editBalance}
                onChange={(e) => setEditBalance(e.target.value)}
              />

              <div className="modal-actions">
                <button className="save-btn" onClick={updateAccount}>
                  Update
                </button>
                <button className="cancel-btn" onClick={() => setShowEditModal(false)}>
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Wallet;