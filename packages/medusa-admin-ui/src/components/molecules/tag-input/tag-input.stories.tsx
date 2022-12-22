import { ComponentMeta, ComponentStory } from "@storybook/react"
import React from "react"
import TagInput from "."

export default {
  title: "Molecules/TagInput",
  component: TagInput,
} as ComponentMeta<typeof TagInput>

const Template: ComponentStory<typeof TagInput> = (args) => (
  <TagInput {...args} />
)

export const Normal = Template.bind({})
Normal.args = {
  label: "Tags (comma separated values)",
  values: ["SS21", "Core"],
  placeholder: "Sprint, autumn, etc.",
  tooltipContent: "Used to add keywords",
}
