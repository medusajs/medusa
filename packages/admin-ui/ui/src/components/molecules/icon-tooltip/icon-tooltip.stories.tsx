import { ComponentMeta, ComponentStory } from "@storybook/react"
import React from "react"
import { default as IconTooltip, default as Input } from "."

export default {
  title: "Molecules/IconTooltip",
  component: IconTooltip,
  argTypes: {
    type: {
      control: {
        type: "select",
        options: ["info", "warning", "error"],
      },
      content: {
        control: {
          type: "text",
        },
      },
    },
  },
} as ComponentMeta<typeof IconTooltip>

const Template: ComponentStory<typeof IconTooltip> = (args) => (
  <Input {...args} />
)

export const Info = Template.bind({})
Info.args = {
  content: "Tags are one word descriptors for the product used for searches",
}

export const Warning = Template.bind({})
Warning.args = {
  content: "Tags are one word descriptors for the product used for searches",
  type: "warning",
}

export const Error = Template.bind({})
Error.args = {
  content: "Tags are one word descriptors for the product used for searches",
  type: "error",
}
