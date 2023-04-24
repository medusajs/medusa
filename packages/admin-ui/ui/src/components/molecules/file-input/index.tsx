import { FC, ReactNode, useState } from "react"
import { Controller, useFormContext } from "react-hook-form"
import { UploadFileRes, useUploadFile } from "../../../hooks/use-upload-file"
import TrashIcon from "../../fundamentals/icons/trash-icon"
import FileUploadField from "../../atoms/file-upload-field"
import clsx from "clsx"
import DeletePrompt from "../../organisms/delete-prompt"
import { MagnifyingGlassPlusIcon } from "@heroicons/react/24/outline"
import InputHeader from "../../fundamentals/input-header"

export interface FileInputProps {
  name: string
  label?: string
  onFileChosen?: (files: UploadFileRes[]) => void
  onFileClear?: () => void
  shouldConfirmClear?: boolean
  multiple?: boolean
  tooltipContent?: string
  tooltip?: ReactNode
  className?: string
  disabled?: boolean
}

export const FileInput: FC<FileInputProps> = ({
  name,
  label,
  onFileChosen,
  onFileClear,
  shouldConfirmClear,
  multiple = false,
  tooltipContent,
  tooltip,
  className,
  disabled,
}) => {
  const [confirmClear, setConfirmClear] = useState(false)
  const { control, setValue } = useFormContext()
  const uploadFile = useUploadFile()

  const handleFileChosen = async (files: File[]) => {
    const uploadedFiles = await uploadFile(files)

    if (!uploadedFiles) return

    setValue(
      name,
      multiple
        ? uploadedFiles.map(({ url }) => ({ url }))
        : { url: uploadedFiles[0].url },
      {
        shouldDirty: true,
      }
    )
    if (onFileChosen) onFileChosen(uploadedFiles)
  }

  const handleClearClick = () => {
    if (shouldConfirmClear) return setConfirmClear(true)

    clearFile()
  }

  const viewFile = (url) => {
    if (typeof window !== "undefined") window.open(url, "_blank")
  }

  const clearFile = async () => {
    // TODO: Update to support multiple files
    setValue(name, null, { shouldDirty: true })
    if (onFileClear) onFileClear()
  }

  return (
    <div className={className}>
      {label && (
        <InputHeader
          {...{ label, tooltipContent, tooltip }}
          className="mb-xsmall"
        />
      )}

      <div
        className={clsx("w-full inter-base-regular", {
          "pointer-events-none cursor-not-allowed": disabled,
        })}
      >
        <Controller
          name={name}
          control={control}
          render={({ field: { value } }) => {
            const hasImage = !!value?.url

            return (
              <>
                {hasImage && (
                  <div className="w-full flex flex-wrap items-center justify-center gap-2 p-base border-2 text-grey-50 border-dashed border-gray-200 rounded-rounded">
                    <div className="relative group flex items-center justify-center transition-colors border border-grey-20 hover:border-dashed hover:border-violet-60 focus:border-violet-60 focus:outline-none focus:shadow-cta">
                      <img
                        src={value?.url}
                        alt="featured image"
                        className="w-full h-auto max-h-60 object-fill"
                      />
                      <div className="hidden group-hover:flex absolute inset-0 items-center justify-center gap-2">
                        <button
                          className="bg-violet-60 hover:bg-violet-50 text-white p-2 rounded-full"
                          onClick={() => viewFile(value.url)}
                        >
                          <MagnifyingGlassPlusIcon className="w-6 h-6" />
                        </button>
                        <button
                          className="bg-violet-60 hover:bg-violet-50 text-white p-2 rounded-full"
                          onClick={handleClearClick}
                        >
                          <TrashIcon className="w-6 h-6" />
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {!hasImage && (
                  <FileUploadField
                    onFileChosen={handleFileChosen}
                    placeholder="Images can be up to 10MB each, for products we recommend a 1:1 aspect ratio."
                    filetypes={[
                      "image/gif",
                      "image/jpeg",
                      "image/jpg",
                      "image/png",
                      "image/webp",
                    ]}
                    className={clsx("!py-base")}
                    multiple={multiple}
                    disabled={disabled}
                  />
                )}
              </>
            )
          }}
        />

        {confirmClear && (
          <DeletePrompt
            heading="Are you sure you want to delete this image?"
            text="This action cannot be undone."
            onDelete={() => clearFile()}
            onCancel={() => setConfirmClear(false)}
            handleClose={() => setConfirmClear(false)}
          />
        )}
      </div>
    </div>
  )
}
