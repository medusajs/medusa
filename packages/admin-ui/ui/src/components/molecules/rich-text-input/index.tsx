import { FC, useState } from "react"
import { Controller, useFormContext } from "react-hook-form"
import { OutputData } from "@editorjs/editorjs"
import clsx from "clsx"
import { Editor, EditorBaseProps, EditorCore } from "../../organisms/editor"
import "./rich-text-input.css"

export interface RichTextInputProps {
  name: string
  label?: string
  placeholder?: string
  onReady?: (core: EditorCore) => void
  editor?: FC<EditorBaseProps>
  editorProps?: EditorBaseProps
}

export const RichTextInput: FC<RichTextInputProps> = ({
  name,
  label,
  placeholder,
  onReady,
  editor,
  editorProps,
}) => {
  const { control, setValue } = useFormContext()
  const [isReady, setIsReady] = useState(false)

  const handleInitialize = (core: EditorCore) => {
    setIsReady(true)
    onReady?.(core)
    editorProps?.onInitialize?.(core)
  }

  const handleChange = async (content?: OutputData) => {
    // Editor calls `onChange` when it first loads, so we want to avoid
    // auto-saving before the user actually makes a change.
    if (!isReady) return

    setValue(name, content, { shouldDirty: true })
    editorProps?.onChange?.(content)
  }

  const EditorComponent = editor || Editor

  return (
    <div className="rich-text-input flex flex-col gap-2">
      {label && <h3 className="inter-small-semibold text-grey-50">{label}</h3>}
      <Controller
        name={name}
        control={control}
        render={({ field: { value } }) => (
          <EditorComponent
            {...editorProps}
            value={value}
            onInitialize={handleInitialize}
            placeholder={placeholder}
            onChange={handleChange}
            className={clsx(
              "rich-text-input__editor prose-sm",
              editorProps?.className
            )}
          />
        )}
      />
    </div>
  )
}
