import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import type { HourlyData } from "../types";
import { formatTime } from "../utils/utils";

interface PriceChartProps {
  data: HourlyData[];
  height: number;
}

function PriceChart({ data, height }: PriceChartProps) {
  return (
    <LineChart width="100%" height={height} responsive data={data}>
      <Line
        dataKey="hourlyprice"
        type="monotone"
        stroke="purple"
        strokeWidth={2}
        name="Price movement"
        dot={false}
      />
      <CartesianGrid stroke="#aaa" strokeDasharray="5 5" />
      <XAxis dataKey="starttime" tickFormatter={formatTime} minTickGap={10} />
      <YAxis
        width="auto"
        label={{ value: "c/kWh", position: "insideLeft", angle: -90 }}
      />
      <Tooltip
        labelFormatter={formatTime}
        formatter={(value: number | undefined) => [
          value !== undefined ? `${value.toFixed(2)} c/kWh` : "N/A",
          "Price",
        ]}
      />
    </LineChart>
  );
}

export default PriceChart;
