import { Bar, BarChart, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";
import type { HourlyData } from "../types";
import { formatTime } from "../utils/utils";

interface ElectricityChartProps {
  data: HourlyData[];
  width: number;
  height: number;
}

function ElectricityChart({ data, width, height }: ElectricityChartProps) {
  const chartData = data.map((item) => ({
    ...item,
    consumptionMwh: (item.consumptionamount || 0) / 1000,
    productionMwh: item.productionamount || 0,
  }));

  return (
    <BarChart
      width={width}
      height={height}
      data={chartData}
      margin={{ top: 30, right: 40, bottom: 10, left: 5 }}
    >
      <CartesianGrid stroke="#eee" strokeDasharray="5 5" vertical={false} />
      <XAxis dataKey="starttime" tickFormatter={formatTime} minTickGap={30} />
      <YAxis label={{ value: "MWh", position: "insideLeft", angle: -90 }} />

      <Tooltip
        labelFormatter={formatTime}
        formatter={(value: number | undefined, name: string | undefined) => {
          if (value === 0) return ["No data", name];
          if (value === undefined) return ["N/A", name];
          return [`${value.toFixed(1)} MWh`, name];
        }}
      />
      <Bar
        dataKey="productionMwh"
        name="Production"
        fill="#82ca9d"
        barSize={8}
        radius={[4, 4, 0, 0]}
      />
      <Bar
        dataKey="consumptionMwh"
        name="Consumption"
        fill="#ff8042"
        barSize={8}
        radius={[4, 4, 0, 0]}
      />
    </BarChart>
  );
}

export default ElectricityChart;
