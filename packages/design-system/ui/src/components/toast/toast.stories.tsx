import type { Meta, StoryObj } from "@storybook/react"
import * as React from "react"

import { Toast, ToastProvider, ToastViewport } from "./toast"

const meta: Meta<typeof Toast> = {
  title: "Components/Toast",
  component: Toast,
  parameters: {
    layout: "centered",
  },
  render: (args) => {
    return (
      <ToastProvider>
        <ToastViewport>
          <Toast {...args} />
        </ToastViewport>
      </ToastProvider>
    )
  },
}

export default meta

type Story = StoryObj<typeof Toast>

export const Information: Story = {
  args: {
    title: "Label",
    description: "The quick brown fox jumps over a lazy dog.",
    open: true,
  },
}

export const Warning: Story = {
  args: {
    title: "Label",
    description: "The quick brown fox jumps over a lazy dog.",
    variant: "warning",
    open: true,
  },
}

export const Error: Story = {
  args: {
    title: "Label",
    description: "The quick brown fox jumps over a lazy dog.",
    variant: "error",
    open: true,
  },
}

export const Success: Story = {
  args: {
    title: "Label",
    description: "The quick brown fox jumps over a lazy dog.",
    variant: "success",
    open: true,
  },
}

export const Loading: Story = {
  args: {
    title: "Label",
    description: "The quick brown fox jumps over a lazy dog.",
    variant: "loading",
    open: true,
  },
}

export const WithAction: Story = {
  args: {
    title: "Scheduled meeting",
    description: "The meeting has been added to your calendar.",
    variant: "success",
    open: true,
    action: {
      altText: "Undo adding meeting to calendar",
      onClick: () => {},
      label: "Undo",
    },
  },
}
