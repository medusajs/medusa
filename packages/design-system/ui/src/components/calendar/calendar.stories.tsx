import type { Meta, StoryObj } from "@storybook/react"
import * as React from "react"

import { Text } from "@/components/text"
import { DateRange } from "react-day-picker"
import { Calendar } from "./calendar"

const Demo = ({ mode, ...args }: Parameters<typeof Calendar>[0]) => {
  const [date, setDate] = React.useState<Date | undefined>(new Date())
  const [dateRange, setDateRange] = React.useState<DateRange | undefined>(
    undefined
  )

  return (
    <div className="flex flex-col items-center gap-y-4">
      <Calendar
        {...(args as any)}
        mode={mode as "single" | "range"}
        selected={mode === "single" ? date : dateRange}
        onSelect={mode === "single" ? setDate : setDateRange}
      />

      {mode === "single" && (
        <Text className="text-ui-fg-base">
          Selected Date: {date ? date.toDateString() : "None"}
        </Text>
      )}
      {mode === "range" && (
        <Text className="text-ui-fg-base">
          Selected Range:{" "}
          {dateRange
            ? `${dateRange.from?.toDateString()} – ${
                dateRange.to?.toDateString() ?? ""
              }`
            : "None"}
        </Text>
      )}
    </div>
  )
}

const meta: Meta<typeof Calendar> = {
  title: "Components/Calendar",
  component: Calendar,
  render: Demo,
  parameters: {
    layout: "centered",
  },
}

export default meta

type Story = StoryObj<typeof Calendar>

export const Single: Story = {
  args: {
    mode: "single",
  },
}

export const TwoMonthSingle: Story = {
  args: {
    mode: "single",
    numberOfMonths: 2,
  },
}

export const Range: Story = {
  args: {
    mode: "range",
  },
}

export const TwoMonthRange: Story = {
  args: {
    mode: "range",
    numberOfMonths: 2,
  },
}
