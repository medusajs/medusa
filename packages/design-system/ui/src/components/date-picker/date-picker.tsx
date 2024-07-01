"use client"

import { Time } from "@internationalized/date"
import { Calendar as CalendarIcon, Minus } from "@medusajs/icons"
import * as Primitives from "@radix-ui/react-popover"
import { TimeValue } from "@react-aria/datepicker"
import { format, type Locale } from "date-fns"
import * as React from "react"

import { Button } from "@/components/button"
import { Calendar as CalendarPrimitive } from "@/components/calendar"
import { TimeInput } from "@/components/time-input"
import type { DateRange } from "@/types"
import { clx } from "@/utils/clx"
import { isBrowserLocaleClockType24h } from "@/utils/is-browser-locale-hour-cycle-24h"
import { cva } from "cva"

const displayVariants = cva({
  base: clx(
    "text-ui-fg-base bg-ui-bg-field transition-fg shadow-buttons-neutral flex w-full items-center gap-x-2 rounded-md outline-none",
    "hover:bg-ui-bg-field-hover",
    "focus-visible:shadow-borders-interactive-with-active data-[state=open]:shadow-borders-interactive-with-active",
    "disabled:bg-ui-bg-disabled disabled:text-ui-fg-disabled disabled:shadow-buttons-neutral",
    "aria-[invalid=true]:!shadow-borders-error"
  ),
  variants: {
    size: {
      base: "txt-compact-small h-8 pr-2 py-1.5",
      small: "txt-compact-small h-7 pr-2 py-1",
    },
  },
  defaultVariants: {
    size: "base",
  },
})

interface DisplayProps extends React.ComponentProps<"button"> {
  placeholder?: string
  size?: "small" | "base"
}

const Display = React.forwardRef<HTMLButtonElement, DisplayProps>(
  (
    {
      className,
      children,
      /**
       * Placeholder of the date picker's input.
       */
      placeholder,
      /**
       * The size of the date picker's input.
       */
      size = "base",
      ...props
    }: DisplayProps,
    ref
  ) => {
    return (
      <Primitives.Trigger asChild>
        <button
          ref={ref}
          className={clx(displayVariants({ size }), className)}
          {...props}
        >
          <span className={clx("flex items-center justify-center size-8 border-r", {
            "size-7": size === "small",
          })}>
          <CalendarIcon className="text-ui-fg-muted" />
          </span>
          <span className="flex-1 overflow-hidden text-ellipsis whitespace-nowrap text-left">
            {children ? (
              children
            ) : placeholder ? (
              <span className="text-ui-fg-muted">{placeholder}</span>
            ) : null}
          </span>
        </button>
      </Primitives.Trigger>
    )
  }
)
Display.displayName = "DatePicker.Display"

const Flyout = React.forwardRef<
  React.ElementRef<typeof Primitives.Content>,
  React.ComponentProps<typeof Primitives.Content>
>(({ className, children, ...props }, ref) => {
  return (
    <Primitives.Portal>
      <Primitives.Content
        ref={ref}
        sideOffset={8}
        align="center"
        className={clx(
          "txt-compact-small shadow-elevation-flyout bg-ui-bg-base w-fit rounded-lg",
          "animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95",
          "data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
          className
        )}
        {...props}
      >
        {children}
      </Primitives.Content>
    </Primitives.Portal>
  )
})
Flyout.displayName = "DatePicker.Flyout"

interface Preset {
  /**
   * The preset's label.
   */
  label: string
}

interface DatePreset extends Preset {
  /**
   * The preset's selected date.
   */
  date: Date
}

interface DateRangePreset extends Preset {
  /**
   * The preset's selected date range.
   */
  dateRange: DateRange
}

type PresetContainerProps<TPreset extends Preset, TValue> = {
  presets: TPreset[] | TPreset[]
  onSelect: (value: TValue) => void
  currentValue?: TValue
}

