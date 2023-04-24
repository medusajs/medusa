import { ComponentMeta } from "@storybook/react"
import React from "react"
import SortingIcon from "."

export default {
  title: "Fundamentals/Icons/SortingIcon",
  component: SortingIcon,
  argTypes: {
    size: {
      control: {
        type: "select",
        options: ["24", "20", "16"],
      },
    },
  },
} as ComponentMeta<typeof SortingIcon>

const Template = (args) => <SortingIcon {...args} />

export const Icon = Template.bind({})
Icon.args = {
  size: "24",
  color: "#a0a0a0",
}

export const DescendingIcon = Template.bind({})
DescendingIcon.args = {
  size: "24",
  color: "#a0a0a0",
  descendingColor: "#111827",
}

export const AscendingIcon = Template.bind({})
AscendingIcon.args = {
  size: "24",
  color: "#a0a0a0",
  ascendingColor: "#111827",
}
