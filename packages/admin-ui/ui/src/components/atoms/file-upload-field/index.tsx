import clsx from "clsx"
import React, { useRef, useState } from "react"

type FileUploadFieldProps = {
  onFileChosen: (files: File[]) => void
  filetypes: string[]
  errorMessage?: string
  placeholder?: React.ReactElement | string
  className?: string
  multiple?: boolean
  text?: React.ReactElement | string
  disabled?: boolean
}

const FileUploadField: React.FC<FileUploadFieldProps> = ({
  onFileChosen,
  filetypes,
  errorMessage,
  className,
  text,
  placeholder = "",
  multiple = false,
  disabled,
}) => {
  const inputRef = useRef<HTMLInputElement>(null)
  const [fileUploadError, setFileUploadError] = useState(false)

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (disabled) return

    const fileList = e.target.files

    if (fileList) {
      onFileChosen(Array.from(fileList))
    }
  }

  const handleFileDrop = (e: React.DragEvent<HTMLDivElement>) => {
    if (disabled) return

    setFileUploadError(false)

    e.preventDefault()

    const files: File[] = []

    if (e.dataTransfer.items) {
      // Use DataTransferItemList interface to access the file(s)
      for (let i = 0; i < e.dataTransfer.items.length; i++) {
        // If dropped items aren't files, reject them
        if (e.dataTransfer.items[i].kind === "file") {
          const file = e.dataTransfer.items[i].getAsFile()
          if (file && filetypes.indexOf(file.type) > -1) {
            files.push(file)
          }
        }
      }
    } else {
      // Use DataTransfer interface to access the file(s)
      for (let i = 0; i < e.dataTransfer.files.length; i++) {
        if (filetypes.indexOf(e.dataTransfer.files[i].type) > -1) {
          files.push(e.dataTransfer.files[i])
        }
      }
    }

    if (files.length === 1) {
      onFileChosen(files)
    } else {
      setFileUploadError(true)
    }
  }

  const defaultText = (
    <span>
      Drop your image{multiple ? "s" : ""} here, or{" "}
      <span className="text-violet-60">click to browse</span>
    </span>
  )

  return (
    <div
      onClick={() => inputRef?.current?.click()}
      onDrop={handleFileDrop}
      onDragOver={(e) => e.preventDefault()}
      className={clsx(
        "flex flex-col select-none text-grey-50 cursor-pointer items-center justify-center w-full h-full rounded-rounded border-2 border-dashed border-grey-20 transition-colors hover:border-violet-60 hover:text-grey-40 focus:!border-violet-60 focus:outline-none focus:shadow-cta py-6 px-6",
        className
      )}
      role="button"
      tabIndex={0}
    >
      <div className="text-center">
        <p>{text || defaultText}</p>
        <div>{placeholder}</div>
      </div>

      {fileUploadError && (
        <span className="text-rose-60">
          {errorMessage || "Please upload an image file"}
        </span>
      )}

      <input
        ref={inputRef}
        accept={filetypes.join(", ")}
        multiple={multiple}
        type="file"
        onChange={handleFileUpload}
        className="hidden"
        disabled={disabled}
      />
    </div>
  )
}

export default FileUploadField
