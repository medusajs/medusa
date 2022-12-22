import { ComponentMeta } from "@storybook/react"
import React from "react"
import GearIcon from "."

export default {
  title: "Fundamentals/Icons/GearIcon",
  component: GearIcon,
  argTypes: {
    size: {
      control: {
        type: "select",
        options: ["24", "20", "16"],
      },
    },
  },
} as ComponentMeta<typeof GearIcon>

const Template = args => <GearIcon {...args} />

export const Icon = Template.bind({})
Icon.args = {
  size: "24",
  color: "currentColor",
}
