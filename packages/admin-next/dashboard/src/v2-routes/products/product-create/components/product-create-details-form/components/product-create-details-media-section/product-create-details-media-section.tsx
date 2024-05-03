import { Heading } from "@medusajs/ui"
import { UseFormReturn } from "react-hook-form"
import { useTranslation } from "react-i18next"

import { FileUpload } from "../../../../../../../components/common/file-upload"
import { Form } from "../../../../../../../components/common/form"
import { ProductCreateSchemaType } from "../../../../types"

type ProductCreateMediaSectionProps = {
  form: UseFormReturn<ProductCreateSchemaType>
}

const SUPPORTED_FORMATS = [
  "image/jpeg",
  "image/png",
  "image/gif",
  "image/webp",
  "image/heic",
  "image/svg+xml",
]

export const ProductCreateMediaSection = ({
  form,
}: ProductCreateMediaSectionProps) => {
  const { t } = useTranslation()

  return (
    <div id="media" className="flex flex-col gap-y-8">
      <Heading level="h2">{t("products.media.label")}</Heading>
      <div className="grid grid-cols-1 gap-x-4 gap-y-8">
        <Form.Field
          control={form.control}
          name="images"
          render={() => {
            return (
              <Form.Item>
                <div className="flex flex-col gap-y-4">
                  <div className="flex flex-col gap-y-1">
                    <Form.Label optional>
                      {t("products.media.label")}
                    </Form.Label>
                    <Form.Hint>{t("products.media.editHint")}</Form.Hint>
                  </div>
                  <Form.Control>
                    <FileUpload
                      label={t("products.media.uploadImagesLabel")}
                      hint={t("products.media.uploadImagesHint")}
                      hasError={!!form.formState.errors.images}
                      formats={SUPPORTED_FORMATS}
                      onUploaded={(files) => {
                        form.clearErrors("images")
                        // if (hasInvalidFiles(files)) {
                        //   return
                        // }

                        // files.forEach((f) => append(f))
                      }}
                    />
                  </Form.Control>
                  <Form.ErrorMessage />
                </div>
              </Form.Item>
            )
          }}
        />
      </div>
    </div>
  )
}
