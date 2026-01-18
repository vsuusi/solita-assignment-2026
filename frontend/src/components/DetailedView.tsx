import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Factory,
  Zap,
  Clock,
  TrendingDown,
  TrendingUp,
  ChartColumn,
  ChartSpline,
  Euro,
} from "lucide-react";

import type { SingleDayResponse, TopHours } from "../types";
import { electricityApi } from "../api/electricityApi";
import {
  formatKwhToMwhString,
  formatTime,
  formatNumber,
  formatDate,
  findPeakHour,
} from "../utils/utils";
import PriceChart from "./PriceChart";
import ElectricityChart from "./ElectricityChart";
import StatCard from "./StatCard";

import "./DetailedView.css";

function DetailedView() {
  const { date } = useParams<{ date: string }>();

  const [data, setData] = useState<SingleDayResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  // const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();

  useEffect(() => {
    if (!date) return;

    const fetchData = async () => {
      try {
        setLoading(true);
        const resp = await electricityApi.getSingleDayElectricityData(date);
        setData(resp);
        console.log("Single day resp", resp);
      } catch (e) {
        console.error("error", e);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [date]);

  if (loading) return <h3>Loading data...</h3>;
  if (!data) return null;

  const peakCons = findPeakHour(data.hourlyData, "consumptionamount");
  const peakProd = findPeakHour(data.hourlyData, "productionamount");

  const cheapestHours: TopHours[] = data.summary.cheapestHours;
  const mostExpensiveHours: TopHours[] = data.summary.mostExpensiveHours;
  const mostExpensiveReversed = [...mostExpensiveHours].reverse();

  return (
    <div className="details-container">
      <div className="details-header">
        <button
          className="back-btn"
          data-testid="back-btn"
          onClick={() => {
            navigate(-1);
          }}
        >
          <ArrowLeft size={20} />
          Go Back
        </button>
        <h2>{formatDate(date)}</h2>
      </div>
      <div className="metrics-container">
        <div className="metrics-row">
          <StatCard
            title="TOTAL PRODUCTION"
            value={formatNumber(data.summary.totalProductionMwh)}
            icon={Zap}
            color="#16a34a"
            comment="megawatthours per day"
          />
          <StatCard
            title="TOTAL CONSUMPTION"
            value={formatKwhToMwhString(data.summary.totalConsumptionKwh)}
            icon={Factory}
            comment="megawatthours per day"
            color="#2563eb"
          />
          <StatCard
            title="AVERAGE PRICE"
            value={formatNumber(data.summary.avgPrice / 100)}
            icon={Euro}
            color="#f8c024ff"
            comment="eur per kilowatthour"
          />
        </div>

        <div className="metrics-row">
          <StatCard
            title="PEAK CONSUMPTION HOUR"
            value={peakCons ? formatTime(peakCons.starttime) : "-"}
            icon={Clock}
            color="#eb9628ff"
            comment={formatKwhToMwhString(peakCons?.consumptionamount) + " MWh"}
          />
          <StatCard
            title="PEAK PRODUCTION HOUR"
            value={peakProd ? formatTime(peakProd.starttime) : "-"}
            icon={Clock}
            color="#16a34a"
            comment={formatNumber(peakProd?.productionamount) + " MWh"}
          />
        </div>

        <div className="metrics-row">
          <StatCard title="CHEAPEST HOURS" icon={TrendingDown} color="#16a34a">
            {cheapestHours.map((hour) => (
              <div key={hour.time} className="stat-list-row">
                <span className="stat-list-label">{formatTime(hour.time)}</span>
                <span className="stat-list-value">
                  {formatNumber(hour.price / 100, 2)} €
                </span>
              </div>
            ))}
          </StatCard>

          <StatCard
            title="MOST EXPENSIVE HOURS"
            icon={TrendingUp}
            color="#dc2626"
          >
            {mostExpensiveReversed.map((hour) => (
              <div key={hour.time} className="stat-list-row">
                <span className="stat-list-label">{formatTime(hour.time)}</span>
                <span className="stat-list-value">
                  {formatNumber(hour.price / 100, 2)} €
                </span>
              </div>
            ))}
          </StatCard>
        </div>

        <div className="metrics-row">
          <StatCard title="PRICE MOVEMENT" icon={ChartSpline} color="#af1696ff">
            <PriceChart data={data.hourlyData} height={250} />
          </StatCard>
        </div>

        <div className="metrics-row">
          <StatCard title="ELECTRICITY PATTERN" icon={ChartColumn}>
            <ElectricityChart data={data.hourlyData} height={250} />
          </StatCard>
        </div>
      </div>

      <div className="hourly-view-container">
        <h3>Hourly breakdown</h3>
        <table className="hourly-table">
          <thead>
            <tr>
              <th>Hour</th>
              <th>Price (€/kWh)</th>
              <th>Production (MWh)</th>
              <th>Consumption (MWh)</th>
            </tr>
          </thead>
          <tbody>
            {data.hourlyData.map((hour) => {
              return (
                <tr key={hour.starttime}>
                  <td>{formatTime(hour.starttime)}</td>
                  <td>{formatNumber(hour.hourlyprice / 100, 3)}</td>
                  <td>{formatNumber(hour.productionamount)}</td>
                  <td>{formatKwhToMwhString(hour.consumptionamount)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <button
        className="back-btn"
        data-testid="back-btn"
        onClick={() => {
          navigate(-1);
        }}
      >
        <ArrowLeft size={20} />
        Go Back
      </button>
    </div>
  );
}

export default DetailedView;
