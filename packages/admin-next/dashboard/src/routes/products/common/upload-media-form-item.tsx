import { useTranslation } from "react-i18next"
import { FileType, FileUpload } from "../../../components/common/file-upload"
import { Form } from "../../../components/common/form"

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
  form: any
  append: any
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
      control={form.control}
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
