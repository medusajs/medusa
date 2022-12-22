import { ComponentMeta } from "@storybook/react"
import React from "react"
import SettingsCard from "."
import HappyIcon from "../../fundamentals/icons/happy-icon"

export default {
  title: "Atoms/SettingsCard",
  component: SettingsCard,
} as ComponentMeta<typeof SettingsCard>

const Template = args => <SettingsCard {...args} />

const icon = <HappyIcon />

export const CustomerService = Template.bind({})
CustomerService.args = {
  icon: icon,
  heading: "Customer Service",
  description: "Reach out to our customer service team",
  to: "/customer-service",
  externalLink: null,
  disabled: false,
}
