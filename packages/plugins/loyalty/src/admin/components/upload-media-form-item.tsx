import { useCallback } from "react"
import { UseFormReturn } from "react-hook-form"
import { z } from "@medusajs/framework/zod"
import { MediaSchema } from "../routes/gift-cards/gift-card-products/components/gift-card-product-create-form/schema"
import {
  EditProductMediaSchemaType,
  ProductCreateSchemaType,
} from "../routes/gift-cards/gift-card-products/components/gift-card-product-create-form/types"
import { FileType, FileUpload } from "./file-upload"
import { Form } from "./form"

type Media = z.infer<typeof MediaSchema>

const SUPPORTED_FORMATS = [
  "image/jpeg",
  "image/png",
  "image/gif",
  "image/webp",
  "image/heic",
  "image/svg+xml",
]

const SUPPORTED_FORMATS_FILE_EXTENSIONS = [
  ".jpeg",
  ".png",
  ".gif",
  ".webp",
  ".heic",
  ".svg",
]

export const UploadMediaFormItem = ({
  form,
  append,
  showHint = true,
}: {
  form:
    | UseFormReturn<ProductCreateSchemaType>
    | UseFormReturn<EditProductMediaSchemaType>
  append: (value: Media) => void
  showHint?: boolean
}) => {
  const hasInvalidFiles = useCallback(
    (fileList: FileType[]) => {
      const invalidFile = fileList.find(
        (f) => !SUPPORTED_FORMATS.includes(f.file.type)
      )

      if (invalidFile) {
        form.setError("media", {
          type: "invalid_file",
          message: `"'${
            invalidFile.file.name
          }' is not a supported file type. Supported file types are: ${SUPPORTED_FORMATS_FILE_EXTENSIONS.join(
            ", "
          )}.",`,
        })

        return true
      }

      return false
    },
    [form]
  )

  const onUploaded = useCallback(
    (files: FileType[]) => {
      form.clearErrors("media")
      if (hasInvalidFiles(files)) {
        return
      }

      files.forEach((f) => append({ ...f, isThumbnail: false }))
    },
    [form, append, hasInvalidFiles]
  )

  return (
    <Form.Field
      control={
        form.control as UseFormReturn<EditProductMediaSchemaType>["control"]
      }
      name="media"
      render={() => {
        return (
          <Form.Item>
            <div className="flex flex-col gap-y-2">
              <div className="flex flex-col gap-y-1">
                <Form.Label optional>Media</Form.Label>
                {showHint && (
                  <Form.Hint>Upload images for the gift card product</Form.Hint>
                )}
              </div>
              <Form.Control>
                <FileUpload
                  label="Upload images"
                  hint="Upload images for the gift card product"
                  hasError={!!form.formState.errors.media}
                  formats={SUPPORTED_FORMATS}
                  onUploaded={onUploaded}
                />
              </Form.Control>
              <Form.ErrorMessage />
            </div>
          </Form.Item>
        )
      }}
    />
  )
}