const PresetContainer = <TPreset extends Preset, TValue>({
  /**
   * Selectable preset configurations.
   */
  presets,
  /**
   * A function that handles the event when a preset is selected.
   */
  onSelect,
  /**
   * The currently selected preset.
   */
  currentValue,
}: PresetContainerProps<TPreset, TValue>) => {
  const isDateRangePresets = (preset: any): preset is DateRangePreset => {
    return "dateRange" in preset
  }

  const isDatePresets = (preset: any): preset is DatePreset => {
    return "date" in preset
  }

  const handleClick = (preset: TPreset) => {
    if (isDateRangePresets(preset)) {
      onSelect(preset.dateRange as TValue)
    } else if (isDatePresets(preset)) {
      onSelect(preset.date as TValue)
    }
  }

  const compareDates = (date1: Date, date2: Date) => {
    return (
      date1.getDate() === date2.getDate() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getFullYear() === date2.getFullYear()
    )
  }

  const compareRanges = (range1: DateRange, range2: DateRange) => {
    const from1 = range1.from
    const from2 = range2.from

    let equalFrom = false

    if (from1 && from2) {
      const sameFrom = compareDates(from1, from2)

      if (sameFrom) {
        equalFrom = true
      }
    }

    const to1 = range1.to
    const to2 = range2.to

    let equalTo = false

    if (to1 && to2) {
      const sameTo = compareDates(to1, to2)

      if (sameTo) {
        equalTo = true
      }
    }

    return equalFrom && equalTo
  }

  const matchesCurrent = (preset: TPreset) => {
    if (isDateRangePresets(preset)) {
      const value = currentValue as DateRange | undefined

      return value && compareRanges(value, preset.dateRange)
    } else if (isDatePresets(preset)) {
      const value = currentValue as Date | undefined

      return value && compareDates(value, preset.date)
    }

    return false
  }

  return (
    <ul className="flex flex-col items-start">
      {presets.map((preset, index) => {
        return (
          <li key={index} className="w-full">
            <button
              className={clx(
                "txt-compact-small-plus w-full overflow-hidden text-ellipsis whitespace-nowrap rounded-md p-2 text-left",
                "text-ui-fg-subtle hover:bg-ui-bg-base-hover outline-none transition-all",
                "focus-visible:bg-ui-bg-base-hover",
                {
                  "!bg-ui-bg-base-pressed": matchesCurrent(preset),
                }
              )}
              onClick={() => handleClick(preset)}
              aria-label={`Select ${preset.label}`}
            >
              {preset.label}
            </button>
          </li>
        )
      })}
    </ul>
  )
}
PresetContainer.displayName = "DatePicker.PresetContainer"

const formatDate = (date: Date, includeTime?: boolean) => {
  const usesAmPm = !isBrowserLocaleClockType24h()

  if (includeTime) {
    if (usesAmPm) {
      return format(date, "MMM d, yyyy h:mm a")
    }

    return format(date, "MMM d, yyyy HH:mm")
  }

  return format(date, "MMM d, yyyy")
}

type CalendarProps = {
  /**
   * The year to start showing the dates from.
   */
  fromYear?: number
  /**
   * The year to show dates to.
   */
  toYear?: number
  /**
   * The month to start showing dates from.
   */
  fromMonth?: Date
  /**
   * The month to show dates to.
   */
  toMonth?: Date
  /**
   * The day to start showing dates from.
   */
  fromDay?: Date
  /**
   * The day to show dates to.
   */
  toDay?: Date
  /**
   * The date to show dates from.
   */
  fromDate?: Date
  /**
   * The date to show dates to.
   */
  toDate?: Date
  /**
   * The locale to use for formatting dates. To change the locale pass a date-fns locale object.
   */
  locale?: Locale
}

type Translations = {
  cancel?: string
  apply?: string
  start?: string
  end?: string
  range?: string
}

interface PickerProps extends CalendarProps {
  /**
   * The class name to apply on the date picker.
   */
  className?: string
  /**
   * Whether the date picker's input is disabled.
   */
  disabled?: boolean
  /**
   * Whether the date picker's input is required.
   */
  required?: boolean
  /**
   * The date picker's placeholder.
   */
  placeholder?: string
  /**
   * The date picker's size.
   */
  size?: "small" | "base"
  /**
   * Whether to show a time picker along with the date picker.
   */
  showTimePicker?: boolean
  /**
   * Translation keys for the date picker. Use this to localize the date picker.
   */
  translations?: Translations
  id?: string
  "aria-invalid"?: boolean
  "aria-label"?: string
  "aria-labelledby"?: string
  "aria-required"?: boolean
}

interface SingleProps extends PickerProps {
  presets?: DatePreset[]
  defaultValue?: Date
  value?: Date
  onChange?: (date: Date | undefined) => void
}

