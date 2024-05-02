import { useEffect } from "react"
import { useTranslation } from "react-i18next"
import { Alert, Button, Input, Text } from "@medusajs/ui"
import { Trash } from "@medusajs/icons"
import { UseFormReturn } from "react-hook-form"

import { MetadataField } from "../../../lib/metadata"

type MetadataProps = {
  form: UseFormReturn<MetadataField[]>
}

type FieldProps = {
  field: MetadataField
  isLast: boolean
  onDelete: () => void
  updateKey: (key: string) => void
  updateValue: (value: string) => void
}

function Field({
  field,
  updateKey,
  updateValue,
  onDelete,
  isLast,
}: FieldProps) {
  const { t } = useTranslation()

  /**
   * value on the index of deleted field will be undefined,
   * but we need to keep it to preserve list ordering
   * so React could correctly render elements when adding/deleting
   */
  if (field.isDeleted || field.isIgnored) {
    return null
  }

  return (
    <tr className="group divide-x [&:not(:last-child)]:border-b">
      <td>
        <Input
          className="rounded-none border-none bg-transparent !shadow-none"
          placeholder={t("fields.key")}
          defaultValue={field.key}
          onChange={(e) => {
            updateKey(e.currentTarget.value)
          }}
        />
      </td>
      <td className="relative">
        <Input
          className="rounded-none border-none bg-transparent pr-[40px] !shadow-none"
          placeholder={t("fields.value")}
          defaultValue={field.value}
          onChange={(e) => {
            updateValue(e.currentTarget.value)
          }}
        />
        {!isLast && (
          <Button
            size="small"
            variant="transparent"
            className="text-ui-fg-subtle invisible absolute right-0 top-0 h-[32px] w-[32px] p-0 hover:bg-transparent group-hover:visible"
            type="button"
            onClick={onDelete}
          >
            <Trash />
          </Button>
        )}
      </td>
    </tr>
  )
}

export function Metadata({ form }: MetadataProps) {
  const { t } = useTranslation()

  const metadataWatch = form.watch("metadata") as MetadataField[]
  const ignoredKeys = metadataWatch.filter((k) => k.isIgnored)

  const addKeyPair = () => {
    form.setValue(
      `metadata.${metadataWatch.length ? metadataWatch.length : 0}`,
      { key: "", value: "" }
    )
  }

  const onKeyChange = (index: number) => {
    return (key: string) => {
      form.setValue(`metadata.${index}.key`, key, { shouldDirty: true })

      if (index === metadataWatch.length - 1) {
        addKeyPair()
      }
    }
  }

  const onValueChange = (index: number) => {
    return (value: any) => {
      form.setValue(`metadata.${index}.value`, value, { shouldDirty: true })

      if (index === metadataWatch.length - 1) {
        addKeyPair()
      }
    }
  }

  const deleteKeyPair = (index: number) => {
    return () => {
      form.setValue(`metadata.${index}.isDeleted`, true, { shouldDirty: true })
    }
  }

  return (
    <div>
      <Text weight="plus" size="small">
        {t("fields.metadata")}
      </Text>
      <table className="shadow-elevation-card-rest mt-2 w-full table-fixed overflow-hidden rounded">
        <thead>
          <tr className="bg-ui-bg-field divide-x border-b">
            <th>
              <Text className="px-2 py-1 text-left" weight="plus" size="small">
                {t("fields.key")}
              </Text>
            </th>
            <th>
              <Text className="px-2 py-1 text-left" weight="plus" size="small">
                {t("fields.value")}
              </Text>
            </th>
          </tr>
        </thead>
        <tbody>
          {metadataWatch.map((field, index) => {
            return (
              <Field
                key={index}
                field={field}
                updateKey={onKeyChange(index)}
                updateValue={onValueChange(index)}
                onDelete={deleteKeyPair(index)}
                isLast={index === metadataWatch.length - 1}
              />
            )
          })}
        </tbody>
      </table>
      {!!ignoredKeys.length && (
        <Alert variant="warning" className="mt-2" dismissible>
          {t("metadata.warnings.ignoredKeys", { keys: ignoredKeys.join(",") })}
        </Alert>
      )}
    </div>
  )
}
