import { FC } from "react"
import { useFormContext } from "react-hook-form"
import { FileInput } from "../../../../../../../../../../components/molecules/file-input"
import Input from "../../../../../../../../../../components/molecules/input"
import { RichTextInput } from "../../../../../../../../../../components/molecules/rich-text-input"
import ActionTable from "../../../../../../../../../../components/organisms/action-table"
import { EditorSimple } from "../../../../../../../../../../components/organisms/editor"

export interface HeroFormProps {}

export const HeroForm: FC<HeroFormProps> = () => {
  const { register } = useFormContext()

  return (
    <div className="flex flex-col gap-4">
      <FileInput label="Image" name="content.image" />

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
