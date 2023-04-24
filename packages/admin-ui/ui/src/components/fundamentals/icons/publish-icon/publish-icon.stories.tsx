import { ComponentMeta } from "@storybook/react"
import React from "react"
import PublishIcon from "."

export default {
  title: "Fundamentals/Icons/PublishIcon",
  component: PublishIcon,
  argTypes: {
    size: {
      control: {
        type: "select",
        options: ["24", "20", "16"],
      },
    },
  },
} as ComponentMeta<typeof PublishIcon>

const Template = args => <PublishIcon {...args} />

export const Icon = Template.bind({})
Icon.args = {
  size: "20",
  color: "currentColor",
}
