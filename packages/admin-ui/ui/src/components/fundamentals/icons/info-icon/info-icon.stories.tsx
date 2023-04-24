import { ComponentMeta, ComponentStory } from "@storybook/react"
import React from "react"
import InfoIcon from "."

export default {
  title: "Fundamentals/Icons/InfoIcon",
  component: InfoIcon,
  argTypes: {
    size: {
      control: {
        type: "select",
        options: ["24", "20", "16"],
      },
    },
  },
} as ComponentMeta<typeof InfoIcon>

const Template: ComponentStory<typeof InfoIcon> = (args) => (
  <InfoIcon {...args} />
)

export const Icon = Template.bind({})
Icon.args = {
  size: "24",
  color: "currentColor",
}
