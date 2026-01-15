import React from "react";
import "./EmptyState.css";

interface EmptyStateProps {
  title?: string;
  description?: string;
  onClear?: () => void;
  showClearButton?: boolean;
}

const EmptyState: React.FC<EmptyStateProps> = ({
  title = "No results found",
  description = "We couldn't find any data matching your criteria.",
  onClear,
  showClearButton = false,
}) => {
  return (
    <div className="empty-state-container">
      <div className="empty-state-icon">🔍</div>
      <h3 className="empty-state-title">{title}</h3>
      <p className="empty-state-description">{description}</p>

      {showClearButton && onClear && (
        <button onClick={onClear} className="empty-state-btn">
          Clear Filters
        </button>
      )}
    </div>
  );
};

export default EmptyState;
