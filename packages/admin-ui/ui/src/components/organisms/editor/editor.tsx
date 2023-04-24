import clsx from "clsx"
import { FC } from "react"
import { useEditorJSTools } from "./constants"
import { EditorBase, EditorBaseProps } from "./editor-base"

export interface EditorProps extends EditorBaseProps {}

export const Editor: FC<EditorProps> = ({
  tools,
  className,
  tunes,
  ...props
}) => {
  const editorJSTools = useEditorJSTools()

  return (
    <EditorBase
      holder="editor-full"
      tools={{ ...editorJSTools, ...tools }}
      tunes={["textAlign", ...(tunes || [])]}
      className={clsx("editor--full", className)}
      {...props}
    />
  )
}
