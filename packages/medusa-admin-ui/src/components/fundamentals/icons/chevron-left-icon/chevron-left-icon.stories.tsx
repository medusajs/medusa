import { ComponentMeta } from "@storybook/react"
import React from "react"
import ChevronLeftIcon from "."

export default {
  title: "Fundamentals/Icons/ChevronLeftIcon",
  component: ChevronLeftIcon,
  argTypes: {
    size: {
      control: {
        type: "select",
        options: ["24", "20", "16"],
      },
    },
  },
} as ComponentMeta<typeof ChevronLeftIcon>

const Template = (args) => <ChevronLeftIcon {...args} />

export const Icon = Template.bind({})
Icon.args = {
  size: "24",
  color: "currentColor",
}
