import { ComponentMeta, ComponentStory } from "@storybook/react"
import React from "react"
import Input from "."
import Tooltip from "../../atoms/tooltip"
import AlertIcon from "../../fundamentals/icons/alert-icon"

export default {
  title: "Molecules/Input",
  component: Input,
} as ComponentMeta<typeof Input>

const Template: ComponentStory<typeof Input> = (args) => <Input {...args} />

export const Default = Template.bind({})
Default.args = {
  label: "First name",
  placeholder: "LeBron James",
}

export const Required = Template.bind({})
Required.args = {
  label: "Email",
  required: true,
  placeholder: "lebron@james.com",
}

export const WithInfoTooltip = Template.bind({})
WithInfoTooltip.args = {
  label: "Default",
  tooltipContent: "This is a tooltip",
}

export const WithCustomTooltip = Template.bind({})
WithCustomTooltip.args = {
  label: "Tricky",
  tooltip: (
    <Tooltip
      content={"Changing this might cause bad luck"}
      className="text-rose-50"
      side="right"
      align="end"
    >
      <AlertIcon size={16} className="flex text-rose-50" />
    </Tooltip>
  ),
}
