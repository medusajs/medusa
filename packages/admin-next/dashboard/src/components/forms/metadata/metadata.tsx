import { useEffect, useState } from "react"
import { useTranslation } from "react-i18next"
import { Button, Input, Text } from "@medusajs/ui"
import { Trash } from "@medusajs/icons"

export type MetadataField = {
  key: string
  value: string
}

type MetadataProps = {
  initialMetadata?: MetadataField[]
  onMetadataChange: (metadata: MetadataField[]) => void
}

type FieldProps = {
  field: MetadataField | undefined
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
  if (!field) {
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

export function Metadata({
  initialMetadata = [],
  onMetadataChange,
}: MetadataProps) {
  const { t } = useTranslation()

  /**
   * Local data will keep undefined on deleted indexes -> this is need for React to properly render list elements since keys are index based
   */
  const [localData, setLocalData] =
    useState<(MetadataField | undefined)[]>(initialMetadata)

  const addKeyPair = () => {
    setLocalData([...localData, { key: ``, value: `` }])
  }

  const onKeyChange = (index: number) => {
    return (key: string) => {
      const newFields = localData
      newFields[index] = { key: key, value: newFields[index].value }
      setLocalData([...newFields])

      if (index === localData.length - 1) {
        addKeyPair()
      }
    }
  }

  const onValueChange = (index: number) => {
    return (value: any) => {
      const newFields = localData
      newFields[index] = {
        key: newFields[index].key,
        value: value,
      }
      setLocalData([...newFields])

      if (index === localData.length - 1) {
        addKeyPair()
      }
    }
  }

  const deleteKeyPair = (index: number) => {
    return () => {
      localData[index] = undefined
      setLocalData([...localData])
    }
  }

  useEffect(() => {
    const last = localData[localData.length - 1]
    if (last) {
      if (last.key === "" && last.value === "") {
        return
      }
    }

    addKeyPair()
  }, [])

  useEffect(() => {
    onMetadataChange(localData.slice(0, -1).filter(Boolean))
  }, [localData])

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
          {localData.map((field, index) => {
            return (
              <Field
                key={index}
                field={field}
                updateKey={onKeyChange(index)}
                updateValue={onValueChange(index)}
                onDelete={deleteKeyPair(index)}
                isLast={index === localData.length - 1}
              />
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
