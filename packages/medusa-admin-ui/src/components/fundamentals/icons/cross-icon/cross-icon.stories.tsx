import { ComponentMeta } from "@storybook/react"
import React from "react"
import CrossIcon from "."

export default {
  title: "Fundamentals/Icons/CrossIcon",
  component: CrossIcon,
  argTypes: {
    size: {
      control: {
        type: "select",
        options: ["24", "20", "16"],
      },
    },
  },
} as ComponentMeta<typeof CrossIcon>

const Template = args => <CrossIcon {...args} />

export const Icon = Template.bind({})
Icon.args = {
  size: "24",
  color: "currentColor",
}
