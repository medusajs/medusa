import { ComponentMeta, ComponentStory } from "@storybook/react"
import React from "react"
import { TableToasterContainer } from "../molecules/table-toaster"
import Toaster from "./"

export default {
  title: "Components/DeclarativeToaster",
  component: Toaster,
} as ComponentMeta<typeof Toaster>

const Template: ComponentStory<typeof Toaster> = (args) => (
  <div className="flex justify-center">
    <span>Toggle the visible control below to show the toaster</span>
    <Toaster {...args}>
      <TableToasterContainer>
        <span className="text-grey-0">Helloooo</span>
      </TableToasterContainer>
    </Toaster>
  </div>
)

export const Default = Template.bind({})
Default.args = {
  visible: false,
  duration: Infinity,
  position: "bottom-center",
}
