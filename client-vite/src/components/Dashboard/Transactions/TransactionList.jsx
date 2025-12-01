import React from "react";

const TransactionList = ({ transactions }) => {
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = String(now.getMonth() + 1).padStart(2, "0");

  // Format to YYYY-MM
  const thisMonthKey = `${currentYear}-${currentMonth}`;

  // 🔥 Filter this month's transactions
  const thisMonthTx = transactions.filter((t) =>
    t.date?.startsWith(thisMonthKey)
  );

  // Show latest 5
  const recent = thisMonthTx.slice(0, 5);

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
          </tr>
        </thead>

        <tbody>
          {recent.length === 0 ? (
            <tr>
              <td colSpan="4" className="no-data">
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
              </tr>
            ))
          )}
        </tbody>
      </table>
    </>
  );
};

export default TransactionList;
