import { ComponentMeta } from "@storybook/react"
import React from "react"
import OSShortcut from "."

export default {
  title: "Atoms/OSShortcut",
  component: OSShortcut,
} as ComponentMeta<typeof OSShortcut>

const Template = args => <OSShortcut {...args} />

export const CmdK = Template.bind({})
CmdK.args = {
  winModifiers: "Control",
  macModifiers: "⌘",
  keys: "K",
}

export const CmdKL = Template.bind({})
CmdKL.args = {
  winModifiers: "Control",
  macModifiers: "⌘",
  keys: ["K", "L"],
}
