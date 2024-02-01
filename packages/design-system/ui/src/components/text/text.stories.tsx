import type { Meta, StoryObj } from "@storybook/react"

import { Text } from "./text"

const meta: Meta<typeof Text> = {
  title: "Components/Text",
  component: Text,
  argTypes: {
    size: {
      control: {
        type: "select",
      },
      options: ["base", "large", "xlarge"],
    },
    weight: {
      control: {
        type: "select",
      },
      options: ["regular", "plus"],
    },
    family: {
      control: {
        type: "select",
      },
      options: ["sans", "mono"],
    },
  },
  parameters: {
    layout: "centered",
  },
}

export default meta

type Story = StoryObj<typeof Text>

export const BaseRegularSans: Story = {
  args: {
    size: "base",
    weight: "regular",
    family: "sans",
    children: "I am a paragraph",
  },
}

export const BasePlusSans: Story = {
  args: {
    size: "base",
    weight: "plus",
    family: "sans",
    children: "I am a paragraph",
  },
}

export const LargeRegularSans: Story = {
  args: {
    size: "large",
    weight: "regular",
    family: "sans",
    children: "I am a paragraph",
  },
}

export const LargePlusSans: Story = {
  args: {
    size: "large",
    weight: "plus",
    family: "sans",
    children: "I am a paragraph",
  },
}

export const XLargeRegularSans: Story = {
  args: {
    size: "xlarge",
    weight: "regular",
    family: "sans",
    children: "I am a paragraph",
  },
}

export const XLargePlusSans: Story = {
  args: {
    size: "xlarge",
    weight: "plus",
    family: "sans",

    children: "I am a paragraph",
  },
}

export const BaseRegularMono: Story = {
  args: {
    size: "base",
    weight: "regular",
    family: "mono",
    children: "I am a paragraph",
  },
}

export const BasePlusMono: Story = {
  args: {
    size: "base",
    weight: "plus",
    family: "mono",
    children: "I am a paragraph",
  },
}

export const LargeRegularMono: Story = {
  args: {
    size: "large",
    weight: "regular",
    family: "mono",
    children: "I am a paragraph",
  },
}

export const LargePlusMono: Story = {
  args: {
    size: "large",
    weight: "plus",
    family: "mono",
    children: "I am a paragraph",
  },
}

export const XLargeRegularMono: Story = {
  args: {
    size: "xlarge",
    weight: "regular",
    family: "mono",
    children: "I am a paragraph",
  },
}

export const XLargePlusMono: Story = {
  args: {
    size: "xlarge",
    weight: "plus",
    family: "mono",
    children: "I am a paragraph",
  },
}
