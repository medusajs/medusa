import { useState } from "react"
import { FileType, FileUpload } from "../../../../components/common/file-upload"
import { Hint } from "@medusajs/ui"
import { useTranslation } from "react-i18next"

const SUPPORTED_FORMATS = [".csv"]

export const UploadImport = ({
  onUploaded,
}: {
  onUploaded: (file: File) => void
}) => {
  const { t } = useTranslation()
  const [error, setError] = useState<string>()

  const hasInvalidFiles = (fileList: FileType[]) => {
    const invalidFile = fileList.find(
      (f) => !SUPPORTED_FORMATS.some((ext) =>
        f.file.name.toLowerCase().endsWith(ext)
      )
    )

    if (invalidFile) {
      setError(
        t("products.media.invalidFileType", {
          name: invalidFile.file.name,
          types: SUPPORTED_FORMATS.join(", "),
        })
      )

      return true
    }

    return false
  }

  return (
    <div className="flex flex-col gap-y-4">
      <FileUpload
        label={t("products.import.uploadLabel")}
        hint={t("products.import.uploadHint")}
        multiple={false}
        hasError={!!error}
        formats={SUPPORTED_FORMATS}
        onUploaded={(files) => {
          setError(undefined)
          if (hasInvalidFiles(files)) {
            return
          }
          onUploaded(files[0].file)
        }}
        maxFileSize={Infinity}
      />

      {error && (
        <div>
          <Hint variant="error">{error}</Hint>
        </div>
      )}
    </div>
  )
}
