import type { Meta, StoryObj } from "@storybook/react"
import * as React from "react"

import { isBrowserLocaleClockType24h } from "../../utils/is-browser-locale-hour-cycle-24h"
import { TimeInput } from "./time-input"

const meta: Meta<typeof TimeInput> = {
  title: "Components/TimeInput",
  component: TimeInput,
  parameters: {
    layout: "centered",
  },
  render: (args) => (
    <div className="w-[300px]">
      <TimeInput aria-labelledby="time" {...args} />
    </div>
  ),
}

export default meta

type Story = StoryObj<typeof TimeInput>

// Hour Cycle defaults to your browser's locale.
export const Default: Story = {
  render: (args) => {
    return (
      <div className="flex flex-col gap-y-4">
        <TimeInput aria-labelledby="time" {...args} />
        <div className="flex flex-col gap-y-2">
          <p className="text-xs">
            Will use 24h or 12h cycle depending on your locale
          </p>
          <div className="text-xs">
            <pre>
              Locale: {window.navigator.language}, Hour Cycle:{" "}
              {isBrowserLocaleClockType24h() ? "24h" : "12h"}
            </pre>
          </div>
        </div>
      </div>
    )
  },
}

export const Hour24: Story = {
  args: {
    hourCycle: 24,
  },
}

export const Hour12: Story = {
  args: {
    hourCycle: 12,
  },
}
