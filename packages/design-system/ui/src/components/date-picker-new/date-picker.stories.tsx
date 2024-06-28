import type { Meta, StoryObj } from "@storybook/react"
import * as React from "react"
import { ComponentPropsWithoutRef } from "react"
import { Button } from "../button"
import { DatePicker } from "./date-picker"

const meta: Meta<typeof DatePicker> = {
  title: "Components/DatePickerNew",
  component: DatePicker,
  parameters: {
    layout: "centered",
  },
}

export default meta

type Story = StoryObj<typeof DatePicker>

export const Default: Story = {
  args: {
    "aria-label": "Select a date",
  },
}

const ControlledDemo = (args: ComponentPropsWithoutRef<typeof DatePicker>) => {
  const [date, setDate] = React.useState<Date | null>(null)

  return (
    <div>
      <DatePicker value={date} onChange={setDate} {...args} />
      <div className="flex items-center justify-between">
        <pre className="font-mono txt-compact-small">{date ? date.toDateString() : "null"}</pre>
        <Button variant="secondary" size="small" onClick={() => setDate(null)}>Reset</Button>
      </div>
    </div>
  )
}

export const Controlled: Story = {
  render: ControlledDemo,
}

export const MinValue: Story = {
  args: {
    minValue: new Date(),
  },
}

export const MaxValue: Story = {
  args: {
    maxValue: new Date(),
  },
}

export const DisabledDates: Story = {
  args: {
    isDateUnavailable: (date: Date) => {
      const unavailable = date.getDay() === 0

      return unavailable
    },
  },
}
