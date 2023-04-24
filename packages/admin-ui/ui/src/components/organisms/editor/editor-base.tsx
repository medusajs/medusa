import React, { FC, useEffect, useState } from "react"
import { createReactEditorJS } from "react-editor-js"
import type { API, EditorConfig } from "@editorjs/editorjs"
import clsx from "clsx"
import { EditorCore } from "./editor.types"
import "./editor.css"

export interface EditorBaseProps
  extends Omit<EditorConfig, "data" | "onChange"> {
  holder?: string
  children?: React.ReactElement
  value?: EditorConfig["data"]
  defaultValue?: EditorConfig["data"]
  onInitialize?: (core: EditorCore) => void
  onChange?: (value: EditorConfig["data"]) => void
  className?: string
}

const ReactEditorJS = createReactEditorJS()

export const EditorBase: FC<EditorBaseProps> = ({
  holder = "editor",
  value,
  onChange,
  className,
  ...props
}) => {
  const [_value, setValue] = useState(value)

  useEffect(() => {
    if (onChange) {
      // This is a work-around for the fact that the onChange callback is
      // cached by the EditorJS instance. This means that if the onChange
      // callback changes, the EditorJS instance will not be updated.
      onChange(_value)
    }
  }, [_value])

  const handleChange = async (api: API, event: CustomEvent) => {
    const content = await api.saver.save()
    setValue(content)
  }

  return (
    <ReactEditorJS
      holder={holder}
      // @ts-ignore
      data={value}
      onChange={handleChange}
      {...props}
    >
      <div id={holder} className={clsx("editor", className)} />
    </ReactEditorJS>
  )
}
