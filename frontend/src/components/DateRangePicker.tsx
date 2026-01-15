import DatePicker from "react-datepicker";
import "./DateRangePicker.css";

interface DateRangePickerProps {
  startDate: Date | null;
  endDate: Date | null;
  onStartDateChange: (date: Date | null) => void;
  onEndDateChange: (date: Date | null) => void;
}

function DateRangePicker({
  startDate,
  endDate,
  onStartDateChange,
  onEndDateChange,
}: DateRangePickerProps) {
  return (
    <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
      <DatePicker
        selected={startDate}
        onChange={onStartDateChange}
        selectsStart
        startDate={startDate}
        endDate={endDate}
        placeholderText="Start Date"
        dateFormat="yyyy-MM-dd"
        isClearable
        className="date-input"
      />

      <span style={{ color: "#777" }}>—</span>

      <DatePicker
        selected={endDate}
        onChange={onEndDateChange}
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
  );
}

export default DateRangePicker;
