import type { Meta, StoryObj } from "@storybook/react"
import * as React from "react"
import { ComponentPropsWithoutRef } from "react"
import { Label } from "../label"
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
  const [startDate, setStartDate] = React.useState<Date | null>(null)
  const [endDate, setEndDate] = React.useState<Date | null>(null)

  return (
    <div className="grid max-w-[576px] gap-4 md:grid-cols-2 text-ui-fg-subtle">
      <fieldset className="flex flex-col gap-y-0.5">
        <Label htmlFor="starts_at">Starts at</Label>
        <DatePicker
          name="starts_at"
          {...args}
          maxValue={endDate || undefined}
          value={startDate}
          onChange={setStartDate}
        />
      </fieldset>
      <fieldset className="flex flex-col gap-y-0.5">
        <Label htmlFor="ends_at">Ends at</Label>
        <DatePicker
          name="ends_at"
          minValue={startDate || undefined}
          {...args}
          value={endDate}
          onChange={setEndDate}
        />
      </fieldset>
    </div>
  )
}

export const Controlled: Story = {
  render: ControlledDemo,
  args: {
    "aria-label": "Select a date",
    className: "w-[230px]",
  },
}

export const MinValue: Story = {
  args: {
    "aria-label": "Select a date",
    className: "w-[230px]",
    minValue: new Date(),
  },
}

export const MaxValue: Story = {
  args: {
    "aria-label": "Select a date",
    className: "w-[230px]",
    maxValue: new Date(),
  },
}

export const DisabledDates: Story = {
  args: {
    isDateUnavailable: (date: Date) => {
      const unavailable = date.getDay() === 0

      return unavailable
    },
    "aria-label": "Select a date",
    className: "w-[230px]",
  },
}

export const WithTime: Story = {
  args: {
    granularity: "minute",
    "aria-label": "Select a date",
    className: "w-[230px]",
  },
}

export const Small: Story = {
  args: {
    size: "small",
    "aria-label": "Select a date",
    className: "w-[230px]",
  },
}