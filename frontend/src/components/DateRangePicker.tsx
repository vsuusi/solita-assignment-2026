import { useState } from "react";

import DatePicker from "react-datepicker";
import "./DateRangePicker.css";

interface DateRangePickerProps {
  onDateRangeChange: (
    startDate?: string,
    endDate?: string,
    clear?: boolean,
  ) => void;
}

function DateRangePicker({ onDateRangeChange }: DateRangePickerProps) {
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);

  const dateToString = (date: Date | null): string | undefined => {
    if (date === null) return undefined;
    return date.toISOString().split("T")[0];
  };

  const handleStartChange = (date: Date | null) => {
    setStartDate(date);
    const startStr = dateToString(date);
    const endStr = dateToString(endDate);
    onDateRangeChange(startStr, endStr, false);
  };

  const handleEndChange = (date: Date | null) => {
    setEndDate(date);
    const startStr = dateToString(startDate);
    const endStr = dateToString(date);
    onDateRangeChange(startStr, endStr, false);
  };

  return (
    <div className="date-inputs">
      <div data-testid="start-date-picker" className="picker-cage">
        <DatePicker
          selected={startDate}
          onChange={handleStartChange}
          selectsStart
          startDate={startDate}
          endDate={endDate}
          placeholderText="Start Date"
          dateFormat="yyyy-MM-dd"
          isClearable
          className="date-input"
        />
      </div>

      <div data-testid="end-date-picker" className="picker-cage">
        <DatePicker
          selected={endDate}
          onChange={handleEndChange}
          selectsEnd
          startDate={startDate}
          endDate={endDate}
          minDate={startDate || undefined}
          placeholderText="End Date"
          dateFormat="yyyy-MM-dd"
          isClearable
          className="date-input"
        />
      </div>
    </div>
  );
}

export default DateRangePicker;
