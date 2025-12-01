import React from "react";

const SummaryBox = ({ label, value, type }) => {
  return (
    <>
      <div className={`summary-box ${type}`}>
        <div className="summary-label">{label}</div>
        <div className="summary-value">৳ {value.toLocaleString()}</div>
      </div>

      <style>{`
        .summary-box {
          padding: 20px;
          border-radius: 14px;
          color: #fff;
          min-height: 110px;
          display: flex;
          flex-direction: column;
          justify-content: center;
          box-shadow: 0 8px 25px rgba(0,0,0,0.08);
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }

        .summary-box:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 30px rgba(0,0,0,0.12);
        }

        .summary-label {
          font-size: 15px;
          opacity: 0.9;
          margin-bottom: 6px;
        }

        .summary-value {
          font-size: 26px;
          font-weight: 700;
          letter-spacing: -0.5px;
        }

        /* COLORS */
        .income {
          background: linear-gradient(135deg, #10b981, #34d399);
        }

        .expense {
          background: linear-gradient(135deg, #ef4444, #f87171);
        }

        /* Responsive */
        @media (max-width: 600px) {
          .summary-box {
            min-height: 90px;
            padding: 16px;
          }
          .summary-value {
            font-size: 22px;
          }
        }
      `}</style>
    </>
  );
};

export default SummaryBox;
