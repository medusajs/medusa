"use client"

import { CalendarDate, CalendarDateTime, getLocalTimeZone } from "@internationalized/date"
import { CalendarMini, Clock, XMarkMini } from "@medusajs/icons"
import { cva } from "cva"
import * as React from "react"
import {
  DateValue,
  useDatePicker,
  useInteractOutside,
  type AriaDatePickerProps as BaseDatePickerProps,
} from "react-aria"
import { useDatePickerState } from "react-stately"

import { InternalCalendar } from "@/components/calender"
import { Popover } from "@/components/popover"
import { TimeInput } from "@/components/time-input"
import { Granularity } from "@/types"
import {
  createCalendarDateFromDate,
  getDefaultCalendarDateFromDate,
  updateCalendarDateFromDate,
} from "@/utils/calendar"
import { clx } from "@/utils/clx"

import { DatePickerButton } from "./date-picker-button"
import { DatePickerClearButton } from "./date-picker-clear-button"
import { DatePickerField } from "./date-picker-field"

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
  extends Omit<BaseDatePickerProps<CalendarDateTime | CalendarDate>, keyof DatePickerValueProps>,
    DatePickerValueProps {}

const datePickerStyles = (
  isOpen: boolean,
  isInvalid: boolean,
  value?: DateValue | null
) =>
  cva({
    base: clx(
      "bg-ui-bg-field shadow-borders-base txt-compact-small text-ui-fg-base transition-fg grid items-center gap-2 overflow-hidden rounded-md h-fit",
      "focus-within:shadow-borders-interactive-with-active focus-visible:shadow-borders-interactive-with-active",
      "aria-[invalid=true]:shadow-borders-error invalid:shadow-borders-error",
      {
        "shadow-borders-interactive-with-active": isOpen,
        "shadow-borders-error": isInvalid,
        "pr-2": !value,
      }
    ),
    variants: {
      size: {
        small: clx("grid-cols-[28px_1fr]", {
          "grid-cols-[28px_1fr_28px]": !!value,
        }),
        base: clx("grid-cols-[32px_1fr]", {
          "grid-cols-[32px_1fr_32px]": !!value,
        }),
      },
    },
  })

const HAS_TIME = new Set<Granularity>(["hour","minute", "second"])

const DatePicker = React.forwardRef<HTMLDivElement, DatePickerProps>(({
  size = "base",
  shouldCloseOnSelect = true,
  className,
  ...props
}, ref) => {
  const [value, setValue] = React.useState<CalendarDateTime | CalendarDate | null | undefined>(
    getDefaultCalendarDateFromDate(props.value, props.defaultValue, props.granularity)
  )

  const innerRef = React.useRef<HTMLDivElement>(null)
  React.useImperativeHandle(ref, () => innerRef.current as HTMLDivElement)

  const contentRef = React.useRef<HTMLDivElement>(null)

  const _props = convertProps(props, setValue)

  const state = useDatePickerState({
    ..._props,
    shouldCloseOnSelect,
  })

  const { groupProps, fieldProps, buttonProps, dialogProps, calendarProps } =
    useDatePicker(_props, state, innerRef)

  React.useEffect(() => {
    setValue(props.value ? updateCalendarDateFromDate(value, props.value, props.granularity) : null)
    state.setValue(props.value ? updateCalendarDateFromDate(value, props.value, props.granularity) : null)
  }, [props.value])

  function clear(e: React.MouseEvent<HTMLButtonElement>) {
    e.preventDefault()
    e.stopPropagation()

    props.onChange?.(null)
    state.setValue(null)
  }

  useInteractOutside({
    ref: contentRef,
    onInteractOutside: () => {
      state.setOpen(false)
    },
  })

  const hasTime = props.granularity && HAS_TIME.has(props.granularity)
  const Icon = hasTime ? Clock : CalendarMini

  return (
    <Popover open={state.isOpen} onOpenChange={state.setOpen}>
      <Popover.Anchor asChild>
        <div
          ref={ref}
          className={clx(
            datePickerStyles(
              state.isOpen,
              state.isInvalid,
              state.value
            )({ size }),
            className
          )}
          {...groupProps}
        >
          <DatePickerButton {...buttonProps} size={size}>
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
      <Popover.Content
        ref={contentRef}
        {...dialogProps}
        className="flex flex-col divide-y p-0"
      >
        <div className="p-3">
          <InternalCalendar autoFocus {...calendarProps} />
        </div>
        {state.hasTime && (
          <div className="p-3">
            <TimeInput
              value={state.timeValue}
              onChange={state.setTimeValue}
              hourCycle={props.hourCycle}
            />
          </div>
        )}
      </Popover.Content>
    </Popover>
  )
})
DatePicker.displayName = "DatePicker"

function convertProps(
  props: DatePickerProps,
  setValue: React.Dispatch<
    React.SetStateAction<CalendarDateTime | CalendarDate | null | undefined>
  >
): BaseDatePickerProps<CalendarDateTime | CalendarDate> {
  const {
    minValue,
    maxValue,
    isDateUnavailable: _isDateUnavailable,
    onChange: _onChange,
    value: __value__,
    defaultValue: __defaultValue__,
    ...rest
  } = props

  const onChange = (value: CalendarDateTime | CalendarDateTime | null) => {
    setValue(value)
    _onChange?.(value ? value.toDate(getLocalTimeZone()) : null)
  }

  const isDateUnavailable = (date: DateValue) => {
    const _date = date.toDate(getLocalTimeZone())

    return _isDateUnavailable ? _isDateUnavailable(_date) : false
  }

  return {
    ...rest,
    onChange: onChange as BaseDatePickerProps<CalendarDateTime | CalendarDate>["onChange"],
    isDateUnavailable,
    minValue: minValue ? createCalendarDateFromDate(minValue, props.granularity) : minValue,
    maxValue: maxValue ? createCalendarDateFromDate(maxValue, props.granularity) : maxValue,
  }
}

export { DatePicker, type Granularity }
