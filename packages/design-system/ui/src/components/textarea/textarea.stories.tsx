import type { Meta, StoryObj } from "@storybook/react"
import * as React from "react"

import { Textarea } from "./textarea"

const meta: Meta<typeof Textarea> = {
  title: "Components/Textarea",
  component: Textarea,
  parameters: {
    layout: "centered",
  },
  render: (args) => (
    <div className="w-[400px]">
      <Textarea {...args} />
    </div>
  ),
}

export default meta

type Story = StoryObj<typeof Textarea>

export const Default: Story = {
  args: {
    placeholder: "Placeholder",
  },
}
