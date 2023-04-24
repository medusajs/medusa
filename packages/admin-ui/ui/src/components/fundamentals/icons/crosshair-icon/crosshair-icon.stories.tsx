import { ComponentMeta } from "@storybook/react"
import React from "react"
import CrosshairIcon from "."

export default {
  title: "Fundamentals/Icons/CrosshairIcon",
  component: CrosshairIcon,
  argTypes: {
    size: {
      control: {
        type: "select",
        options: ["24", "20", "16"],
      },
    },
  },
} as ComponentMeta<typeof CrosshairIcon>

const Template = args => <CrosshairIcon {...args} />

export const Icon = Template.bind({})
Icon.args = {
  size: "24",
  color: "currentColor",
}
