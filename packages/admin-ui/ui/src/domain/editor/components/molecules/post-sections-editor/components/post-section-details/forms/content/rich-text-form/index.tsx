import { FC } from "react"
import { RichTextInput } from "../../../../../../../../../../components/molecules/rich-text-input"

export interface RichTextFormProps {}

export const RichTextForm: FC<RichTextFormProps> = () => (
  <RichTextInput
    label="Content"
    name="content.text.value"
    placeholder="Enter your content..."
  />
)
