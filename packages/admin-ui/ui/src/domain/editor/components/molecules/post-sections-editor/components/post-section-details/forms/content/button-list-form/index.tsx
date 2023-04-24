import { FC } from "react"
import { useFormContext } from "react-hook-form"
import Input from "../../../../../../../../../../components/molecules/input"
import ActionTable from "../../../../../../../../../../components/organisms/action-table"
import { EditorSimple } from "../../../../../../../../../../components/organisms/editor"
import { RichTextInput } from "../../../../../../../../../../components/molecules/rich-text-input"

export interface ButtonListFormProps {}

export const ButtonListForm: FC<ButtonListFormProps> = () => {
  const { register } = useFormContext()

  return (
    <div className="flex flex-col gap-4">
      <Input label="Heading" {...register("content.heading.value")} />

      <RichTextInput
        label="Text"
        name="content.text.value"
        placeholder="Enter text..."
        editor={EditorSimple}
      />

      <ActionTable name="content.actions" translatable stylable narrow />
    </div>
  )
}
