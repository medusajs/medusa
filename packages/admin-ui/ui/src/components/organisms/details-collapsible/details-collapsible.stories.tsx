import { ComponentMeta, ComponentStory } from "@storybook/react"
import React from "react"
import DetailsCollapsible from "."
import Input from "../../molecules/input"

export default {
  title: "Organisms/DetailsCollapsible",
  component: DetailsCollapsible,
} as ComponentMeta<typeof DetailsCollapsible>

const Template: ComponentStory<typeof DetailsCollapsible> = (args) => (
  <DetailsCollapsible {...args} />
)

export const Component = Template.bind({})
Component.args = {
  children: (
    <div className="flex flex-col w-1/2 space-y-4">
      <Input label="Handle" name="handle" value="medusa-t-shirt" />
      <Input label="Subtitle" name="subtitle" placeholder="Add a subtitle" />
    </div>
  ),
  triggerProps: {
    className: "ml-2",
  },
  contentProps: {
    className: "px-6",
  },
  rootProps: {},
}
