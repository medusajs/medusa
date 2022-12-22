import { ComponentMeta } from "@storybook/react"
import React from "react"
import GiftIcon from "."

export default {
  title: "Fundamentals/Icons/GiftIcon",
  component: GiftIcon,
  argTypes: {
    size: {
      control: {
        type: "select",
        options: ["24", "20", "16"],
      },
    },
  },
} as ComponentMeta<typeof GiftIcon>

const Template = args => <GiftIcon {...args} />

export const Icon = Template.bind({})
Icon.args = {
  size: "24",
  color: "currentColor",
}
