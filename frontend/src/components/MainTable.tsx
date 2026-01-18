import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

import type { DailyListItem, DailyListResponse } from "../types";
import { formatKwhToMwhString, formatNumber, formatDate } from "../utils/utils";
import { electricityApi } from "../api/electricityApi";
import Pagination from "./Pagination";
import PageLimit from "./PageLimit";
import DateRangePicker from "./DateRangePicker";
import EmptyState from "./EmptyState";
import "react-datepicker/dist/react-datepicker.css"; // load css in parent
import "./MainTable.css";

function MainTable() {
  const [data, setData] = useState<DailyListItem[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // states for sorting table
  const [sortBy, setSortBy] = useState<string>("date");
  const [sortOrder, setSortOrder] = useState<"ASC" | "DESC">("DESC");

  // states for pagination
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [limit, setLimit] = useState<number>(10);

  // states for date selection
  const [appliedStartDate, setAppliedStartDate] = useState<string | undefined>(
    undefined,
  );
  const [appliedEndDate, setAppliedEndDate] = useState<string | undefined>(
    undefined,
  );

  // handlers
  const handleSortChange = (column: string) => {
    if (sortBy === column) {
      setSortOrder((prev) => (prev === "ASC" ? "DESC" : "ASC"));
    } else {
      setSortBy(column);
      setSortOrder("ASC");
    }
    setPage(1);
  };

  const getPriceClass = (price: number) => {
    const base = "price-value";
    if (price < 0) return `${base} price-neg`;
    if (price > 10) return `${base} price-high`;
    return `${base} price-norm`;
  };

  const handleLimitChange = (newLimit: number) => {
    setLimit(newLimit);
    setPage(1);
  };

  const hanldeDateRangeChange = (
    startDate?: string,
    endDate?: string,
    clear?: boolean,
  ) => {
    if (clear) {
      setAppliedStartDate(undefined);
      setAppliedEndDate(undefined);
    } else {
      setAppliedStartDate(startDate);
      setAppliedEndDate(endDate);
    }
    setPage(1);
  };

  // helpers
  const getWarning = (
    issues: string[],
    keyword: string,
  ): string | undefined => {
    const hasIssue = issues.some((issue) =>
      issue.toLowerCase().includes(keyword),
    );

    if (!hasIssue) return undefined;

    switch (keyword) {
      case "missing":
        return "Data is incomplete for this date.";
      case "price":
        return "Price data is missing or invalid.";
      case "consumption":
        return "Consumption data is missing or invalid.";
      case "production":
        return "Production data is missing or invalid.";
      default:
        return "This value contains invalid data.";
    }
  };

  const renderSortArrow = (column: string) => {
    if (sortBy !== column) return <span className="sort-arrow" />;
    return sortOrder === "ASC" ? " ▲" : " ▼";
  };

  // data fetching
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const resp: DailyListResponse =
          await electricityApi.getDailyElectricityList(
            page,
            limit,
            sortBy,
            sortOrder,
            appliedStartDate,
            appliedEndDate,
          );

        console.log("Full response:", resp);

        if (resp && resp.data) {
          setData(resp.data);
          setTotalPages(Math.max(resp.meta.totalPages, 1)); // set minimum pages to 1
        }
      } catch (e) {
        setError("Failed to fetch data");
        console.error("error: ", e);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [sortBy, sortOrder, page, appliedStartDate, appliedEndDate, limit]);

  return (
    <>
      <h1>Daily electricity statistics</h1>

      {loading && data.length === 0 && (
        <div className="status-message">Loading data...</div>
      )}

      {error && <p>Error loading data: {error}</p>}

      {!loading && !error && data.length === 0 && (
        <EmptyState
          title="No data found"
          description="Try adjusting your date range or clearing the filters."
          showClearButton={Boolean(appliedStartDate || appliedEndDate)}
          onClear={() => hanldeDateRangeChange(undefined, undefined, true)}
        />
      )}

      {data.length > 0 && (
        <>
          <div className="main-filters">
            <DateRangePicker onDateRangeChange={hanldeDateRangeChange} />
            <PageLimit
              itemsPerPage={limit}
              onItemsPerPageChange={handleLimitChange}
            />
          </div>
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
                  Avg Price (€){renderSortArrow("avgPrice")}
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
                <th
                  className="main-table-header neg-streak"
                  title="Longest consecutive hours when price was negative"
                >
                  Neg. Streak (h)
                </th>
                <th className="main-table-header">Action</th>
              </tr>
            </thead>

            <tbody>
              {data.map((row) => {
                const avgPrice = row.avgPrice
                  ? (row.avgPrice / 100).toFixed(2)
                  : "-";
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
                    <td title={dateWarning}>
                      {formatDate(row.date)} {dateWarning && "⚠️"}
                    </td>

                    <td title={priceWarning}>
                      {priceWarning && "⚠️"}{" "}
                      <span className={getPriceClass(row.avgPrice)}>
                        {avgPrice}
                      </span>
                    </td>

                    <td title={prodWarning}>
                      {prodWarning && "⚠️"}{" "}
                      {formatNumber(row.totalProductionMwh, 1)}
                    </td>

                    <td title={consWarning}>
                      {consWarning && "⚠️"}{" "}
                      {formatKwhToMwhString(row.totalConsumptionKwh, 1)}
                    </td>

                    <td className="longest-negative-streak">
                      {longestNegativeStreak}
                    </td>
                    <td>
                      <Link to={detailsLink} className="view-btn">
                        View Details
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
            <tfoot>
              <tr>
                <td colSpan={6} className="footer-pagination">
                  <Pagination
                    currentPage={page}
                    totalPages={totalPages}
                    onPageChange={(newPage) => setPage(newPage)}
                  />
                </td>
              </tr>
            </tfoot>
          </table>
        </>
      )}
    </>
  );
}

export default MainTable;
