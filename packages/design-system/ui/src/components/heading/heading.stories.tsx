import type { Meta, StoryObj } from "@storybook/react"

import { Heading } from "./heading"

const meta: Meta<typeof Heading> = {
  title: "Components/Heading",
  component: Heading,
  argTypes: {
    level: {
      control: {
        type: "select",
      },
      options: ["h1", "h2", "h3"],
    },
  },
  parameters: {
    layout: "centered",
  },
}

export default meta

type Story = StoryObj<typeof Heading>

export const H1: Story = {
  args: {
    level: "h1",
    children: "I am a H1 heading",
  },
}

export const H2: Story = {
  args: {
    level: "h2",
    children: "I am a H2 heading",
  },
}

export const H3: Story = {
  args: {
    level: "h3",
    children: "I am a H3 heading",
  },
}
