import { ComponentMeta, ComponentStory } from "@storybook/react"
import React from "react"
import Metadata from "."

export default {
  title: "Organisms/Metadata",
  component: Metadata,
} as ComponentMeta<typeof Metadata>

const Template: ComponentStory<typeof Metadata> = (args) => (
  <div className="max-w-md">
    <Metadata {...args} />
  </div>
)

export const Default = Template.bind({})
Default.args = {
  control: {},
  metadata: [],
}
