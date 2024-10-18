import type { Meta, StoryObj } from "@storybook/react"

import { Avatar } from "./avatar"

const meta: Meta<typeof Avatar> = {
  title: "Components/Avatar",
  component: Avatar,
  argTypes: {
    src: {
      control: {
        type: "text",
      },
    },
    fallback: {
      control: {
        type: "text",
      },
    },
    variant: {
      control: {
        type: "select",
        options: ["rounded", "squared"],
      },
    },
    size: {
      control: {
        type: "select",
        options: ["default", "large"],
      },
    },
  },
  parameters: {
    layout: "centered",
  },
}

export default meta

type Story = StoryObj<typeof Avatar>

export const WithImage: Story = {
  args: {
    src: "https://avatars.githubusercontent.com/u/10656202?v=4",
    fallback: "J",
    size: "base",
  },
}

export const WithFallback: Story = {
  args: {
    fallback: "J",
    size: "large",
  },
}

export const TwoXSmall: Story = {
  args: {
    fallback: "J",
    size: "2xsmall",
  },
}

export const XSmall: Story = {
  args: {
    fallback: "J",
    size: "xsmall",
  },
}

export const Small: Story = {
  args: {
    fallback: "J",
    size: "small",
  },
}

export  const Base: Story = {
  args: {
    fallback: "J",
    size: "base",
  },
}

export const Large: Story = {
  args: {
    fallback: "J",
    size: "large",
  },
}

export const XLarge: Story = {
  args: {
    fallback: "J",
    size: "xlarge",
  },
}
