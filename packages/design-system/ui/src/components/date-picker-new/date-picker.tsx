"use client"

import { CalendarDate, getLocalTimeZone } from "@internationalized/date"
import { CalendarMini, XMarkMini } from "@medusajs/icons"
import * as React from "react"
import {
  DateValue,
  useDatePicker,
  type AriaDatePickerProps as BaseDatePickerProps,
} from "react-aria"
import { useDatePickerState } from "react-stately"

import { InternalCalendar } from "@/components/calender-new"
import { Popover } from "@/components/popover"
import { clx } from "@/utils/clx"

import { DatePickerButton } from "./date-picker-button"
import { DatePickerClearButton } from "./date-picker-clear-button"

type DatePickerValueProps = {
  defaultValue?: Date | null
  value?: Date | null
  onChange?: (value: Date | null) => void
  isDateUnavailable?: (date: Date) => boolean
  minValue?: Date
  maxValue?: Date
  shouldCloseOnSelect?: boolean
  size?: "base" | "small"
  className?: string
}

interface DatePickerProps
  extends Omit<BaseDatePickerProps<CalendarDate>, keyof DatePickerValueProps>,
    DatePickerValueProps {}

const DatePicker = ({
  size = "base",
  shouldCloseOnSelect = true,
  className,
  ...props
}: DatePickerProps) => {
  const [value, setValue] = React.useState<CalendarDate | null | undefined>(
    getDefaultValue(props.value, props.defaultValue)
  )

  const ref = React.useRef(null)
  const _props = convertProps(props, setValue)

  const state = useDatePickerState({
    ..._props,
    shouldCloseOnSelect,
  })
  const { groupProps, fieldProps, buttonProps, dialogProps, calendarProps } =
    useDatePicker(_props, state, ref)

  React.useEffect(() => {
    setValue(props.value ? updateCalendarDate(value, props.value) : null)
    state.setValue(props.value ? updateCalendarDate(value, props.value) : null)
  }, [props.value])

  function clear() {
    props.onChange?.(null)
  }

  return (
    <Popover open={state.isOpen} onOpenChange={state.setOpen}>
      <Popover.Anchor asChild>
        <div ref={ref} className={clx(className)} {...groupProps}>
          <DatePickerButton {...buttonProps} size={size}>
            <CalendarMini />
          </DatePickerButton>
          {!!state.value && (
            <DatePickerClearButton onClick={clear}>
              <XMarkMini />
            </DatePickerClearButton>
          )}
        </div>
      </Popover.Anchor>
      <Popover.Content {...dialogProps}>
        <InternalCalendar {...calendarProps} />
      </Popover.Content>
    </Popover>
  )
}

function convertProps(
  props: DatePickerProps,
  setValue: React.Dispatch<
    React.SetStateAction<CalendarDate | null | undefined>
  >
): BaseDatePickerProps<CalendarDate> {
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
  return new CalendarDate(
    date.getFullYear(),
    date.getMonth() + 1,
    date.getDate()
  )
}

function updateCalendarDate(
  date: CalendarDate | null | undefined,
  value: Date
) {
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

export { DatePicker }
