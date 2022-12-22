import { ComponentMeta, ComponentStory } from "@storybook/react"
import React from "react"
import ToasterContainer from "."

export default {
  title: "Atoms/ToasterContainer",
  component: ToasterContainer,
} as ComponentMeta<typeof ToasterContainer>

const Template: ComponentStory<typeof ToasterContainer> = (args) => (
  <div className="flex items-start bg-grey-0 p-base border border-grey-20 rounded-rounded shadow-toaster w-[380px]">
    <ToasterContainer {...args} />
  </div>
)

export const Success = Template.bind({})
Success.args = { visible: true }

export const Error = Template.bind({})
Error.args = {
  visible: true,
}

export const Warning = Template.bind({})
Warning.args = {
  visible: true,
}

export const Info = Template.bind({})
Info.args = {
  visible: true,
}
