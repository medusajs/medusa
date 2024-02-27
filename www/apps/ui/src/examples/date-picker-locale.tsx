import { DatePicker } from "@medusajs/ui"
import { es } from "date-fns/locale"

export default function DatePickerDemo() {
  return (
    <div className="w-[250px]">
      <DatePicker locale={es} placeholder="Elija una fecha" />
    </div>
  )
}
