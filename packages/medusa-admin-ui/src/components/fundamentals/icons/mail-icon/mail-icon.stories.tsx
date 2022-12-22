import { ComponentMeta } from "@storybook/react"
import React from "react"
import MailIcon from "."

export default {
  title: "Fundamentals/Icons/MailIcon",
  component: MailIcon,
  argTypes: {
    size: {
      control: {
        type: "select",
        options: ["24", "20", "16"],
      },
    },
  },
} as ComponentMeta<typeof MailIcon>

const Template = args => <MailIcon {...args} />

export const Icon = Template.bind({})
Icon.args = {
  size: "24",
  color: "currentColor",
}
