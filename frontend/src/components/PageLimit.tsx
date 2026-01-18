import "./PageLimit.css";

interface PageLimitProps {
  itemsPerPage: number;
  onItemsPerPageChange: (limit: number) => void;
}

const PageLimit = ({ itemsPerPage, onItemsPerPageChange }: PageLimitProps) => {
  const pageSizes = [10, 25, 50, 100];

  return (
    <div className="pagination-limit">
      <label htmlFor="limit-select">Rows per page:</label>
      <select
        data-testid="pagination-limit"
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
  );
};

export default PageLimit;
