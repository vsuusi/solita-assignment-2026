// need to ensure cons and prod units are consistent
export interface ElectricityDataRow {
  avgPrice: number;
  date: string;
  hoursCount: number;
  totalConsumptionMwh: number;
  totalProductionMwh: number;
}

export interface ApiResult {
  rows: ElectricityDataRow[];
  rowCount: number;
}

export interface ApiResponse {
  result: ApiResult;
  meta: {
    limit: number;
    page: number;
  };
}
