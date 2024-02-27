import type { Meta, StoryObj } from "@storybook/react"

import { Code } from "./code"

const meta: Meta<typeof Code> = {
  title: "Components/Code",
  component: Code,
}

export default meta

type Story = StoryObj<typeof Code>

export const Default: Story = {
  args: {
    children: "yarn add -D @medusajs/ui-preset",
  },
}
