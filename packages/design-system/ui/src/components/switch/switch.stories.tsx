import type { Meta, StoryObj } from "@storybook/react"

import { Switch } from "./switch"

const meta: Meta<typeof Switch> = {
  title: "Components/Switch",
  component: Switch,
  parameters: {
    layout: "centered",
  },
}

export default meta

type Story = StoryObj<typeof Switch>

export const Default: Story = {
  args: {},
}

export const Small: Story = {
  args: {
    size: "small",
  },
}

export const Checked: Story = {
  args: {
    checked: true,
  },
}

export const Disabled: Story = {
  args: {
    disabled: true,
  },
}

export const CheckedDisabled: Story = {
  args: {
    checked: true,
    disabled: true,
  },
}
