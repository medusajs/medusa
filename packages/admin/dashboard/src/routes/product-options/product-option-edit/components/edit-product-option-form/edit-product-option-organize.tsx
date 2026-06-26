import { Text } from "@medusajs/ui"
import { useMemo } from "react"
import { UseFormReturn, useWatch } from "react-hook-form"
import { useTranslation } from "react-i18next"

import { SortableList } from "../../../../../components/common/sortable-list"
import { EditProductOptionSchema } from "./schema"
import { Form } from "../../../../../components/common/form"

type EditProductOptionOrganizeProps = {
  form: UseFormReturn<EditProductOptionSchema>
}

type ValueItem = {
  id: string
  value: string
  rank: number
}

export const EditProductOptionOrganize = ({
  form,
}: EditProductOptionOrganizeProps) => {
  const { t } = useTranslation()

  const values = useWatch({
    control: form.control,
    name: "values",
  })

  const valueRanks = useWatch({
    control: form.control,
    name: "value_ranks",
  })

  const items = useMemo<ValueItem[]>(() => {
    if (!values?.length) {
      return []
    }

    return values
      .map((value, index) => ({
        id: value,
        value,
        rank: valueRanks?.[value] ?? index,
      }))
      .sort((a, b) => a.rank - b.rank)
  }, [values, valueRanks])

  const handleChange = (newItems: ValueItem[]) => {
    const newRanks: Record<string, number> = {}
    newItems.forEach((item, index) => {
      newRanks[item.value] = index + 1
    })

    form.setValue("value_ranks", newRanks, {
      shouldDirty: true,
      shouldTouch: true,
    })
  }

  if (!values?.length) {
    return null
  }

  return (
    <div>
      <Form.Item>
        <Form.Label>{t("general.rank")}</Form.Label>
      </Form.Item>
      <SortableList
        items={items}
        onChange={handleChange}
        renderItem={(item) => (
          <SortableList.Item
            id={item.id}
            className="border-ui-border-base border-b last:border-b-0"
          >
            <div className="flex flex-1 items-center gap-x-3  py-3">
              <SortableList.DragHandle />
              <Text size="small">{item.value}</Text>
            </div>
          </SortableList.Item>
        )}
      />
    </div>
  )
}
