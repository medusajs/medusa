import { XMark } from "@medusajs/icons"
import { IconButton } from "@medusajs/ui"
import { useCallback } from "react"
import { UseFormReturn } from "react-hook-form"
import { useTranslation } from "react-i18next"

import {
  FileType,
  FileUpload,
  RejectedFile,
} from "../../../../../components/common/file-upload"
import { Form } from "../../../../../components/common/form"
import { formatFileSize } from "../../../../../lib/format-file-size"
import { EditStoreSchemaType } from "./schema"

const SUPPORTED_LOGO_FORMATS = [
  "image/jpeg",
  "image/png",
  "image/gif",
  "image/webp",
  "image/svg+xml",
]

const SUPPORTED_LOGO_FILE_EXTENSIONS = [
  ".jpeg",
  ".png",
  ".gif",
  ".webp",
  ".svg",
]

type StoreLogoFieldProps = {
  form: UseFormReturn<EditStoreSchemaType>
}

export const StoreLogoField = ({ form }: StoreLogoFieldProps) => {
  const { t } = useTranslation()

  const onUploaded = useCallback(
    (files: FileType[] = [], rejectedFiles: RejectedFile[] = []) => {
      form.clearErrors("logo")

      // The file input only hints the accepted formats, and dropped files
      // bypass it, so the format is checked here as well.
      const rejected =
        rejectedFiles[0] ??
        files
          .filter((f) => !SUPPORTED_LOGO_FORMATS.includes(f.file.type))
          .map((f) => ({ file: f.file, reason: "format" as const }))[0]

      if (rejected) {
        form.setError("logo", {
          type: rejected.reason === "size" ? "file_too_large" : "invalid_file",
          message:
            rejected.reason === "size"
              ? t("store.logoFileTooLarge", {
                  name: rejected.file.name,
                  size: formatFileSize(__MAX_UPLOAD_FILE_SIZE__ ?? 1024 * 1024),
                })
              : t("store.logoInvalidFileType", {
                  name: rejected.file.name,
                  types: SUPPORTED_LOGO_FILE_EXTENSIONS.join(", "),
                }),
        })
        return
      }

      const [file] = files

      if (file) {
        form.setValue(
          "logo",
          { url: file.url, file: file.file },
          { shouldDirty: true }
        )
      }
    },
    [form, t]
  )

  return (
    <Form.Field
      control={form.control}
      name="logo"
      render={({ field }) => (
        <Form.Item>
          <div className="flex flex-col gap-y-1">
            <Form.Label optional>{t("store.logo")}</Form.Label>
            <Form.Hint>{t("store.logoHint")}</Form.Hint>
          </div>
          <Form.Control>
            {field.value ? (
              <div className="flex items-center gap-x-3">
                <div className="bg-ui-bg-subtle shadow-elevation-card-rest flex size-16 items-center justify-center overflow-hidden rounded-lg">
                  <img
                    src={field.value.url}
                    alt={t("store.logo")}
                    className="size-full object-contain"
                  />
                </div>
                <IconButton
                  type="button"
                  size="small"
                  variant="transparent"
                  aria-label={t("store.removeLogo")}
                  onClick={() =>
                    form.setValue("logo", null, { shouldDirty: true })
                  }
                >
                  <XMark />
                </IconButton>
              </div>
            ) : (
              <FileUpload
                label={t("store.uploadLogoLabel")}
                hint={t("store.uploadLogoHint")}
                multiple={false}
                hasError={!!form.formState.errors.logo}
                formats={SUPPORTED_LOGO_FORMATS}
                onUploaded={onUploaded}
              />
            )}
          </Form.Control>
          <Form.ErrorMessage />
        </Form.Item>
      )}
    />
  )
}
