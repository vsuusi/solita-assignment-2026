import {
  ChevronRight,
  ChevronsRight,
  ChevronLeft,
  ChevronsLeft,
} from "lucide-react";
import "./Pagination.css";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const Pagination = ({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationProps) => {
  return (
    <div className="pagination-controls">
      <button
        className="page-btn"
        onClick={() => onPageChange(1)}
        disabled={currentPage === 1}
      >
        <div className="page-btn-icon">
          <ChevronsLeft size={18} />
        </div>
      </button>

      <button
        className="page-btn"
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
      >
        <div className="page-btn-icon">
          <ChevronLeft size={18} />
        </div>
      </button>

      <span className="page-info">
        Page <strong>{currentPage}</strong> of <strong>{totalPages}</strong>
      </span>

      <button
        className="page-btn"
        disabled={currentPage === totalPages || totalPages === 0}
        onClick={() => onPageChange(currentPage + 1)}
        data-testid="page-btn-next"
      >
        <div className="page-btn-icon">
          <ChevronRight size={18} />
        </div>
      </button>

      <button
        className="page-btn"
        onClick={() => onPageChange(totalPages)}
        disabled={currentPage === totalPages || totalPages === 0}
      >
        <div className="page-btn-icon">
          <ChevronsRight size={18} />
        </div>
      </button>
    </div>
  );
};

export default Pagination;
