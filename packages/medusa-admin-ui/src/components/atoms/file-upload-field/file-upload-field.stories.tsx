import { ComponentMeta } from "@storybook/react"
import React from "react"
import FileUploadField from "."

export default {
  title: "Atoms/FileUploadField",
  component: FileUploadField,
} as ComponentMeta<typeof FileUploadField>

const Template = (args) => (
  <div className="h-[200px] w-[750px]">
    <FileUploadField {...args} />
  </div>
)

export const FileUpload = Template.bind({})
FileUpload.args = {
  onFileChosen: (values) => {},
  filetypes: ["image/png", "image/jpeg"],
  placeholder: "Drag and drop an image here, or click to select a file",
}
