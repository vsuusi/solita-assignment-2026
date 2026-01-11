// lowercase instead of pascalCase to match db structure
export interface ElectricityData {
  id: number;
  date: Date;
  starttime: Date;
  productionamount: number; // MWh/h
  consumptionamount: number; // kWh
  hourlyprice: number;
}

export interface SingleDayStats {
  totalProductionMwh: number;
  totalConsumptionMwh: number;
  averagePrice: number;
  hourWithMaxConsumption: string; // time string
  cheapestHours: Array<string>; // time strings
  warnings?: SingleDayWarnings;
}

export interface SingleDayWarnings {
  rowCountWarning?: string;
  totalProductionWarning?: string;
  totalConsumptionWarning?: string;
  averagePriceWarning?: string;
  hourWithMaxConsumptionWarning?: string;
  cheapestHoursWarning?: string;
}
