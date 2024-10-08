"use client"

import { CalendarDate } from "@internationalized/date"
import * as React from "react"
import { useCalendarCell } from "react-aria"
import { CalendarState } from "react-stately"

import { clx } from "@/utils/clx"

interface CalendarCellProps {
  date: CalendarDate
  state: CalendarState
}

const CalendarCell = ({ state, date }: CalendarCellProps) => {
  const ref = React.useRef(null)
  const {
    cellProps,
    buttonProps,
    isSelected,
    isOutsideVisibleRange,
    isDisabled,
    isUnavailable,
    formattedDate,
  } = useCalendarCell({ date }, state, ref)

  const isToday = getIsToday(date)

  return (
    <td {...cellProps} className="p-1">
      <div
        {...buttonProps}
        ref={ref}
        hidden={isOutsideVisibleRange}
        className={clx(
          "bg-ui-bg-base txt-compact-small relative flex size-8 items-center justify-center rounded-md outline-none transition-fg border border-transparent",
          "hover:bg-ui-bg-base-hover",
          "focus-visible:shadow-borders-focus focus-visible:border-ui-border-interactive",
          {
            "!bg-ui-bg-interactive !text-ui-fg-on-color": isSelected,
            "hidden": isOutsideVisibleRange,
            "text-ui-fg-muted hover:!bg-ui-bg-base cursor-default": isDisabled || isUnavailable,
          }
        )}
      >
        {formattedDate}
        {isToday && (
          <div
            role="none"
            className={clx(
              "bg-ui-bg-interactive absolute bottom-[3px] left-1/2 size-[3px] -translate-x-1/2 rounded-full transition-fg",
              {
                "bg-ui-fg-on-color": isSelected,
              }
            )}
          />
        )}
      </div>
    </td>
  )
}

/**
 * Check if the date is today. The CalendarDate is using a 1-based index for the month.
 * @returns Whether the CalendarDate is today.
 */
function getIsToday(date: CalendarDate) {
  const today = new Date()
  return (
    [date.year, date.month, date.day].join("-") ===
    [today.getFullYear(), today.getMonth() + 1, today.getDate()].join("-")
  )
}

export { CalendarCell }
