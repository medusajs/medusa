import {
  CalendarDate,
  createCalendar,
  getLocalTimeZone,
} from "@internationalized/date"
import { TriangleLeftMini, TriangleRightMini } from "@medusajs/icons"
import * as React from "react"
import {
  DateValue,
  useCalendar,
  useLocale,
  type CalendarProps as BaseCalendarProps,
} from "react-aria"
import { useCalendarState } from "react-stately"

import { CalendarButton } from "./calendar-button"
import { CalendarGrid } from "./calendar-grid"

interface CalendarValueProps {
  value?: Date | null
  defaultValue?: Date | null
  onChange?: (value: Date | null) => void
  isDateUnavailable?: (date: Date) => boolean
  minValue?: Date
  maxValue?: Date
}

interface CalendarProps
  extends Omit<BaseCalendarProps<CalendarDate>, keyof CalendarValueProps>,
    CalendarValueProps {}

const Calendar = (props: CalendarProps) => {
  const [value, setValue] = React.useState<CalendarDate | null | undefined>(
    getDefaultValue(props.value, props.defaultValue)
  )

  const { locale } = useLocale()
  const _props = convertProps(props, setValue)

  const state = useCalendarState({
    ..._props,
    value,
    locale,
    createCalendar,
  })

  React.useEffect(() => {
    setValue(props.value ? updateCalendarDate(value, props.value) : null)
  }, [props.value])

  const { calendarProps, prevButtonProps, nextButtonProps, title } =
    useCalendar({ value, ..._props}, state)

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

function convertProps(
  props: CalendarProps,
  setValue: React.Dispatch<
    React.SetStateAction<CalendarDate | null | undefined>
  >
): BaseCalendarProps<CalendarDate> {
  const {
    minValue,
    maxValue,
    isDateUnavailable: _isDateUnavailable,
    onChange: _onChange,
    value: __value__,
    defaultValue: __defaultValue__,
    ...rest
  } = props

  const onChange = (value: CalendarDate | null) => {
    setValue(value)
    _onChange?.(value ? value.toDate(getLocalTimeZone()) : null)
  }

  const isDateUnavailable = (date: DateValue) => {
    const _date = date.toDate(getLocalTimeZone())

    return _isDateUnavailable ? _isDateUnavailable(_date) : false
  }

  return {
    ...rest,
    onChange,
    isDateUnavailable,
    minValue: minValue ? createCalendarDate(minValue) : minValue,
    maxValue: maxValue ? createCalendarDate(maxValue) : maxValue,
  }
}

function getDefaultValue(
  value: Date | null | undefined,
  defaultValue: Date | null | undefined
) {
  if (value) {
    return createCalendarDate(value)
  }

  if (defaultValue) {
    return createCalendarDate(defaultValue)
  }

  return null
}

/**
 * Create a CalendarDate object from a Date object. The month is using a 1-based index in CalendarDate,
 * while Date object uses a 0-based index.
 * @returns The created CalendarDate object.
 */
function createCalendarDate(date: Date) {
  return new CalendarDate(date.getFullYear(), date.getMonth() + 1, date.getDate())
}

function updateCalendarDate(date: CalendarDate | null | undefined, value: Date) {
  if (!date) {
    return createCalendarDate(value)
  }

  date.set({
    day: value.getDate(),
    month: value.getMonth() + 1,
    year: value.getFullYear(),
  })

  return date
}

export { Calendar }
