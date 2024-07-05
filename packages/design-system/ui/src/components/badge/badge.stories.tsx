import { Meta, StoryObj } from "@storybook/react"
import * as React from "react"

import { Badge } from "./badge"

const meta: Meta<typeof Badge> = {
  title: "Components/Badge",
  component: Badge,
  parameters: {
    layout: "centered",
  },
  render: ({ children, ...args }) => (
    <Badge {...args}>{children || "Badge"}</Badge>
  ),
}

export default meta

type Story = StoryObj<typeof Badge>

export const Grey: Story = {
  args: {
    color: "grey",
  },
}

export const Green: Story = {
  args: {
    color: "green",
  },
}

export const Red: Story = {
  args: {
    color: "red",
  },
}

export const Blue: Story = {
  args: {
    color: "blue",
  },
}

export const Orange: Story = {
  args: {
    color: "orange",
  },
}

export const Purple: Story = {
  args: {
    color: "purple",
  },
}

export const Default: Story = {
  args: {
    rounded: "base",
  },
}

export const Rounded: Story = {
  args: {
    rounded: "full",
  },
}

export const XXSmall: Story = {
  args: {
    size: "2xsmall",
  },
}

export const XSmall: Story = {
  args: {
    size: "xsmall",
  },
}

export const Small: Story = {
  args: {
    size: "small",
  },
}

export const Base: Story = {
  args: {
    size: "base",
  },
}

export const Large: Story = {
  args: {
    size: "large",
  },
}
