import { ArrowDownTray } from "@medusajs/icons"
import { Text, clx } from "@medusajs/ui"
import { ChangeEvent, DragEvent, useRef, useState } from "react"

export interface FileType {
  id: string
  url: string
  file: File
}

export interface FileUploadProps {
  label: string
  hint?: string
  hasError?: boolean
  formats: string[]
  onUploaded: (files: FileType[]) => void
}

export const FileUpload = ({
  label,
  hint,
  hasError,
  formats,
  onUploaded,
}: FileUploadProps) => {
  const [isDragOver, setIsDragOver] = useState<boolean>(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const dropZoneRef = useRef<HTMLButtonElement>(null)

  const handleOpenFileSelector = () => {
    inputRef.current?.click()
  }

  const handleDragEnter = (event: DragEvent) => {
    event.preventDefault()
    event.stopPropagation()

    const files = event.dataTransfer?.files
    if (!files) {
      return
    }

    setIsDragOver(true)
  }

  const handleDragLeave = (event: DragEvent) => {
    event.preventDefault()
    event.stopPropagation()

    if (
      !dropZoneRef.current ||
      dropZoneRef.current.contains(event.relatedTarget as Node)
    ) {
      return
    }

    setIsDragOver(false)
  }

  const handleUploaded = (files: FileList | null) => {
    if (!files) {
      return
    }

    const fileList = Array.from(files)
    const fileObj = fileList.map((file) => {
      const id = Math.random().toString(36).substring(7)

      const previewUrl = URL.createObjectURL(file)
      return {
        id: id,
        url: previewUrl,
        file,
      }
    })

    onUploaded(fileObj)
  }

  const handleDrop = (event: DragEvent) => {
    event.preventDefault()
    event.stopPropagation()

    setIsDragOver(false)

    handleUploaded(event.dataTransfer?.files)
  }

  const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    handleUploaded(event.target.files)
  }

  return (
    <div>
      <button
        ref={dropZoneRef}
        type="button"
        onClick={handleOpenFileSelector}
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        className={clx(
          "bg-ui-bg-component border-ui-border-strong transition-fg group flex w-full flex-col items-center gap-y-2 rounded-lg border border-dashed p-8",
          "hover:border-ui-border-interactive focus:border-ui-border-interactive",
          "focus:shadow-borders-focus outline-none focus:border-solid",
          {
            "!border-ui-border-error": hasError,
            "!border-ui-border-interactive": isDragOver,
          }
        )}
      >
        <div className="text-ui-fg-subtle group-disabled:text-ui-fg-disabled flex items-center gap-x-2">
          <ArrowDownTray />
          <Text>{label}</Text>
        </div>
        {!!hint && (
          <Text
            size="small"
            leading="compact"
            className="text-ui-fg-muted group-disabled:text-ui-fg-disabled"
          >
            {hint}
          </Text>
        )}
      </button>
      <input
        hidden
        ref={inputRef}
        onChange={handleFileChange}
        type="file"
        accept={formats.join(",")}
        multiple
      />
    </div>
  )
}
