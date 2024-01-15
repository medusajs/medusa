import type { Meta, StoryObj } from "@storybook/react"
import * as React from "react"

import { BuildingTax } from "@medusajs/icons"
import { IconBadge } from "./icon-badge"

const meta: Meta<typeof IconBadge> = {
  title: "Components/IconBadge",
  component: IconBadge,
  parameters: {
    layout: "centered",
  },
}

export default meta

type Story = StoryObj<typeof IconBadge>

export const GreyBase: Story = {
  args: {
    children: <BuildingTax />,
    color: "grey",
    size: "base",
  },
}

export const GreyLarge: Story = {
  args: {
    children: <BuildingTax />,
    color: "grey",
    size: "large",
  },
}

export const BlueBase: Story = {
  args: {
    children: <BuildingTax />,
    color: "blue",

    size: "base",
  },
}

export const BlueLarge: Story = {
  args: {
    children: <BuildingTax />,
    color: "blue",
    size: "large",
  },
}

export const GreenBase: Story = {
  args: {
    children: <BuildingTax />,
    color: "green",
    size: "base",
  },
}

export const GreenLarge: Story = {
  args: {
    children: <BuildingTax />,
    color: "green",
    size: "large",
  },
}

export const RedBase: Story = {
  args: {
    children: <BuildingTax />,
    color: "red",
    size: "base",
  },
}

export const RedLarge: Story = {
  args: {
    children: <BuildingTax />,
    color: "red",
    size: "large",
  },
}

export const OrangeBase: Story = {
  args: {
    children: <BuildingTax />,
    color: "orange",
    size: "base",
  },
}

export const OrangeLarge: Story = {
  args: {
    children: <BuildingTax />,
    color: "orange",
    size: "large",
  },
}

export const PurpleBase: Story = {
  args: {
    children: <BuildingTax />,
    color: "purple",
    size: "base",
  },
}

export const PurpleLarge: Story = {
  args: {
    children: <BuildingTax />,
    color: "purple",
    size: "large",
  },
}
