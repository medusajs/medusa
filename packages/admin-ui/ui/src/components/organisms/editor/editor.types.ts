import { OutputData } from "@editorjs/editorjs"

// NOTE: This is a copy of an unexported type from @react-editor-js
export interface EditorCore {
  destroy(): Promise<void>
  clear(): Promise<void>
  save(): Promise<OutputData>
  render(data: OutputData): Promise<void>
}
