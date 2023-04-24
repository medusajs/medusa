import { ComponentMeta, ComponentStory } from "@storybook/react"
import React from "react"
import { AddVendorModal } from "./add-vendor-modal"

export default {
  title: "Template/AddStoreModal",
  component: AddVendorModal,
} as ComponentMeta<typeof AddVendorModal>

const Template: ComponentStory<typeof AddVendorModal> = (args) => (
  <AddVendorModal {...args} />
)

export const Default = Template.bind({})
Default.args = {
  onClose: () => {},
  onSubmit: (values) => console.log(JSON.stringify(values, null, 2)),
}
