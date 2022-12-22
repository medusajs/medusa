import { ComponentMeta } from "@storybook/react"
import React from "react"
import ArrowRightIcon from "."

export default {
  title: "Fundamentals/Icons/ArrowRightIcon",
  component: ArrowRightIcon,
  argTypes: {
    size: {
      control: {
        type: "select",
        options: ["24", "20", "16"],
      },
    },
  },
} as ComponentMeta<typeof ArrowRightIcon>

const Template = args => <ArrowRightIcon {...args} />

export const Icon = Template.bind({})
Icon.args = {
  size: "24",
  color: "currentColor",
}
