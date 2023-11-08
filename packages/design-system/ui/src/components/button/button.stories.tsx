import type { Meta, StoryObj } from "@storybook/react"
import * as React from "react"

import { PlusMini } from "@medusajs/icons"
import { Button } from "./button"

const meta: Meta<typeof Button> = {
  title: "Components/Button",
  component: Button,
  parameters: {
    layout: "centered",
  },
}

export default meta

type Story = StoryObj<typeof Button>

export const Primary: Story = {
  args: {
    children: "Action",
  },
}

export const Secondary: Story = {
  args: {
    children: "Action",
    variant: "secondary",
  },
}

export const Transparent: Story = {
  args: {
    children: "Action",
    variant: "transparent",
  },
}

export const Danger: Story = {
  args: {
    children: "Action",
    variant: "danger",
  },
}

export const Disabled: Story = {
  args: {
    children: "Action",
    disabled: true,
  },
}

export const WithIcon: Story = {
  args: {
    children: ["Action", <PlusMini key={1} />],
  },
}

export const Loading: Story = {
  args: {
    children: "Action",
    isLoading: true,
  },
}

export const Large: Story = {
  args: {
    children: "Action",
    size: "large",
  },
}

export const XLarge: Story = {
  args: {
    children: "Action",
    size: "xlarge",
  },
}
