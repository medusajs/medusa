import type { Meta, StoryObj } from "@storybook/react"

import { Label } from "./label"

const meta: Meta<typeof Label> = {
  title: "Components/Label",
  component: Label,
  argTypes: {
    size: {
      control: {
        type: "select",
      },
      options: ["small", "xsmall", "base", "large"],
    },
    weight: {
      control: {
        type: "select",
      },
      options: ["regular", "plus"],
    },
  },
  parameters: {
    layout: "centered",
  },
}

export default meta

type Story = StoryObj<typeof Label>

export const BaseRegular: Story = {
  args: {
    size: "base",
    weight: "regular",
    children: "I am a label",
  },
}

export const BasePlus: Story = {
  args: {
    size: "base",
    weight: "plus",
    children: "I am a label",
  },
}

export const LargeRegular: Story = {
  args: {
    size: "large",
    weight: "regular",
    children: "I am a label",
  },
}

export const LargePlus: Story = {
  args: {
    size: "large",
    weight: "plus",
    children: "I am a label",
  },
}

export const SmallRegular: Story = {
  args: {
    size: "small",
    weight: "regular",
    children: "I am a label",
  },
}

export const SmallPlus: Story = {
  args: {
    size: "small",
    weight: "plus",
    children: "I am a label",
  },
}

export const XSmallRegular: Story = {
  args: {
    size: "xsmall",
    weight: "regular",
    children: "I am a label",
  },
}
