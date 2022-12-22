import { ComponentMeta } from "@storybook/react"
import React from "react"
import TagIcon from "."

export default {
  title: "Fundamentals/Icons/TagIcon",
  component: TagIcon,
  argTypes: {
    size: {
      control: {
        type: "select",
        options: ["24", "20", "16"],
      },
    },
  },
} as ComponentMeta<typeof TagIcon>

const Template = args => <TagIcon {...args} />

export const Icon = Template.bind({})
Icon.args = {
  size: "24",
  color: "currentColor",
}
