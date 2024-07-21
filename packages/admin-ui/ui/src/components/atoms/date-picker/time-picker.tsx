import * as PopoverPrimitive from "@radix-ui/react-popover"
import clsx from "clsx"
import { isNil } from "lodash"
import moment from "moment"
import React, { useEffect, useState } from "react"
import ArrowDownIcon from "../../fundamentals/icons/arrow-down-icon"
import ClockIcon from "../../fundamentals/icons/clock-icon"
import InputContainer from "../../fundamentals/input-container"
import InputHeader from "../../fundamentals/input-header"
import NumberScroller from "../number-scroller"
import { DateTimePickerProps } from "./types"

const TimePicker: React.FC<DateTimePickerProps> = ({
  date,
  onSubmitDate,
  label = "start date",
  required = false,
  tooltipContent,
  tooltip,
}) => {
  const [selectedMinute, setSelectedMinute] = useState(
    new Date(date)?.getUTCMinutes()
  )
  const [selectedHour, setSelectedHour] = useState(
    new Date(date)?.getUTCHours()
  )

  useEffect(() => {
    setSelectedMinute(new Date(date)?.getUTCMinutes())
    setSelectedHour(new Date(date)?.getUTCHours())
  }, [date])

  useEffect(() => {
    if (date && !isNil(selectedHour) && !isNil(selectedMinute)) {
      const newDate = new Date(new Date(date).getTime())
      newDate.setUTCHours(selectedHour)
      newDate.setUTCMinutes(selectedMinute)
      onSubmitDate(newDate)
    }
  }, [selectedMinute, selectedHour])

  const [isOpen, setIsOpen] = useState(false)

  const minuteNumbers = [...Array(60).keys()]
  const hourNumbers = [...Array(24).keys()]

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
              <div className="text-grey-50 flex w-full justify-between pe-0.5">
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
              <div className="text-grey-40 flex w-full items-center text-start">
                <ClockIcon size={16} />
                <span className="mx-1">UTC</span>
                <span className="text-grey-90">
                  {date ? moment.utc(date).format("HH:mm") : "--:--"}
                </span>
              </div>
            </InputContainer>
          </button>
        </PopoverPrimitive.Trigger>
        <PopoverPrimitive.Content
          side="top"
          sideOffset={8}
          className="rounded-rounded scrollbar-hide z-10 border-grey-20 bg-grey-0 shadow-dropdown flex w-full border px-6 pb-4 pt-6"
        >
          <NumberScroller
            numbers={hourNumbers}
            selected={selectedHour}
            onSelect={(n) => setSelectedHour(n as number)}
            className="pe-4"
          />
          <NumberScroller
            numbers={minuteNumbers}
            selected={selectedMinute}
            onSelect={(n) => setSelectedMinute(n as number)}
          />
          <div className="to-grey-0 h-xlarge absolute bottom-4 end-0 start-0 z-10 bg-gradient-to-b from-transparent" />
        </PopoverPrimitive.Content>
      </PopoverPrimitive.Root>
    </div>
  )
}

export default TimePicker
