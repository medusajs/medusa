import { ComponentMeta } from "@storybook/react"
import React from "react"
import ClockIcon from "."

export default {
  title: "Fundamentals/Icons/ClockIcon",
  component: ClockIcon,
  argTypes: {
    size: {
      control: {
        type: "select",
        options: ["24", "20", "16"],
      },
    },
  },
} as ComponentMeta<typeof ClockIcon>

const Template = (args) => <ClockIcon {...args} />

export const Icon = Template.bind({})
Icon.args = {
  size: "24",
  color: "currentColor",
}
