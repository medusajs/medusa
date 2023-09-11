import { Calendar } from "@medusajs/ui"
import * as React from "react"
import type { DateRange } from "react-day-picker"

export default function CalendarRange() {
  const [dates, setDates] = React.useState<DateRange | undefined>()

  const setDateRange = (range: DateRange | undefined) => {
    setDates(range)
  }

  return <Calendar selected={dates} onSelect={setDateRange} mode="range" />
}
