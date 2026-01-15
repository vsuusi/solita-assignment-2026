import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

import type { SingleDayResponse, CheapestHours } from "../types";

import "./DetailedView.css";

import { electricityApi } from "../api/electricityApi";
import {
  formatKwhToMwhString,
  formatTime,
  formatNumber,
  formatDate,
  findPeakHour,
} from "../utils/utils";

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

  const cheapestHours: CheapestHours[] = data.summary.cheapestHours;
  // const mostExpensiveHours = NEED TO IMPLEMENT IN BACKEND

  return (
    <div className="single-day-container">
      <div>
        <h2>Date: {formatDate(date)}</h2>
      </div>
      <button
        onClick={() => {
          navigate(-1);
        }}
      >
        Go Back
      </button>
      <div className="metrics-container">
        <div className="metrics-row">
          <div className="metrics-block">
            <h3>Total consumption</h3>
            <p>{formatKwhToMwhString(data.summary.totalConsumptionKwh)}</p>
          </div>

          <div className="metrics-block">
            <h3>Total production</h3>
            <p>{formatNumber(data.summary.totalProductionMwh)}</p>
          </div>

          <div className="metrics-block">
            <h3>Average price</h3>
            <p>{formatNumber(data.summary.avgPrice, 2)}</p>
          </div>
        </div>

        <div className="metrics-row">
          <div className="metrics-block">
            <h3>Peak production hour</h3>
            <p>{formatTime(peakProd.starttime)}</p>
            <p>{formatNumber(peakProd.productionamount)}</p>
          </div>
          <div className="metrics-block">
            <h3>Peak consumption hour</h3>
            <p>{formatTime(peakCons.starttime)}</p>
            <p>{formatKwhToMwhString(peakCons.consumptionamount)}</p>
          </div>
        </div>

        <div className="metrics-row">
          <div className="metrics-block">
            <h3>Cheapest hours</h3>
            <div>
              {cheapestHours.map((hour) => (
                <span key={hour.time} className="price-tag success">
                  {formatTime(hour.time)}:{" "}
                  <b>{formatNumber(hour.price, 2)} c</b>
                </span>
              ))}
            </div>
          </div>
          <div className="metrics-block">
            <h3>Most expensive hours</h3>
          </div>
        </div>

        <div className="metrics-row">
          <h3>Daily energy chart</h3>
        </div>

        <div className="metrics-row">
          <h3>Hourly price movement</h3>
        </div>
      </div>

      <div className="hourly-view-container">
        <h3>Hourly breakdown</h3>
        <table className="hourly-table">
          <thead>
            <tr>
              <th>Hour</th>
              <th>Price</th>
              <th>Production (MWh)</th>
              <th>Consumption (MWh)</th>
            </tr>
          </thead>
          <tbody>
            {data.hourlyData.map((hour) => {
              return (
                <tr key={hour.starttime}>
                  <td>{formatTime(hour.starttime)}</td>
                  <td>{formatNumber(hour.hourlyprice, 2)}</td>
                  <td>{formatNumber(hour.productionamount)}</td>
                  <td>{formatKwhToMwhString(hour.consumptionamount)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default DetailedView;
