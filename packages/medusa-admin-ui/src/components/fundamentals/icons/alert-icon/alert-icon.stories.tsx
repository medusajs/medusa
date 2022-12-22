import { ComponentMeta, ComponentStory } from "@storybook/react"
import React from "react"
import AlertIcon from "."

export default {
  title: "Fundamentals/Icons/AlertIcon",
  component: AlertIcon,
  argTypes: {
    size: {
      control: {
        type: "select",
        options: ["24", "20", "16"],
      },
    },
  },
} as ComponentMeta<typeof AlertIcon>

const Template: ComponentStory<typeof AlertIcon> = (args) => (
  <AlertIcon {...args} />
)

export const Icon = Template.bind({})
Icon.args = {
  size: "24",
  color: "currentColor",
}
