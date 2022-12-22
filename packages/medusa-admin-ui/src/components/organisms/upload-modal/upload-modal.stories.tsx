import { ComponentMeta, ComponentStory } from "@storybook/react"
import React from "react"

import UploadModal from "./"

export default {
  title: "Organisms/UploadModal",
  component: UploadModal,
} as ComponentMeta<typeof UploadModal>

const Template: ComponentStory<typeof UploadModal> = (args) => (
  <UploadModal {...args} />
)

export const Default = Template.bind({})
Default.args = {
  fileTitle: "price list",
  actionButtonText: "Add Products Manually",
  description1Text:
    ' You can add to or "update" a price list. A new import will update products with the same SKU. New products will be implemented as Drafts. Updated products will keep their current status.',
  description2Title: "Unsure about how to arrange your list?",
  description2Text:
    "We have created a template file for you. Type in your own information and experience how much time and frustration this functionality can save you. Feel free to reach out if you have any questions.",
}
