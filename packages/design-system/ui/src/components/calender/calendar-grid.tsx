import { getWeeksInMonth } from "@internationalized/date"
import * as React from "react"
import { AriaCalendarGridProps, useCalendarGrid, useLocale } from "react-aria"

import { CalendarState } from "react-stately"
import { CalendarCell } from "./calendar-cell"

interface CalendarGridProps extends AriaCalendarGridProps {
  state: CalendarState
}

const CalendarGrid = ({ state, ...props }: CalendarGridProps) => {
  const { locale } = useLocale()
  const { gridProps, headerProps, weekDays } = useCalendarGrid(props, state)

  const weeksInMonth = getWeeksInMonth(state.visibleRange.start, locale)

  return (
    <table {...gridProps}>
      <thead {...headerProps}>
        <tr>
          {weekDays.map((day, index) => (
            <th key={index} className="txt-compact-small-plus text-ui-fg-muted size-8 p-1 rounded-md">{day}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {[...new Array(weeksInMonth).keys()].map((weekIndex) => (
          <tr key={weekIndex}>
            {state
              .getDatesInWeek(weekIndex)
              .map((date, i) =>
                date ? (
                  <CalendarCell key={i} state={state} date={date} />
                ) : (
                  <td key={i} />
                )
              )}
          </tr>
        ))}
      </tbody>
    </table>
  )
}

export { CalendarGrid }
