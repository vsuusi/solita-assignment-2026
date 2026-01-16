interface DataQuality {
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

export interface TopHours {
  time: string;
  price: number;
}

interface MaxDiffHour {
  time: string;
  valueKwh: number;
}

export interface HourlyData {
  id: number;
  date: string;
  starttime: string;
  consumptionamount: number;
  productionamount: number;
  hourlyprice: number;
}

export interface SingleDayResponse {
  date: string;
  hourlyData: HourlyData[];
  summary: {
    avgPrice: number;
    cheapestHours: TopHours[];
    mostExpensiveHours: TopHours[];
    maxDiffHour: MaxDiffHour;
    totalConsumptionKwh: number;
    totalProductionMwh: number;
  };
  quality: DataQuality;
}
