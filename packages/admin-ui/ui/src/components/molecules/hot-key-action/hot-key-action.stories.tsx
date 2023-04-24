import { ComponentMeta, ComponentStory } from "@storybook/react"
import React from "react"
import HotKeyAction from "."
import BackspaceIcon from "../../fundamentals/icons/backspace-icon"

export default {
  title: "Molecules/HotKeyAction",
} as ComponentMeta<typeof HotKeyAction>

const Template: ComponentStory<typeof HotKeyAction> = (args) => (
  <div className="flex bg-grey-80 p-base">
    <HotKeyAction {...args} />
  </div>
)

export const Default = Template.bind({})
Default.args = {
  label: "Unpublish",
  icon: "U",
  hotKey: "U",
  onAction: () => alert("U key pressed!"),
}

export const WithIcon = Template.bind({})
WithIcon.args = {
  label: "Delete",
  icon: <BackspaceIcon />,
  hotKey: "backspace",
  onAction: () => alert("backspace key pressed!"),
}
