import { ComponentMeta } from "@storybook/react"
import React from "react"
import StatusIndicator from "."

export default {
  title: "Fundamentals/StatusIndicator",
  component: StatusIndicator,
} as ComponentMeta<typeof StatusIndicator>

const Template = (args) => <StatusIndicator {...args} />

export const Success = Template.bind({})
Success.args = {
  variant: "success",
  title: "Active",
}

export const Danger = Template.bind({})
Danger.args = {
  variant: "danger",
  title: "Expired",
}

export const Warning = Template.bind({})
Warning.args = {
  variant: "warning",
  title: "Pending",
}

export const Primary = Template.bind({})
Primary.args = {
  variant: "primary",
  title: "Go",
}
