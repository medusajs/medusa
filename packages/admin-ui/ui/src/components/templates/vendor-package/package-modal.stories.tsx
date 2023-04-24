import { ComponentMeta, ComponentStory } from "@storybook/react"
import React from "react"
import { PackageModal } from "./package-modal"
export default {
  title: "Template/AddPackageModal",
  component: PackageModal,
} as ComponentMeta<typeof PackageModal>

const Template: ComponentStory<typeof PackageModal> = (args) => (
  <PackageModal {...args} />
)

export const Default = Template.bind({})
Default.args = {
  onClose: () => {},
}
