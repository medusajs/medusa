import { ComponentMeta } from "@storybook/react"
import React from "react"
import PointerIcon from "."

export default {
  title: "Fundamentals/Icons/PointerIcon",
  component: PointerIcon,
  argTypes: {
    size: {
      control: {
        type: "select",
        options: ["24", "20", "16"],
      },
    },
  },
} as ComponentMeta<typeof PointerIcon>

const Template = (args) => <PointerIcon {...args} />

export const Icon = Template.bind({})
Icon.args = {
  size: "16px",
  color: "currentColor",
}
