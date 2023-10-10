import type { Meta, StoryObj } from "@storybook/react"

import { StatusBadge } from "./status-badge"

const meta: Meta<typeof StatusBadge> = {
  title: "Components/StatusBadge",
  component: StatusBadge,
  parameters: {
    layout: "centered",
  },
}

export default meta

type Story = StoryObj<typeof StatusBadge>

export const Grey: Story = {
  args: {
    children: "Draft",
    color: "grey",
  },
}

export const Green: Story = {
  args: {
    children: "Published",
    color: "green",
  },
}

export const Red: Story = {
  args: {
    children: "Expired",
    color: "red",
  },
}

export const Blue: Story = {
  args: {
    children: "Pending",
    color: "blue",
  },
}

export const Orange: Story = {
  args: {
    children: "Requires Attention",
    color: "orange",
  },
}
