import { ComponentMeta } from "@storybook/react"
import React from "react"
import ArrowLeftIcon from "."

export default {
  title: "Fundamentals/Icons/ArrowLeftIcon",
  component: ArrowLeftIcon,
  argTypes: {
    size: {
      control: {
        type: "select",
        options: ["24", "20", "16"],
      },
    },
  },
} as ComponentMeta<typeof ArrowLeftIcon>

const Template = args => <ArrowLeftIcon {...args} />

export const Icon = Template.bind({})
Icon.args = {
  size: "24",
  color: "currentColor",
}