const SingleDatePicker = React.forwardRef<HTMLButtonElement, SingleProps>(({
  defaultValue,
  value,
  size = "base",
  onChange,
  presets,
  showTimePicker,
  disabled,
  className,
  placeholder,
  translations,
  ...props
}: SingleProps, ref) => {
  const [open, setOpen] = React.useState(false)
  const [date, setDate] = React.useState<Date | undefined>(
    value ?? defaultValue ?? undefined
  )
  const [month, setMonth] = React.useState<Date | undefined>(date)

  const [time, setTime] = React.useState<TimeValue>(
    value
      ? new Time(value.getHours(), value.getMinutes())
      : defaultValue
      ? new Time(defaultValue.getHours(), defaultValue.getMinutes())
      : new Time(0, 0)
  )

  const initialDate = React.useMemo(() => {
    return date
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open])

  /**
   * Update the date when the value changes.
   */
  React.useEffect(() => {
    setDate(value ?? defaultValue ?? undefined)
  }, [value, defaultValue])

  React.useEffect(() => {
    if (date) {
      setMonth(date)
    }
  }, [date])

  React.useEffect(() => {
    if (!open) {
      setMonth(date)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open])

  const onCancel = () => {
    setDate(initialDate)
    setTime(
      initialDate
        ? new Time(initialDate.getHours(), initialDate.getMinutes())
        : new Time(0, 0)
    )
    setOpen(false)
  }

  const onOpenChange = (open: boolean) => {
    if (!open) {
      onCancel()
    }

    setOpen(open)
  }

  const onDateChange = (date: Date | undefined) => {
    const newDate = date

    if (showTimePicker) {
      /**
       * If the time is cleared, and the date is
       * changed then we want to reset the time.
       */
      if (newDate && !time) {
        setTime(new Time(0, 0))
      }

      /**
       * If the time is set, and the date is changed
       * then we want to update the date with the
       * time.
       */
      if (newDate && time) {
        newDate.setHours(time.hour)
        newDate.setMinutes(time.minute)
      }
    }

    setDate(newDate)
  }

  const onTimeChange = (time: TimeValue) => {
    setTime(time)

    if (!date) {
      return
    }

    const newDate = new Date(date.getTime())

    if (!time) {
      /**
       * When a segment of the time input is cleared,
       * it will return `null` as the value is no longer
       * a valid time. In this case, we want to set the
       * time to for the date, effectivly resetting the
       * input field.
       */
      newDate.setHours(0)
      newDate.setMinutes(0)
    } else {
      newDate.setHours(time.hour)
      newDate.setMinutes(time.minute)
    }

    setDate(newDate)
  }

  const formattedDate = React.useMemo(() => {
    if (!date) {
      return null
    }

    return formatDate(date, showTimePicker)
  }, [date, showTimePicker])

  const onApply = () => {
    setOpen(false)
    onChange?.(date)
  }

  return (
    <Primitives.Root modal open={open} onOpenChange={onOpenChange}>
      <Display
        placeholder={placeholder}
        disabled={disabled}
        className={className}
        aria-required={props.required || props["aria-required"]}
        aria-invalid={props["aria-invalid"]}
        aria-label={props["aria-label"]}
        aria-labelledby={props["aria-labelledby"]}
        size={size}
        ref={ref}
      >
        {formattedDate}
      </Display>
      <Flyout>
        <div className="flex">
          <div className="flex items-start">
            {presets && presets.length > 0 && (
              <div className="relative h-full w-[160px] border-r">
                <div className="absolute inset-0 overflow-y-scroll p-3">
                  <PresetContainer
                    currentValue={date}
                    presets={presets}
                    onSelect={onDateChange}
                  />
                </div>
              </div>
            )}
            <div>
              <CalendarPrimitive
                mode="single"
                month={month}
                onMonthChange={setMonth}
                selected={date}
                onSelect={onDateChange}
                disabled={disabled}
                {...props}
              />
              {showTimePicker && (
                <div className="border-ui-border-base border-t p-3">
                  <TimeInput
                    aria-label="Time"
                    onChange={onTimeChange}
                    isDisabled={!date}
                    value={time}
                    isRequired={props.required}
                  />
                </div>
              )}
              <div className="border-ui-border-base flex items-center gap-x-2 border-t p-3">
                <Button
                  variant="secondary"
                  size="small"
                  className="w-full"
                  type="button"
                  onClick={onCancel}
                >
                  {translations?.cancel ?? "Cancel"}
                </Button>
                <Button
                  variant="primary"
                  size="small"
                  className="w-full"
                  type="button"
                  onClick={onApply}
                >
                  {translations?.apply ?? "Apply"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </Flyout>
    </Primitives.Root>
  )
})

interface RangeProps extends PickerProps {
  presets?: DateRangePreset[]
  defaultValue?: DateRange
  value?: DateRange
  onChange?: (dateRange: DateRange | undefined) => void
}

const RangeDatePicker = React.forwardRef<HTMLButtonElement, RangeProps>(({
  /**
   * The date range selected by default.
   */
  defaultValue,
  /**
   * The selected date range.
   */
  value,
  /**
   * A function to handle the change in the selected date range.
   */
  onChange,
  size = "base",
  showTimePicker,
  /**
   * Provide selectable preset configurations.
   */
  presets,
  disabled,
  className,
  placeholder,
  translations,
  ...props
}: RangeProps, ref) => {
  const [open, setOpen] = React.useState(false)
  const [range, setRange] = React.useState<DateRange | undefined>(
    value ?? defaultValue ?? undefined
  )
  const [month, setMonth] = React.useState<Date | undefined>(range?.from)

  const [startTime, setStartTime] = React.useState<TimeValue>(
    value?.from
      ? new Time(value.from.getHours(), value.from.getMinutes())
      : defaultValue?.from
      ? new Time(defaultValue.from.getHours(), defaultValue.from.getMinutes())
      : new Time(0, 0)
  )
  const [endTime, setEndTime] = React.useState<TimeValue>(
    value?.to
      ? new Time(value.to.getHours(), value.to.getMinutes())
      : defaultValue?.to
      ? new Time(defaultValue.to.getHours(), defaultValue.to.getMinutes())
      : new Time(0, 0)
  )

  const initialRange = React.useMemo(() => {
    return range
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open])

  /**
   * Update the range when the value changes.
   */
  React.useEffect(() => {
    setRange(value ?? defaultValue ?? undefined)
  }, [value, defaultValue])

  React.useEffect(() => {
    if (range) {
      setMonth(range.from)
    }
  }, [range])

  React.useEffect(() => {
    if (!open) {
      setMonth(range?.from)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open])

  const onRangeChange = (range: DateRange | undefined) => {
    const newRange = range

    if (showTimePicker) {
      if (newRange?.from && !startTime) {
        setStartTime(new Time(0, 0))
      }

      if (newRange?.to && !endTime) {
        setEndTime(new Time(0, 0))
      }

      if (newRange?.from && startTime) {
        newRange.from.setHours(startTime.hour)
        newRange.from.setMinutes(startTime.minute)
      }

      if (newRange?.to && endTime) {
        newRange.to.setHours(endTime.hour)
        newRange.to.setMinutes(endTime.minute)
      }
    }

    setRange(newRange)
  }

  const onCancel = () => {
    setRange(initialRange)
    setStartTime(
      initialRange?.from
        ? new Time(initialRange.from.getHours(), initialRange.from.getMinutes())
        : new Time(0, 0)
    )
    setEndTime(
      initialRange?.to
        ? new Time(initialRange.to.getHours(), initialRange.to.getMinutes())
        : new Time(0, 0)
    )
    setOpen(false)
  }

  const onOpenChange = (open: boolean) => {
    if (!open) {
      onCancel()
    }

    setOpen(open)
  }

  const onTimeChange = (time: TimeValue, pos: "start" | "end") => {
    switch (pos) {
      case "start":
        setStartTime(time)
        break
      case "end":
        setEndTime(time)
        break
    }

    if (!range) {
      return
    }

    if (pos === "start") {
      if (!range.from) {
        return
      }

      const newDate = new Date(range.from.getTime())

      if (!time) {
        newDate.setHours(0)
        newDate.setMinutes(0)
      } else {
        newDate.setHours(time.hour)
        newDate.setMinutes(time.minute)
      }

      setRange({
        ...range,
        from: newDate,
      })
    }

    if (pos === "end") {
      if (!range.to) {
        return
      }

      const newDate = new Date(range.to.getTime())

      if (!time) {
        newDate.setHours(0)
        newDate.setMinutes(0)
      } else {
        newDate.setHours(time.hour)
        newDate.setMinutes(time.minute)
      }

      setRange({
        ...range,
        to: newDate,
      })
    }
  }

  const displayRange = React.useMemo(() => {
    if (!range) {
      return null
    }

    return `${range.from ? formatDate(range.from, showTimePicker) : ""} - ${
      range.to ? formatDate(range.to, showTimePicker) : ""
    }`
  }, [range, showTimePicker])

  const onApply = () => {
    setOpen(false)
    onChange?.(range)
  }

  return (
    <Primitives.Root modal open={open} onOpenChange={onOpenChange}>
      <Display
        placeholder={placeholder}
        disabled={disabled}
        className={className}
        aria-required={props.required || props["aria-required"]}
        aria-invalid={props["aria-invalid"]}
        aria-label={props["aria-label"]}
        aria-labelledby={props["aria-labelledby"]}
        size={size}
        ref={ref}
      >
        {displayRange}
      </Display>
      <Flyout>
        <div className="flex">
          <div className="flex items-start">
            {presets && presets.length > 0 && (
              <div className="relative h-full w-[160px] border-r">
                <div className="absolute inset-0 overflow-y-scroll p-3">
                  <PresetContainer
                    currentValue={range}
                    presets={presets}
                    onSelect={onRangeChange}
                  />
                </div>
              </div>
            )}
            <div>
              <CalendarPrimitive
                mode="range"
                selected={range}
                onSelect={onRangeChange}
                month={month}
                onMonthChange={setMonth}
                numberOfMonths={2}
                disabled={disabled}
                classNames={{
                  months: "flex flex-row divide-x divide-ui-border-base",
                }}
                {...props}
              />
              {showTimePicker && (
                <div className="border-ui-border-base flex items-center justify-evenly gap-x-3 border-t p-3">
                  <div className="flex flex-1 items-center gap-x-2">
                    <span className="text-ui-fg-subtle">
                      {translations?.start ?? "Start"}:
                    </span>
                    <TimeInput
                      value={startTime}
                      onChange={(v) => onTimeChange(v, "start")}
                      aria-label="Start date time"
                      isDisabled={!range?.from}
                      isRequired={props.required}
                    />
                  </div>
                  <Minus className="text-ui-fg-muted" />
                  <div className="flex flex-1 items-center gap-x-2">
                    <span className="text-ui-fg-subtle">
                      {translations?.end ?? "End"}:
                    </span>
                    <TimeInput
                      value={endTime}
                      onChange={(v) => onTimeChange(v, "end")}
                      aria-label="End date time"
                      isDisabled={!range?.to}
                      isRequired={props.required}
                    />
                  </div>
                </div>
              )}
              <div className="flex items-center justify-between border-t p-3">
                <p className={clx("text-ui-fg-subtle txt-compact-small-plus")}>
                  <span className="text-ui-fg-muted">
                    {translations?.range ?? "Range"}:
                  </span>{" "}
                  {displayRange}
                </p>
                <div className="flex items-center gap-x-2">
                  <Button
                    size="small"
                    variant="secondary"
                    type="button"
                    onClick={onCancel}
                  >
                    {translations?.cancel ?? "Cancel"}
                  </Button>
                  <Button
                    size="small"
                    variant="primary"
                    type="button"
                    onClick={onApply}
                  >
                    {translations?.apply ?? "Apply"}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Flyout>
    </Primitives.Root>
  )
})

/**
 * @interface
 *
 * @prop presets - Provide selectable preset configurations.
 * @prop defaultValue - The date selected by default.
 * @prop value - The selected date.
 * @prop onChange - A function to handle the change in the selected date.
 */
type DatePickerProps = (
  | {
      mode?: "single"
      presets?: DatePreset[]
      defaultValue?: Date
      value?: Date
      onChange?: (date: Date | undefined) => void
    }
  | {
      mode: "range"
      presets?: DateRangePreset[]
      defaultValue?: DateRange
      value?: DateRange
      onChange?: (dateRange: DateRange | undefined) => void
    }
) &
  PickerProps

const validatePresets = (
  presets: DateRangePreset[] | DatePreset[],
  rules: PickerProps
) => {
  const { toYear, fromYear, fromMonth, toMonth, fromDay, toDay } = rules

  if (presets && presets.length > 0) {
    const fromYearToUse = fromYear
    const toYearToUse = toYear

    presets.forEach((preset) => {
      if ("date" in preset) {
        const presetYear = preset.date.getFullYear()

        if (fromYear && presetYear < fromYear) {
          throw new Error(
            `Preset ${preset.label} is before fromYear ${fromYearToUse}.`
          )
        }

        if (toYear && presetYear > toYear) {
          throw new Error(
            `Preset ${preset.label} is after toYear ${toYearToUse}.`
          )
        }

        if (fromMonth) {
          const presetMonth = preset.date.getMonth()

          if (presetMonth < fromMonth.getMonth()) {
            throw new Error(
              `Preset ${preset.label} is before fromMonth ${fromMonth}.`
            )
          }
        }

        if (toMonth) {
          const presetMonth = preset.date.getMonth()

          if (presetMonth > toMonth.getMonth()) {
            throw new Error(
              `Preset ${preset.label} is after toMonth ${toMonth}.`
            )
          }
        }

        if (fromDay) {
          const presetDay = preset.date.getDate()

          if (presetDay < fromDay.getDate()) {
            throw new Error(
              `Preset ${preset.label} is before fromDay ${fromDay}.`
            )
          }
        }

        if (toDay) {
          const presetDay = preset.date.getDate()

          if (presetDay > toDay.getDate()) {
            throw new Error(
              `Preset ${preset.label} is after toDay ${format(
                toDay,
                "MMM dd, yyyy"
              )}.`
            )
          }
        }
      }

      if ("dateRange" in preset) {
        const presetFromYear = preset.dateRange.from?.getFullYear()
        const presetToYear = preset.dateRange.to?.getFullYear()

        if (presetFromYear && fromYear && presetFromYear < fromYear) {
          throw new Error(
            `Preset ${preset.label}'s 'from' is before fromYear ${fromYearToUse}.`
          )
        }

        if (presetToYear && toYear && presetToYear > toYear) {
          throw new Error(
            `Preset ${preset.label}'s 'to' is after toYear ${toYearToUse}.`
          )
        }

        if (fromMonth) {
          const presetMonth = preset.dateRange.from?.getMonth()

          if (presetMonth && presetMonth < fromMonth.getMonth()) {
            throw new Error(
              `Preset ${preset.label}'s 'from' is before fromMonth ${format(
                fromMonth,
                "MMM, yyyy"
              )}.`
            )
          }
        }

        if (toMonth) {
          const presetMonth = preset.dateRange.to?.getMonth()

          if (presetMonth && presetMonth > toMonth.getMonth()) {
            throw new Error(
              `Preset ${preset.label}'s 'to' is after toMonth ${format(
                toMonth,
                "MMM, yyyy"
              )}.`
            )
          }
        }

        if (fromDay) {
          const presetDay = preset.dateRange.from?.getDate()

          if (presetDay && presetDay < fromDay.getDate()) {
            throw new Error(
              `Preset ${
                preset.dateRange.from
              }'s 'from' is before fromDay ${format(fromDay, "MMM dd, yyyy")}.`
            )
          }
        }

        if (toDay) {
          const presetDay = preset.dateRange.to?.getDate()

          if (presetDay && presetDay > toDay.getDate()) {
            throw new Error(
              `Preset ${preset.label}'s 'to' is after toDay ${format(
                toDay,
                "MMM dd, yyyy"
              )}.`
            )
          }
        }
      }
    })
  }
}

/**
 * This component is based on the [Calendar](https://docs.medusajs.com/ui/components/calendar)
 * component and [Radix UI Popover](https://www.radix-ui.com/primitives/docs/components/popover).
 */
const DatePicker = React.forwardRef<HTMLButtonElement, DatePickerProps>(({
  /**
   * The date picker's mode.
   */
  mode = "single",
  ...props
}, ref) => {
  if (props.presets) {
    validatePresets(props.presets, props)
  }

  if (mode === "single") {
    return <SingleDatePicker ref={ref} {...(props as SingleProps)} />
  }

  return <RangeDatePicker ref={ref} {...(props as RangeProps)} />
})
DatePicker.displayName = "DatePicker"

export { DatePicker }
