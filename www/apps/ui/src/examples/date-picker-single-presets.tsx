import { DatePicker } from "@medusajs/ui"

export default function DatePickerSinglePresets() {
  return (
    <div className="w-[250px]">
      <DatePicker
        placeholder="Pick a date"
        presets={[
          {
            date: new Date(),
            label: "Today",
          },
          {
            label: "Tomorrow",
            date: new Date(new Date().setDate(new Date().getDate() + 1)),
          },
          {
            label: "A week from now",
            date: new Date(new Date().setDate(new Date().getDate() + 7)),
          },
          {
            label: "A month from now",
            date: new Date(new Date().setMonth(new Date().getMonth() + 1)),
          },
          {
            label: "A year from now",
            date: new Date(
              new Date().setFullYear(new Date().getFullYear() + 1)
            ),
          },
        ]}
      />
    </div>
  )
}
