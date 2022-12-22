import { ComponentMeta } from "@storybook/react"
import React from "react"
import SaleIcon from "."

export default {
  title: "Fundamentals/Icons/SaleIcon",
  component: SaleIcon,
  argTypes: {
    size: {
      control: {
        type: "select",
        options: ["24", "20", "16"],
      },
    },
  },
} as ComponentMeta<typeof SaleIcon>

const Template = (args) => <SaleIcon {...args} />

export const Icon = Template.bind({})
Icon.args = {
  size: "24",
  color: "currentColor",
}
