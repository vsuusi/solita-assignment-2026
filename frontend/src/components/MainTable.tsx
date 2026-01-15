import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

import type { DailyListItem, DailyListResponse } from "../types";
import { formatKwhToMwhString, formatNumber, formatDate } from "../utils/utils";
import { electricityApi } from "../api/electricityApi";
import Pagination from "./Pagination";

import "./MainTable.css";

function MainTable() {
  const [data, setData] = useState<DailyListItem[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const [sortBy, setSortBy] = useState<string>("date");
  const [sortOrder, setSortOrder] = useState<"ASC" | "DESC">("DESC");

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

  const getWarning = (issues: string[], keyword: string) => {
    return issues.find((issue) => issue.toLowerCase().includes(keyword));
  };

  const renderSortArrow = (column: string) => {
    if (sortBy !== column) return <span className="sort-arrow">↕</span>;
    return sortOrder === "ASC" ? " ▲" : " ▼";
  };

  if (error) return <p>Error loading data: {error}</p>;

  return (
    <div className="wrapper">
      <h1>Daily electricity statistics</h1>
      {loading && data.length === 0 ? (
        <h3>Loading initial data...</h3>
      ) : (
        <>
          <table className="main-table" style={{ opacity: loading ? 0.5 : 1 }}>
            <thead>
              <tr>
                <th
                  onClick={() => handleSortChange("date")}
                  className="main-table-header clickable"
                >
                  Date{renderSortArrow("date")}
                </th>
                <th
                  onClick={() => handleSortChange("avgPrice")}
                  className="main-table-header clickable"
                >
                  Avg Price{renderSortArrow("avgPrice")}
                </th>
                <th
                  onClick={() => handleSortChange("totalProductionMwh")}
                  className="main-table-header clickable"
                >
                  Production (MWh){renderSortArrow("totalProductionMwh")}
                </th>
                <th
                  onClick={() => handleSortChange("totalConsumptionKwh")}
                  className="main-table-header clickable"
                >
                  Consumption (MWh){renderSortArrow("totalConsumptionKwh")}
                </th>
                <th className="main-table-header">Neg. Streak (h)</th>
                {/* need to add sorting */}
                <th className="main-table-header">Action</th>
              </tr>
            </thead>

            <tbody>
              {data.map((row) => {
                const avgPrice = row.avgPrice?.toFixed(2) ?? "-";
                const longestNegativeStreak =
                  row.longestNegativeStreak > 0
                    ? row.longestNegativeStreak
                    : "-";
                const detailsLink = "/day/" + row.date;

                const issues = row.quality.issues;
                const dateWarning = getWarning(issues, "missing");
                const priceWarning = getWarning(issues, "price");
                const consWarning = getWarning(issues, "consumption");
                const prodWarning = getWarning(issues, "production");
                return (
                  <tr key={row.date}>
                    <td
                      className={dateWarning ? "warning-cell" : ""}
                      title={dateWarning}
                    >
                      {formatDate(row.date)} {dateWarning && "⚠️"}
                    </td>
                    <td
                      className={priceWarning ? "warning-cell" : ""}
                      title={priceWarning}
                    >
                      {avgPrice}
                    </td>
                    <td
                      className={prodWarning ? "warning-cell" : ""}
                      title={prodWarning}
                    >
                      {formatNumber(row.totalProductionMwh, 1)}
                    </td>
                    <td
                      className={consWarning ? "warning-cell" : ""}
                      title={consWarning}
                    >
                      {formatKwhToMwhString(row.totalConsumptionKwh, 1)}
                    </td>
                    <td>{longestNegativeStreak}</td>
                    <td>
                      <Link to={detailsLink} className="view-btn">
                        View Details
                      </Link>
                    </td>
                  </tr>
                );
              })}
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
