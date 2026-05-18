import type { Meta, StoryObj } from "@storybook/react"
import * as React from "react"

import { OtpInput } from "./otp-input"

type OtpInputStoryProps = React.ComponentProps<typeof OtpInput>

const OtpInputStory = (args: OtpInputStoryProps) => {
  const [value, setValue] = React.useState(args.value ?? "")

  return <OtpInput {...args} value={value} onChange={setValue} />
}

const meta: Meta<typeof OtpInput> = {
  title: "Components/OtpInput",
  component: OtpInput,
  parameters: {
    layout: "centered",
  },
  render: (args) => <OtpInputStory {...args} />,
}

export default meta

type Story = StoryObj<typeof OtpInput>

export const Default: Story = {
  args: {
    "aria-label": "Verification code",
    value: "",
  },
}

export const Disabled: Story = {
  args: {
    "aria-label": "Verification code",
    disabled: true,
    value: "123456",
  },
}

export const Invalid: Story = {
  args: {
    "aria-invalid": true,
    "aria-label": "Verification code",
    value: "123",
  },
}

export const EightDigits: Story = {
  args: {
    "aria-label": "Recovery code",
    groupSize: 4,
    length: 8,
    value: "",
  },
}
