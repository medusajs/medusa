import { ComponentMeta } from "@storybook/react"
import React from "react"
import UploadIcon from "."

export default {
  title: "Fundamentals/Icons/UploadIcon",
  component: UploadIcon,
  argTypes: {
    size: {
      control: {
        type: "select",
        options: ["24", "20", "16"],
      },
    },
  },
} as ComponentMeta<typeof UploadIcon>

const Template = (args) => <UploadIcon {...args} />

export const Icon = Template.bind({})
Icon.args = {
  size: "20",
  color: "currentColor",
}
