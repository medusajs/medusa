import { useCallback } from "react"
import { UseFormReturn } from "react-hook-form"
import { useTranslation } from "react-i18next"
import { z } from "zod"
import {
  FileType,
  FileUpload,
  RejectedFile,
} from "../../../../../components/common/file-upload"
import { Form } from "../../../../../components/common/form"
import { formatFileSize } from "../../../../../lib/format-file-size"
import { MediaSchema } from "../../../product-create/constants"
import {
  EditProductMediaSchemaType,
  ProductCreateSchemaType,
} from "../../../product-create/types"

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
  const { t } = useTranslation()

  const hasInvalidFiles = useCallback(
    (fileList: FileType[] = [], rejectedFiles: RejectedFile[] = []) => {
      const invalidFile = fileList.find(
        (f) => !SUPPORTED_FORMATS.includes(f?.file?.type)
      )

      let hasInvalidFile = false;

      if (invalidFile) {
        form.setError("media", {
          type: "invalid_file",
          message: t("products.media.invalidFileType", {
            name: invalidFile.file.name,
            types: SUPPORTED_FORMATS_FILE_EXTENSIONS.join(", "),
          }),
        })

        hasInvalidFile = true;
      }

      const fileSizeRejections = rejectedFiles.filter((f) => f?.reason === "size")

      if (fileSizeRejections.length) {
        const fileNames = "\n" + fileSizeRejections.slice(0, 5).map((f) => f.file.name).join("\n")
        form.setError("media", {
          type: "file_too_large",
          message: t("products.media.fileTooLarge", {
            name: fileNames,
            size: formatFileSize(__MAX_UPLOAD_FILE_SIZE__ ?? 1024 * 1024),
          }),
        })

        hasInvalidFile = true;
      }

      return hasInvalidFile;
    },
    [form, t]
  )

  const onUploaded = useCallback(
    (files: FileType[] = [], rejectedFiles: RejectedFile[] = []) => {
      form.clearErrors("media")
      if (hasInvalidFiles(files, rejectedFiles)) {
        return
      }

      files?.forEach((f) => append({ ...f, isThumbnail: false }))
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
                <Form.Label optional>{t("products.media.label")}</Form.Label>
                {showHint && (
                  <Form.Hint>{t("products.media.editHint")}</Form.Hint>
                )}
              </div>
              <Form.Control>
                <FileUpload
                  label={t("products.media.uploadImagesLabel")}
                  hint={t("products.media.uploadImagesHint")}
                  hasError={!!form.formState.errors.media}
                  formats={SUPPORTED_FORMATS}
                  onUploaded={onUploaded}
                />
              </Form.Control>
              <Form.ErrorMessage className="whitespace-pre-line" />
            </div>
          </Form.Item>
        )
      }}
    />
  )
}
