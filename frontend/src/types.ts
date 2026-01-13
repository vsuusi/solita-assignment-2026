export interface DataQuality {
  isValid: boolean;
  missingRows: number;
  issues: string[];
}

export interface DailyListItem {
  date: string;
  totalProductionMwh: number;
  totalConsumptionKwh: number;
  avgPrice: number;
  longestNegativeStreak: number;
  quality: DataQuality;
}

export interface DailyListResponse {
  data: DailyListItem[];
  meta: {
    page: number;
    limit: number;
    totalItems: number;
    totalPages: number;
  };
}
