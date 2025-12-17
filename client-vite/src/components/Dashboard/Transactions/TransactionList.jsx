import React from "react";
import api from "@/api/axiosConfig";

const TransactionList = ({ transactions, onDelete }) => {
  const token = localStorage.getItem("token");

  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = String(now.getMonth() + 1).padStart(2, "0");

  const thisMonthKey = `${currentYear}-${currentMonth}`;
  const thisMonthTx = transactions.filter((t) => t.date?.startsWith(thisMonthKey));

  const recent = thisMonthTx.slice(0, 5);

  // 🔥 DELETE FUNCTION
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this transaction?")) return;

    try {
      await api.delete(`/transactions/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      onDelete(id); // update UI in Dashboard
    } catch (err) {
      console.error("Delete failed:", err);
      alert("Failed to delete transaction");
    }
  };

  return (
    <>
      <style>{`
        .tx-table {
          width: 100%;
          border-collapse: collapse;
          background: #ffffff;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 4px 14px rgba(0,0,0,0.05);
        }

        .tx-table th {
          background: #f8fafc;
          padding: 14px;
          text-align: left;
          font-size: 14px;
          font-weight: 600;
          color: #334155;
          border-bottom: 1px solid #e2e8f0;
        }

        .tx-table td {
          padding: 14px;
          border-bottom: 1px solid #f1f5f9;
          font-size: 16px;
          color: #1e293b;
        }

        .Income {
          color: #059669;
          font-weight: 600;
        }

        .Expense {
          color: #dc2626;
          font-weight: 600;
        }

        .delete-btn {
          background: #ef4444;
          color: #fff;
          border: none;
          padding: 6px 10px;
          border-radius: 6px;
          cursor: pointer;
          font-size: 14px;
          transition: 0.2s;
        }

        .delete-btn:hover {
          background: #dc2626;
        }

        .no-data {
          text-align: center;
          padding: 20px;
          color: #64748b;
        }
      `}</style>

      <table className="tx-table">
        <thead>
          <tr>
            <th>Title</th>
            <th>Amount</th>
            <th>Type</th>
            <th>Date</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {recent.length === 0 ? (
            <tr>
              <td colSpan="5" className="no-data">
                No transactions this month
              </td>
            </tr>
          ) : (
            recent.map((t) => (
              <tr key={t._id}>
                <td>{t.title}</td>
                <td>৳ {t.amount}</td>
                <td className={t.type}>{t.type}</td>
                <td>{t.date?.slice(0, 10)}</td>

                <td>
                  <button
                    className="delete-btn"
                    onClick={() => handleDelete(t._id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </>
  );
};

export default TransactionList;
