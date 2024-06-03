import { useTranslation } from "react-i18next"
import { Form } from "../../../../../components/common/form"
import {
  FileType,
  FileUpload,
} from "../../../../../components/common/file-upload"
import { UseFormReturn } from "react-hook-form"
import {
  EditProductMediaSchemaType,
  ProductCreateSchemaType,
} from "../../../product-create/types"
import { MediaSchema } from "../../../product-create/constants"
import { z } from "zod"

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
}: {
  form:
    | UseFormReturn<ProductCreateSchemaType>
    | UseFormReturn<EditProductMediaSchemaType>
  append: (value: Media) => void
}) => {
  const { t } = useTranslation()

  const hasInvalidFiles = (fileList: FileType[]) => {
    const invalidFile = fileList.find(
      (f) => !SUPPORTED_FORMATS.includes(f.file.type)
    )

    if (invalidFile) {
      form.setError("media", {
        type: "invalid_file",
        message: t("products.media.invalidFileType", {
          name: invalidFile.file.name,
          types: SUPPORTED_FORMATS_FILE_EXTENSIONS.join(", "),
        }),
      })

      return true
    }

    return false
  }

  return (
    <Form.Field
      control={
        form.control as UseFormReturn<EditProductMediaSchemaType>["control"]
      }
      name="media"
      render={() => {
        return (
          <Form.Item>
            <div className="flex flex-col gap-y-4">
              <div className="flex flex-col gap-y-1">
                <Form.Label optional>{t("products.media.label")}</Form.Label>
                <Form.Hint>{t("products.media.editHint")}</Form.Hint>
              </div>
              <Form.Control>
                <FileUpload
                  label={t("products.media.uploadImagesLabel")}
                  hint={t("products.media.uploadImagesHint")}
                  hasError={!!form.formState.errors.media}
                  formats={SUPPORTED_FORMATS}
                  onUploaded={(files) => {
                    form.clearErrors("media")
                    if (hasInvalidFiles(files)) {
                      return
                    }

                    // TODO: For now all files that get uploaded are not thumbnails, revisit this logic
                    files.forEach((f) => append({ ...f, isThumbnail: false }))
                  }}
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
