import { CommandBar, Heading } from "@medusajs/ui"
import { UseFormReturn, useFieldArray } from "react-hook-form"
import { useTranslation } from "react-i18next"
import { ProductCreateSchemaType } from "../../../../types"
import { MediaGrid } from "../../../../../common/components/media-grid-view"
import { useCallback, useState } from "react"
import { UploadMediaFormItem } from "../../../../../common/components/upload-media-form-item"

type ProductCreateMediaSectionProps = {
  form: UseFormReturn<ProductCreateSchemaType>
}

export const ProductCreateMediaSection = ({
  form,
}: ProductCreateMediaSectionProps) => {
  const { t } = useTranslation()
  const [selection, setSelection] = useState<Record<string, true>>({})
  const selectionCount = Object.keys(selection).length

  const { fields, append, remove } = useFieldArray({
    name: "media",
    control: form.control,
    keyName: "field_id",
  })

  const handleDelete = () => {
    const ids = Object.keys(selection)
    const indices = ids.map((id) => fields.findIndex((m) => m.id === id))

    remove(indices)
    setSelection({})
  }

  const handleCheckedChange = useCallback(
    (id: string) => {
      return (val: boolean) => {
        if (!val) {
          const { [id]: _, ...rest } = selection
          setSelection(rest)
        } else {
          setSelection((prev) => ({ ...prev, [id]: true }))
        }
      }
    },
    [selection]
  )

  return (
    <div id="media" className="flex flex-col gap-y-8">
      <Heading level="h2">{t("products.media.label")}</Heading>
      <div className="grid grid-cols-1 gap-x-4 gap-y-8">
        <UploadMediaFormItem form={form} append={append} />
      </div>
      {fields?.length ? (
        <MediaGrid
          media={fields}
          selection={selection}
          onCheckedChange={handleCheckedChange}
        />
      ) : null}

      <CommandBar open={!!selectionCount}>
        <CommandBar.Bar>
          <CommandBar.Value>
            {t("general.countSelected", {
              count: selectionCount,
            })}
          </CommandBar.Value>
          <CommandBar.Seperator />

          <CommandBar.Command
            action={handleDelete}
            label={t("actions.delete")}
            shortcut="d"
          />
        </CommandBar.Bar>
      </CommandBar>
    </div>
  )
}
