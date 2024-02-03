import type { Meta, StoryObj } from "@storybook/react"
import * as React from "react"

import { Alert } from "./alert"

const meta: Meta<typeof Alert> = {
  title: "Components/Alert",
  component: Alert,
  argTypes: {
    variant: {
      control: {
        type: "select",
        options: ["info", "error", "success", "warning"],
      },
    },
    dismissible: {
      control: {
        type: "boolean",
      },
    },
  },
  parameters: {
    layout: "centered",
  },
}

export default meta

type Story = StoryObj<typeof Alert>

const Text =
  "We have sent you an email with instructions on how to reset your password. If you don't receive an email, please check your spam folder or try again."

export const Info: Story = {
  args: {
    variant: "info",
    children: Text,
  },
  render: (args) => (
    <div className="max-w-[300px]">
      <Alert {...args} />
    </div>
  ),
}

export const Error: Story = {
  args: {
    variant: "error",
    children: Text,
  },
  render: (args) => (
    <div className="max-w-[300px]">
      <Alert {...args} />
    </div>
  ),
}

export const Success: Story = {
  args: {
    variant: "success",
    children: Text,
  },
  render: (args) => (
    <div className="max-w-[300px]">
      <Alert {...args} />
    </div>
  ),
}

export const Warning: Story = {
  args: {
    variant: "warning",
    children: Text,
  },
  render: (args) => (
    <div className="max-w-[300px]">
      <Alert {...args} />
    </div>
  ),
}

export const Dismissible: Story = {
  args: {
    dismissible: true,
    children: Text,
  },
  render: (args) => (
    <div className="max-w-[300px]">
      <Alert {...args} />
    </div>
  ),
}
