import { 
  BarChart, 
  Bar, 
  XAxis, 
  Tooltip, 
  ResponsiveContainer, 
  YAxis, 
  Label 
} from "recharts";


const IncomeChart = ({ income }) => {
  const data = [
    {
      name: "Today",
      income: income || 0,
    },
  ];

  return (
    <div className="chart-box">
      <h4>Today's Income</h4>

      <ResponsiveContainer width="100%" height={240}>
        <BarChart 
          data={data}
          barCategoryGap="90%"    
        >
          <XAxis dataKey="name" />
          <YAxis allowDecimals={false} hide />  {/* hide Y axis for clean look */}

          <Tooltip
            contentStyle={{
              background: "#fff",
              borderRadius: "10px",
              border: "1px solid #e5e7eb",
              fontSize: "14px",
            }}
          />

          <Bar
            dataKey="income"
            fill="#00C853"
            radius={[10, 10, 10, 10]}   
            maxBarSize={120}            
          >
            {/* TEXT IN THE CENTER OF BAR */}
            <Label
              value={income}
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

export default IncomeChart;
