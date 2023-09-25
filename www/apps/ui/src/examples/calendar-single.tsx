import { Calendar } from "@medusajs/ui"
import * as React from "react"

export default function CalendarSingle() {
  const [date, setDate] = React.useState<Date | undefined>()

  return <Calendar selected={date} onSelect={setDate} />
}
