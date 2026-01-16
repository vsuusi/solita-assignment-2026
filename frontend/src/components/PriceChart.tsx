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
  width: number;
  height: number;
}

function PriceChart({ data, width, height }: PriceChartProps) {
  return (
    <LineChart
      width={width}
      height={height}
      responsive
      data={data}
      margin={{ top: 30, right: 40, bottom: 10, left: 5 }}
    >
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
