import { DatePicker } from "@medusajs/ui"

export default function DatePickerSingleTime() {
  return (
    <div className="w-[250px]">
      <DatePicker showTimePicker placeholder="Pick a date" />
    </div>
  )
}
