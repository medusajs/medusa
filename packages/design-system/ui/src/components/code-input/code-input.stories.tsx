import type { Meta, StoryObj } from "@storybook/react"
import * as React from "react"

import { CodeInput } from "./code-input"

type CodeInputStoryProps = React.ComponentProps<typeof CodeInput>

const CodeInputStory = (args: CodeInputStoryProps) => {
  const [value, setValue] = React.useState(args.value ?? "")

  return <CodeInput {...args} value={value} onChange={setValue} />
}

const meta: Meta<typeof CodeInput> = {
  title: "Components/CodeInput",
  component: CodeInput,
  parameters: {
    layout: "centered",
  },
  render: (args) => <CodeInputStory {...args} />,
}

export default meta

type Story = StoryObj<typeof CodeInput>

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
