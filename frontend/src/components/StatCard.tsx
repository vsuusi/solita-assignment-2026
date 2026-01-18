import React from "react";
import type { LucideIcon } from "lucide-react";
import "./StatCard.css";

interface StatCardProps {
  title: string;
  value?: string | number;
  icon?: LucideIcon;
  comment?: string;
  color?: string;
  children?: React.ReactNode;
}

const StatCard = ({
  title,
  value,
  icon: Icon,
  comment,
  color = "#2563eb",
  children,
}: StatCardProps) => {
  const cardStyle = {
    "--card-color": color,
  } as React.CSSProperties;

  return (
    <div className="stat-card" style={cardStyle}>
      <div className="stat-card-header">
        <div className="stat-icon">{Icon ? <Icon size={20} /> : undefined}</div>
        {title}
      </div>

      <div className="stat-content">
        {children ? (
          <div className="stat-custom">{children}</div>
        ) : (
          <>
            <div className="stat-value">{value}</div>
            {comment && <div className="stat-comment">{comment}</div>}
          </>
        )}
      </div>
    </div>
  );
};

export default StatCard;
