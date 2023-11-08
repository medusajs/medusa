import type { Meta, StoryObj } from "@storybook/react"
import { Hint } from "./hint"

const meta: Meta<typeof Hint> = {
  title: "Components/Hint",
  component: Hint,
  parameters: {
    layout: "centered",
  },
}

export default meta

type Story = StoryObj<typeof Hint>

export const Info: Story = {
  args: {
    children: "This is a hint text to help user.",
  },
}

export const Error: Story = {
  args: {
    variant: "error",
    children: "This is a hint text to help user.",
  },
}
