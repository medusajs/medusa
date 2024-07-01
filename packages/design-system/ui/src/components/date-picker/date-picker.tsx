"use client"

import { CalendarDate, getLocalTimeZone } from "@internationalized/date"
import { CalendarMini, Clock, XMarkMini } from "@medusajs/icons"
import { cva } from "cva"
import * as React from "react"
import {
  DateValue,
  useDatePicker,
  type AriaDatePickerProps as BaseDatePickerProps,
} from "react-aria"
import { useDatePickerState } from "react-stately"

import { InternalCalendar } from "@/components/calender"
import { Popover } from "@/components/popover"
import { TimeInput } from "@/components/time-input"
import { createCalendarDate, getDefaultValue, updateCalendarDate } from "@/utils/calendar"
import { clx } from "@/utils/clx"

import { DatePickerButton } from "./date-picker-button"
import { DatePickerClearButton } from "./date-picker-clear-button"
import { DatePickerField } from "./date-picker-field"

type Granularity = 'day' | 'hour' | 'minute' | 'second'

type DatePickerValueProps = {
  defaultValue?: Date | null
  value?: Date | null
  onChange?: (value: Date | null) => void
  isDateUnavailable?: (date: Date) => boolean
  minValue?: Date
  maxValue?: Date
  shouldCloseOnSelect?: boolean
  granularity?: Granularity
  size?: "base" | "small"
  className?: string
}


interface DatePickerProps
  extends Omit<BaseDatePickerProps<CalendarDate>, keyof DatePickerValueProps>,
    DatePickerValueProps {}

const datePickerStyles = (
  isOpen: boolean,
  isInvalid: boolean,
  value?: DateValue | null
) =>
  cva({
    base: clx(
      "bg-ui-bg-field shadow-borders-base txt-compact-small text-ui-fg-base transition-fg grid items-center gap-2 overflow-hidden rounded-md pr-2",
      "focus-within:shadow-borders-interactive-with-active focus-visible:shadow-borders-interactive-with-active",
      "aria-[invalid=true]:shadow-borders-error invalid:shadow-borders-error",
      {
        "shadow-borders-interactive-with-active": isOpen,
        "shadow-borders-error": isInvalid,
      }
    ),
    variants: {
      size: {
        small: clx("grid-cols-[28px_1fr]", {
          "grid-cols-[28px_1fr_15px]": !!value,
        }),
        base: clx("grid-cols-[32px_1fr]", {
          "grid-cols-[32px_1fr_15px]": !!value,
        }),
      },
    },
  })

const DatePicker = ({
  size = "base",
  shouldCloseOnSelect = true,
  className,
  ...props
}: DatePickerProps) => {
  const [value, setValue] = React.useState<CalendarDate | null | undefined>(
    getDefaultValue(props.value, props.defaultValue)
  )

  const ref = React.useRef<HTMLDivElement>(null)
  const buttonRef = React.useRef<HTMLButtonElement>(null)

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

  function clear(e: React.MouseEvent<HTMLButtonElement>) {
    e.preventDefault()
    e.stopPropagation()

    props.onChange?.(null)
    state.setValue(null)
  }

  const hasTime = props.granularity === "minute" || props.granularity === "second"
  const Icon = hasTime ? Clock : CalendarMini


  return (
    <Popover open={state.isOpen} onOpenChange={state.setOpen}>
      <Popover.Anchor asChild>
        <div
          ref={ref}
          className={clx(
            datePickerStyles(state.isOpen, state.isInvalid, state.value)({ size }),
            className
          )}
          {...groupProps}
        >
          <DatePickerButton ref={buttonRef} {...buttonProps} size={size}>
            <Icon />
          </DatePickerButton>
          <DatePickerField {...fieldProps} size={size} />
          {!!state.value && (
            <DatePickerClearButton onClick={clear}>
              <XMarkMini />
            </DatePickerClearButton>
          )}
        </div>
      </Popover.Anchor>
      <Popover.Content {...dialogProps} className="flex flex-col divide-y p-0">
        <div className="p-3">
          <InternalCalendar {...calendarProps} />
        </div>
        {state.hasTime && (
          <div className="p-3">
            <TimeInput
              value={state.timeValue}
              onChange={state.setTimeValue}
              aria-labelledby={props["aria-labelledby"]}
            />
          </div>
        )}
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

export { DatePicker, type Granularity }
