import "./Pagination.css";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  itemsPerPage: number;
  onItemsPerPageChange: (limit: number) => void;
}

// toDo: Add last page button and first page button, render them conditionally

const Pagination = ({
  currentPage,
  totalPages,
  onPageChange,
  itemsPerPage,
  onItemsPerPageChange,
}: PaginationProps) => {
  const pageSizes = [10, 25, 50, 100];

  return (
    <div className="pagination-container">
      {/* --- Section 1: Limit Picker --- */}
      <div className="pagination-limit">
        <label htmlFor="limit-select">Rows per page:</label>
        <select
          id="limit-select"
          value={itemsPerPage}
          onChange={(e) => onItemsPerPageChange(Number(e.target.value))}
          className="limit-select"
        >
          {pageSizes.map((size) => (
            <option key={size} value={size}>
              {size}
            </option>
          ))}
        </select>
      </div>

      {/* --- Section 2: Navigation Buttons --- */}
      <div className="pagination-controls">
        {/* First Page */}
        {currentPage > 1 && (
          <button
            className="page-btn"
            onClick={() => onPageChange(1)}
            title="First Page"
          >
            &laquo;&laquo;
          </button>
        )}

        {/* Previous */}
        <button
          className="page-btn"
          disabled={currentPage === 1}
          onClick={() => onPageChange(currentPage - 1)}
        >
          &laquo; Prev
        </button>

        <span className="page-info">
          Page <strong>{currentPage}</strong> of <strong>{totalPages}</strong>
        </span>

        {/* Next */}
        <button
          className="page-btn"
          disabled={currentPage === totalPages || totalPages === 0}
          onClick={() => onPageChange(currentPage + 1)}
        >
          Next &raquo;
        </button>

        {/* Last Page */}
        {currentPage < totalPages && (
          <button
            className="page-btn"
            onClick={() => onPageChange(totalPages)}
            title="Last Page"
          >
            &raquo;&raquo;
          </button>
        )}
      </div>
    </div>
  );
};

export default Pagination;
