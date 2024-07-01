"use client"

import { createCalendar } from "@internationalized/date"
import { TriangleLeftMini, TriangleRightMini } from "@medusajs/icons"
import * as React from "react"
import {
    DateValue,
    useCalendar,
    useLocale,
    type CalendarProps,
} from "react-aria"
import { useCalendarState } from "react-stately"

import { CalendarButton } from "./calendar-button"
import { CalendarGrid } from "./calendar-grid"

/**
 * InternalCalendar is the internal implementation of the Calendar component.
 * It's not for public use, but only used for other components like DatePicker.
 */
const InternalCalendar = <TDateValue extends DateValue>(
  props: CalendarProps<TDateValue>
) => {
  const { locale } = useLocale()

  const state = useCalendarState({
    ...props,
    locale,
    createCalendar,
  })

  const { calendarProps, prevButtonProps, nextButtonProps, title } =
    useCalendar(props, state)

  return (
    <div {...calendarProps} className="flex flex-col gap-y-2">
      <div className="bg-ui-bg-field border-base grid grid-cols-[28px_1fr_28px] items-center gap-1 rounded-md border p-0.5">
        <CalendarButton {...prevButtonProps}>
          <TriangleLeftMini />
        </CalendarButton>
        <div className="flex items-center justify-center">
          <h2 className="txt-compact-small-plus">{title}</h2>
        </div>
        <CalendarButton {...nextButtonProps}>
          <TriangleRightMini />
        </CalendarButton>
      </div>
      <CalendarGrid state={state} />
    </div>
  )
}

export { InternalCalendar }
