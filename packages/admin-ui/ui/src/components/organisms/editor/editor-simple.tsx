import clsx from "clsx"
import { FC } from "react"
import { useEditorJSTools } from "./constants"
import { EditorBase, EditorBaseProps } from "./editor-base"

export interface EditorSimpleProps extends EditorBaseProps {}

export const EditorSimple: FC<EditorSimpleProps> = ({
  tools,
  className,
  ...props
}) => {
  const { header, paragraph, nestedList, image, underline, textAlign } =
    useEditorJSTools()

  return (
    <EditorBase
      holder="editor-simple"
      tools={{
        header,
        paragraph,
        nestedList,
        image,
        underline,
        textAlign,
        ...tools,
      }}
      tunes={["textAlign"]}
      className={clsx("editor--simple", className)}
      {...props}
    />
  )
}
