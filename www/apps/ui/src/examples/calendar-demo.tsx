import { Calendar } from "@medusajs/ui"
import * as React from "react"

export default function CalendarDemo() {
  const [date, setDate] = React.useState<Date | null>()

  return <Calendar value={date} onChange={setDate} />
}
