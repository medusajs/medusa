import type { Meta, StoryObj } from "@storybook/react"
import * as React from "react"

import { Plus } from "@medusajs/icons"
import { IconButton } from "./icon-button"

const meta: Meta<typeof IconButton> = {
  title: "Components/IconButton",
  component: IconButton,
  parameters: {
    layout: "centered",
  },
}

export default meta

type Story = StoryObj<typeof IconButton>

export const BasePrimary: Story = {
  args: {
    variant: "primary",
    size: "base",
    children: <Plus />,
  },
}

export const BaseTransparent: Story = {
  args: {
    variant: "transparent",
    size: "base",
    children: <Plus />,
  },
}

export const LargePrimary: Story = {
  args: {
    variant: "primary",
    size: "large",
    children: <Plus />,
  },
}

export const LargeTransparent: Story = {
  args: {
    variant: "transparent",
    size: "large",
    children: <Plus />,
  },
}

export const XLargePrimary: Story = {
  args: {
    variant: "primary",
    size: "xlarge",
    children: <Plus />,
  },
}

export const XLargeTransparent: Story = {
  args: {
    variant: "transparent",
    size: "xlarge",
    children: <Plus />,
  },
}

export const Disabled: Story = {
  args: {
    variant: "primary",
    size: "base",
    children: <Plus />,
    disabled: true,
  },
}

export const IsLoading: Story = {
  args: {
    variant: "primary",
    size: "base",
    children: <Plus />,
    isLoading: true,
  },
}
