import { ComponentMeta, ComponentStory } from "@storybook/react"
import React from "react"
import { ArchiveVendorModal } from "./archive-vendor-modal"

export default {
  title: "Template/AddStoreModal",
  component: ArchiveVendorModal,
} as ComponentMeta<typeof ArchiveVendorModal>

const Template: ComponentStory<typeof ArchiveVendorModal> = (args) => (
  <ArchiveVendorModal {...args} />
)

export const Default = Template.bind({})
Default.args = {
  onClose: () => {},
  onSuccess: () => console.log(JSON.stringify({ type: "success" }, null, 2)),
}
