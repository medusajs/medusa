import { ComponentMeta } from "@storybook/react"
import React from "react"
import DownLeftIcon from "."

export default {
  title: "Fundamentals/Icons/DownLeftIcon",
  component: DownLeftIcon,
  argTypes: {
    size: {
      control: {
        type: "select",
        options: ["24", "20", "16"],
      },
    },
  },
} as ComponentMeta<typeof DownLeftIcon>

const Template = (args) => <DownLeftIcon {...args} />

export const Icon = Template.bind({})
Icon.args = {
  size: "16px",
  color: "currentColor",
}
