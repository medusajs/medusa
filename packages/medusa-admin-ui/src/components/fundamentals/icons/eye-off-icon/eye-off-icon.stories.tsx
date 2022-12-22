import { ComponentMeta } from "@storybook/react"
import React from "react"
import EyeOffIcon from "."

export default {
  title: "Fundamentals/Icons/EyeOffIcon",
  component: EyeOffIcon,
  argTypes: {
    size: {
      control: {
        type: "select",
        options: ["24", "20", "16"],
      },
    },
  },
} as ComponentMeta<typeof EyeOffIcon>

const Template = (args) => <EyeOffIcon {...args} />

export const Icon = Template.bind({})
Icon.args = {
  size: "20",
  color: "currentColor",
}
