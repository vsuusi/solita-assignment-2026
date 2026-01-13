import { useState, useEffect } from "react";

import { electricityApi } from "../api/electricityApi";
import type { ElectricityDataRow, ApiResponse, ApiResult } from "../types";

import "./MainTable.css";

function MainTable() {
  const [data, setData] = useState<ElectricityDataRow[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const resp: ApiResponse =
          await electricityApi.getDailyElectricityList();
        console.log("Full response:", resp);
        if (resp.result && resp.result.rows) {
          setData(resp.result.rows);
        }
      } catch (e) {
        console.error("error: ", e);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <p>Loading data...</p>;

  return (
    <div className="wrapper">
      <h1>Main table</h1>
      <p>Electricity data</p>
      {data.length > 0 ? (
        <table className="main-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Avg Price (snt/kWh)</th>
              <th>Consumption (kWh)</th>
              <th>Production (MWh)</th>
              <th>Hours</th>
            </tr>
          </thead>

          <tbody>
            {data.map((row) => (
              <tr key={row.date}>
                {/* 1. Format Date to be readable */}
                <td>{new Date(row.date).toLocaleDateString()}</td>

                {/* 2. Format Price to 2 decimals, handle null */}
                <td>{row.avgPrice !== null ? row.avgPrice.toFixed(2) : "-"}</td>

                {/* 3. Handle null consumption */}
                <td>{row.totalConsumptionMwh ?? "-"}</td>

                <td>{row.totalProductionMwh}</td>
                <td>{row.hoursCount}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <h3>No data available</h3>
      )}
    </div>
  );
}

export default MainTable;
