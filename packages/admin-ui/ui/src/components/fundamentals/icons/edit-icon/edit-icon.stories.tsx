import { ComponentMeta } from "@storybook/react"
import React from "react"
import EditIcon from "."

export default {
  title: "Fundamentals/Icons/EditIcon",
  component: EditIcon,
  argTypes: {
    size: {
      control: {
        type: "select",
        options: ["24", "20", "16"],
      },
    },
  },
} as ComponentMeta<typeof EditIcon>

const Template = args => <EditIcon {...args} />

export const Icon = Template.bind({})
Icon.args = {
  size: "20",
  color: "currentColor",
}
