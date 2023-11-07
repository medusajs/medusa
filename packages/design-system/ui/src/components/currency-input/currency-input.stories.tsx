import type { Meta, StoryObj } from "@storybook/react"
import * as React from "react"

import { CurrencyInput } from "./currency-input"

const meta: Meta<typeof CurrencyInput> = {
  title: "Components/CurrencyInput",
  component: CurrencyInput,
  parameters: {
    layout: "centered",
  },
}

export default meta

type Story = StoryObj<typeof CurrencyInput>

export const Default: Story = {
  args: {
    symbol: "$",
    code: "usd",
  },
}

export const InGrid: Story = {
  render: (args) => {
    return (
      <div className="grid w-full grid-cols-3">
        <CurrencyInput {...args} />
        <CurrencyInput {...args} />
        <CurrencyInput {...args} />
      </div>
    )
  },
  args: {
    symbol: "$",
    code: "usd",
  },
}
