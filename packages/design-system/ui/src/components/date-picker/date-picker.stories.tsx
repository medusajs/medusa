import type { Meta, StoryObj } from "@storybook/react"
import * as React from "react"
import { ComponentPropsWithoutRef } from "react"
import { Button } from "../button"
import { Drawer } from "../drawer"
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

const today = new Date() // Today
const oneWeekFromToday = new Date(new Date(today as Date).setDate(today.getDate() + 7)) // Today + 7 days

const ControlledDemo = (args: ComponentPropsWithoutRef<typeof DatePicker>) => {
  const [startDate, setStartDate] = React.useState<Date | null>(today)
  const [endDate, setEndDate] = React.useState<Date | null>(oneWeekFromToday)

  return (
    <div className="text-ui-fg-subtle grid max-w-[576px] gap-4 md:grid-cols-2">
      <fieldset className="flex flex-col gap-y-0.5">
        <Label id="starts_at:r1:label" htmlFor="starts_at:r1">Starts at</Label>
        <DatePicker
          id="starts_at:r1"
          aria-labelledby="starts_at:r1:label"
          {...args}
          maxValue={endDate || undefined}
          value={startDate}
          onChange={setStartDate}
        />
      </fieldset>
      <fieldset className="flex flex-col gap-y-0.5">
        <Label id="ends_at:r1:label" htmlFor="ends_at:r1">Ends at</Label>
        <DatePicker
          id="ends_at:r1"
          name="ends_at"
          aria-labelledby="ends_at:r1:label"
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
    value: new Date(),
  },
}

export const Small: Story = {
  args: {
    size: "small",
    "aria-label": "Select a date",
    className: "w-[230px]",
  },
}

const InDrawerDemo = (args: ComponentPropsWithoutRef<typeof DatePicker>) => {
  return (
    <Drawer>
      <Drawer.Trigger asChild>
        <Button size="small">Open Drawer</Button>
      </Drawer.Trigger>
      <Drawer.Content>
        <Drawer.Header>
          <Drawer.Title>Select a date</Drawer.Title>
        </Drawer.Header>
        <Drawer.Body>
          <div className="p-4">
            <DatePicker {...args} />
          </div>
        </Drawer.Body>
      </Drawer.Content>
    </Drawer>
  )
}

export const InDrawer: Story = {
  render: InDrawerDemo,
}
