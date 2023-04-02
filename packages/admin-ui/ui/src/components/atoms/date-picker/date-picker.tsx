import * as PopoverPrimitive from "@radix-ui/react-popover"
import clsx from "clsx"
import moment from "moment"
import React, { useEffect, useState } from "react"
import ReactDatePicker from "react-datepicker"
import "react-datepicker/dist/react-datepicker.css"
import Button from "../../fundamentals/button"
import ArrowDownIcon from "../../fundamentals/icons/arrow-down-icon"
import InputContainer from "../../fundamentals/input-container"
import InputHeader from "../../fundamentals/input-header"
import CustomHeader from "./custom-header"
import { DateTimePickerProps } from "./types"

const getDateClassname = (d: Date, tempDate: Date) => {
  return moment(d).format("YY,MM,DD") === moment(tempDate).format("YY,MM,DD")
    ? "date chosen"
    : `date ${
        moment(d).format("YY,MM,DD") < moment(new Date()).format("YY,MM,DD")
          ? "past"
          : ""
      }`
}

const DatePicker: React.FC<DateTimePickerProps> = ({
  date,
  onSubmitDate,
  label = "start date",
  required = false,
  tooltipContent,
  tooltip,
}) => {
  const [tempDate, setTempDate] = useState<Date | null>(date || null)
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => setTempDate(date), [isOpen])

  const submitDate = () => {
    if (!tempDate || !date) {
      onSubmitDate(null)
      setIsOpen(false)
      return
    }

    // update only date, month and year
    const newDate = new Date(date.getTime())
    newDate.setUTCDate(tempDate.getUTCDate())
    newDate.setUTCMonth(tempDate.getUTCMonth())
    newDate.setUTCFullYear(tempDate.getUTCFullYear())

    onSubmitDate(newDate)
    setIsOpen(false)
  }

  return (
    <div className="w-full">
      <PopoverPrimitive.Root open={isOpen} onOpenChange={setIsOpen}>
        <PopoverPrimitive.Trigger asChild>
          <button
            className={clsx("rounded-rounded w-full border ", {
              "shadow-input border-violet-60": isOpen,
              "border-grey-20": !isOpen,
            })}
            type="button"
          >
            <InputContainer className="shadown-none border-0 focus-within:shadow-none">
              <div className="text-grey-50 flex w-full justify-between pr-0.5">
                <InputHeader
                  {...{
                    label,
                    required,
                    tooltipContent,
                    tooltip,
                  }}
                />
                <ArrowDownIcon size={16} />
              </div>
              <label className="w-full text-left">
                {date
                  ? moment(date).format("ddd, DD MMM YYYY")
                  : "---, -- -- ----"}
              </label>
            </InputContainer>
          </button>
        </PopoverPrimitive.Trigger>
        <PopoverPrimitive.Content
          side="top"
          sideOffset={8}
          className="rounded-rounded border-grey-20  bg-grey-0 shadow-dropdown w-full border px-8"
        >
          <CalendarComponent
            date={tempDate}
            onChange={(date) => setTempDate(date)}
          />
          <div className="mb-8 mt-5 flex w-full">
            <Button
              variant="ghost"
              size="medium"
              onClick={() => setIsOpen(false)}
              className="border-grey-20 mr-2 flex w-1/3 justify-center border"
            >
              Cancel
            </Button>
            <Button
              size="medium"
              variant="primary"
              onClick={() => submitDate()}
              className="flex w-2/3 justify-center"
            >{`Set ${label}`}</Button>
          </div>
        </PopoverPrimitive.Content>
      </PopoverPrimitive.Root>
    </div>
  )
}

type CalendarComponentProps = {
  date: Date | null
  onChange: (
    date: Date | null,
    event: React.SyntheticEvent<any, Event> | undefined
  ) => void
}

export const CalendarComponent = ({
  date,
  onChange,
}: CalendarComponentProps) => (
  <ReactDatePicker
    selected={date}
    inline
    onChange={onChange}
    calendarClassName="date-picker"
    dayClassName={(d) => getDateClassname(d, date)}
    renderCustomHeader={({ ...props }) => <CustomHeader {...props} />}
  />
)

export default DatePicker
