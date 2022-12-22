import { ComponentMeta } from "@storybook/react"
import React from "react"
import MinusIcon from "."

export default {
  title: "Fundamentals/Icons/MinusIcon",
  component: MinusIcon,
  argTypes: {
    size: {
      control: {
        type: "select",
        options: ["24", "20", "16"],
      },
    },
  },
} as ComponentMeta<typeof MinusIcon>

const Template = args => <MinusIcon {...args} />

export const Icon = Template.bind({})
Icon.args = {
  size: "24",
  color: "currentColor",
}
