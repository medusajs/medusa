import { ComponentMeta, ComponentStory } from "@storybook/react"
import React from "react"
import ViewRaw from "."

export default {
  title: "Molecules/ViewRaw",
  component: ViewRaw,
} as ComponentMeta<typeof ViewRaw>

const Template: ComponentStory<typeof ViewRaw> = (args) => <ViewRaw {...args} />

export const Default = Template.bind({})
const metadata = {
  test: true,
  valid_days: ["monday", "wednesday", "friday"],
}

Default.args = {
  raw: metadata,
}

export const WithName = Template.bind({})
WithName.args = {
  raw: metadata,
  name: "metadata",
}
