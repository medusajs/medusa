import { ComponentMeta } from "@storybook/react"
import React from "react"
import SadFaceIcon from "./index"

export default {
  title: "Fundamentals/Icons/CrossIcon",
  component: SadFaceIcon,
  argTypes: {
    size: {
      control: {
        type: "select",
        options: ["24", "20", "16"],
      },
    },
  },
} as ComponentMeta<typeof SadFaceIcon>

const Template = args => <SadFaceIcon {...args} />

export const Icon = Template.bind({})
Icon.args = {
  size: "24",
  color: "currentColor",
}
