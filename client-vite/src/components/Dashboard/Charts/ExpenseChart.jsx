import { 
  BarChart, 
  Bar, 
  XAxis, 
  Tooltip, 
  ResponsiveContainer, 
  YAxis, 
  Label 
} from "recharts";

const ExpenseChart = ({ expense }) => {

  const data = [
    {
      name: "Today",
      expense: expense || 0,
    },
  ];

  return (
    <div className="chart-box">
      <h4>Today's Expense</h4>

      <ResponsiveContainer width="100%" height={240}>
        <BarChart 
          data={data}
          barCategoryGap="90%"      // ⭐ Keeps bar wide like your sketch
        >
          <XAxis dataKey="name" />
          <YAxis allowDecimals={false} hide />   {/* clean look */}

          <Tooltip
            contentStyle={{
              background: "#fff",
              borderRadius: "10px",
              border: "1px solid #e5e7eb",
              fontSize: "14px",
            }}
          />

          <Bar
            dataKey="expense"
            fill="#D50000"           // ⭐ Premium red like banking apps
            radius={[10, 10, 10, 10]}  // ⭐ Fully rounded
            maxBarSize={120}          // ⭐ Prevent shrinking
          >
            {/* BIG CENTER VALUE */}
            <Label
              value={expense}
              position="center"
              fill="#ffffff"
              fontSize={34}
              fontWeight="bold"
            />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ExpenseChart;
