import type { Meta, StoryObj } from "@storybook/react"
import * as React from "react"
import { ComponentPropsWithoutRef } from "react"
import { Button } from "../button"
import { Calendar } from "./calendar"

const meta: Meta<typeof Calendar> = {
  title: "Components/CalendarNew",
  component: Calendar,
  parameters: {
    layout: "centered",
  },
}

export default meta

type Story = StoryObj<typeof Calendar>

export const Default: Story = {
  args: {},
}

const ControlledDemo = (args: ComponentPropsWithoutRef<typeof Calendar>) => {
  const [date, setDate] = React.useState<Date | null>(new Date())

  return (
    <div>
      <Calendar {...args} value={date} onChange={setDate} />
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
