import { DatePicker } from "@medusajs/ui"

export default function DatePickerRange() {
  return (
    <div className="w-[250px]">
      <DatePicker mode="range" placeholder="Pick a date" />
    </div>
  )
}
