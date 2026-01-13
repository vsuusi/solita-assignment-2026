// lowercase instead of pascalCase to match db structure
export interface ElectricityData {
  id: number;
  date: string;
  starttime: string;
  productionamount: number | null; // MWh/h
  consumptionamount: number | null; // kWh
  hourlyprice: number | null; //
}

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

export interface DailyListMeta {
  page: number;
  limit: number;
}

export interface SingleDayStats {
  date: string;
  summary: {
    totalProductionMwh: number;
    totalConsumptionKwh: number;
    avgPrice: number;
    maxDiffHour: { time: string; value: number } | null;
    cheapestHours: { time: string; price: number }[];
  };
  quality: DataQuality;
  hourlyData: ElectricityData[];
}
