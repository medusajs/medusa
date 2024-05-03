import { DatePicker } from "@medusajs/ui"

export default function DatePickerRangeTime() {
  return (
    <div className="w-[250px]">
      <DatePicker showTimePicker mode="range" placeholder="Pick a date" />
    </div>
  )
}
