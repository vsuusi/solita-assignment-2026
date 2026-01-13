import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

import type { DailyListItem, DailyListResponse } from "../types";
import { electricityApi } from "../api/electricityApi";
import Pagination from "./Pagination";

import "./MainTable.css";

function MainTable() {
  const [data, setData] = useState<DailyListItem[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const [sortBy, setSortBy] = useState<string>("date");
  const [sortOrder, setSortOrder] = useState<"ASC" | "DESC">("ASC");

  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const resp: DailyListResponse =
          await electricityApi.getDailyElectricityList(
            page,
            10,
            sortBy,
            sortOrder
          );
        console.log("Full response:", resp);
        if (resp && resp.data) {
          setData(resp.data);
          setTotalPages(resp.meta.totalPages);
        }
      } catch (e) {
        setError("Failed to fetch data");
        console.error("error: ", e);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [sortBy, sortOrder, page]);

  const handleSortChange = (column: string) => {
    if (sortBy === column) {
      setSortOrder((prev) => (prev === "ASC" ? "DESC" : "ASC"));
    } else {
      setSortBy(column);
      setSortOrder("ASC");
    }
    setPage(1);
  };

  const renderSortArrow = (column: string) => {
    if (sortBy !== column) return <span className="sort-arrow">↕</span>; // Passive arrow
    return sortOrder === "ASC" ? " ▲" : " ▼";
  };

  if (error) return <p>Error loading data: {error}</p>;

  return (
    <div className="wrapper">
      <h1>Main table</h1>
      <p>Click on a row to view details</p>
      {loading && data.length === 0 ? (
        <h3>Loading initial data...</h3>
      ) : (
        <>
          <table className="main-table" style={{ opacity: loading ? 0.5 : 1 }}>
            <thead>
              <tr>
                <th onClick={() => handleSortChange("date")}>
                  Date {renderSortArrow("date")}
                </th>
                <th>Status</th>
                <th onClick={() => handleSortChange("avgPrice")}>
                  Avg Price {renderSortArrow("avgPrice")}
                </th>
                <th onClick={() => handleSortChange("totalConsumptionKwh")}>
                  Consumption (MWh) {renderSortArrow("totalConsumptionKwh")}
                </th>
                <th onClick={() => handleSortChange("totalProductionMwh")}>
                  Production (MWh) {renderSortArrow("totalProductionMwh")}
                </th>
                <th>Neg. Streak (h)</th> {/* need to add sorting */}
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {data.map((row) => (
                <tr key={row.date}>
                  <td>{row.date}</td>
                  <td>
                    {row.quality.isValid ? (
                      <span className="badge success">OK</span>
                    ) : (
                      <span
                        className="badge warning"
                        title={row.quality.issues.join("\n")} // Hover to see issues
                      >
                        ⚠️ Issues
                      </span>
                    )}
                  </td>
                  <td>{row.avgPrice?.toFixed(2) ?? "-"}</td>
                  <td>
                    {row.totalConsumptionKwh
                      ? (row.totalConsumptionKwh / 1000).toLocaleString()
                      : "-"}
                  </td>
                  <td>{row.totalProductionMwh?.toLocaleString() ?? "-"}</td>
                  <td style={{ textAlign: "center" }}>
                    {row.longestNegativeStreak > 0 ? (
                      <span style={{ color: "green", fontWeight: "bold" }}>
                        {row.longestNegativeStreak} h
                      </span>
                    ) : (
                      "-"
                    )}
                  </td>
                  <td>
                    <Link to={`/day/${row.date}`} className="view-btn">
                      View Details
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            onPageChange={(newPage) => setPage(newPage)}
          />
        </>
      )}
    </div>
  );
}

export default MainTable;
