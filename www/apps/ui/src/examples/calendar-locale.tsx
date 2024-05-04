import { Calendar } from "@medusajs/ui"
import * as React from "react"
import { es } from "date-fns/locale"

export default function CalendarDemo() {
  const [date, setDate] = React.useState<Date | undefined>()

  return <Calendar selected={date} onSelect={setDate} locale={es} />
}
