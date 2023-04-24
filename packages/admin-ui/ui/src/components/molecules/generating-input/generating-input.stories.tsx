import { ComponentMeta, ComponentStory } from "@storybook/react"
import React from "react"
import GeneratingInput from "."

export default {
  title: "Molecules/GeneratingInput",
  component: GeneratingInput,
} as ComponentMeta<typeof GeneratingInput>

const Template: ComponentStory<typeof GeneratingInput> = (args) => (
  <GeneratingInput {...args} />
)

export const Default = Template.bind({})
Default.args = {
  label: "Code",
  required: true,
  placeholder: "MEDUSA15",
}

export const HasValue = Template.bind({})
HasValue.args = {
  label: "Code",
  required: true,
  placeholder: "MEDUSA15",
  value: "SUMMER2014",
}
