import { ComponentMeta } from "@storybook/react"
import React from "react"
import PlusIcon from "."

export default {
  title: "Fundamentals/Icons/PlusIcon",
  component: PlusIcon,
  argTypes: {
    size: {
      control: {
        type: "select",
        options: ["24", "20", "16"],
      },
    },
  },
} as ComponentMeta<typeof PlusIcon>

const Template = args => <PlusIcon {...args} />

export const Icon = Template.bind({})
Icon.args = {
  size: "24",
  color: "currentColor",
}
