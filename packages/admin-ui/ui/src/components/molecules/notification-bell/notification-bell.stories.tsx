import { ComponentMeta } from "@storybook/react"
import React from "react"
import NotificationBell from "."

export default {
  title: "Molecules/NotificationBell",
  component: NotificationBell,
} as ComponentMeta<typeof NotificationBell>

const Template = args => <NotificationBell {...args} />

export const HasNotifications = Template.bind({})
HasNotifications.args = {
  hasNotifications: true,
}

export const NoNotifications = Template.bind({})
NoNotifications.args = {
  hasNotifications: false,
}
