import type { Meta, StoryObj } from "@storybook/react"
import * as React from "react"

import { Toast } from "./toast"

const meta: Meta<typeof Toast> = {
  title: "Components/Toast",
  component: Toast,
  parameters: {
    layout: "centered",
  },
  render: (args) => {
    return <Toast {...args} />
  },
}

export default meta

type Story = StoryObj<typeof Toast>

export const Information: Story = {
  args: {
    title: "Label",
    description: "The quick brown fox jumps over a lazy dog.",
    variant: "info",
  },
}

export const Warning: Story = {
  args: {
    title: "Label",
    description: "The quick brown fox jumps over a lazy dog.",
    variant: "warning",
  },
}

export const Error: Story = {
  args: {
    title: "Label",
    description: "The quick brown fox jumps over a lazy dog.",
    variant: "error",
  },
}

export const Success: Story = {
  args: {
    title: "Label",
    description: "The quick brown fox jumps over a lazy dog.",
    variant: "success",
  },
}

export const Loading: Story = {
  args: {
    title: "Label",
    description: "The quick brown fox jumps over a lazy dog.",
    variant: "loading",
  },
}

export const WithAction: Story = {
  args: {
    title: "Scheduled meeting",
    description: "The meeting has been added to your calendar.",
    variant: "success",
    action: {
      altText: "Undo adding meeting to calendar",
      onClick: () => {},
      label: "Undo",
    },
  },
}
