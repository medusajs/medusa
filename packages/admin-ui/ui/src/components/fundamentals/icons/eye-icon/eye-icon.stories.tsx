import { ComponentMeta } from "@storybook/react"
import React from "react"
import EyeIcon from "."

export default {
  title: "Fundamentals/Icons/EyeIcon",
  component: EyeIcon,
  argTypes: {
    size: {
      control: {
        type: "select",
        options: ["24", "20", "16"],
      },
    },
  },
} as ComponentMeta<typeof EyeIcon>

const Template = (args) => <EyeIcon {...args} />

export const Icon = Template.bind({})
Icon.args = {
  size: "20",
  color: "currentColor",
}
