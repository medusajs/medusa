import { DatePicker } from "@medusajs/ui"

export default function DatePickerRangePresetsTime() {
  return (
    <div className="w-[250px]">
      <DatePicker
        placeholder="Pick a date"
        showTimePicker
        mode="range"
        presets={[
          {
            dateRange: {
              to: new Date(),
              from: new Date(),
            },
            label: "Today",
          },
          {
            label: "Past 7 days",
            dateRange: {
              to: new Date(),
              from: new Date(new Date().setDate(new Date().getDate() - 7)),
            },
          },
          {
            label: "Past 30 days",
            dateRange: {
              to: new Date(),
              from: new Date(new Date().setDate(new Date().getDate() - 30)),
            },
          },
          {
            label: "Past 90 days",
            dateRange: {
              to: new Date(),
              from: new Date(new Date().setDate(new Date().getDate() - 90)),
            },
          },
          {
            label: "Past year",
            dateRange: {
              to: new Date(),
              from: new Date(
                new Date().setFullYear(new Date().getFullYear() - 1)
              ),
            },
          },
        ]}
      />
    </div>
  )
}
