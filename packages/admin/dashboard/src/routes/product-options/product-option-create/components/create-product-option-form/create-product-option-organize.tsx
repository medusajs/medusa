import { useEffect, useMemo } from "react"
import { UseFormReturn, useWatch } from "react-hook-form"
import { useTranslation } from "react-i18next"

import { Text } from "@medusajs/ui"
import { SortableList } from "../../../../../components/common/sortable-list"
import { CreateProductOptionSchema } from "./schema"

type CreateProductOptionOrganizeProps = {
  form: UseFormReturn<CreateProductOptionSchema>
}

type ValueItem = {
  id: string
  value: string
  rank: number
}

export const CreateProductOptionOrganize = ({
  form,
}: CreateProductOptionOrganizeProps) => {
  const { t } = useTranslation()

  const values = useWatch({
    control: form.control,
    name: "values",
  })

  const valueRanks = useWatch({
    control: form.control,
    name: "value_ranks",
  })

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

  useEffect(() => {
    handleChange(items)
  }, [items.length])

  if (!values?.length) {
    return null
  }

  return (
    <div className="px-16">
      <div className="mx-auto flex w-full max-w-[720px] flex-col gap-y-8 ">
        <div className="border-ui-border-base flex flex-col gap-y-2 overflow-hidden rounded-xl border">
          <div className="border-b-base bg-ui-bg-component border-b p-2">
            <Text size="small" leading="compact" weight="plus">
              {t("productOptions.create.tabs.organize")}
            </Text>
          </div>
          <SortableList
            items={items}
            onChange={handleChange}
            renderItem={(item) => (
              <SortableList.Item
                id={item.id}
                className="border-ui-border-base border-b last:border-b-0"
              >
                <div className="flex flex-1 items-center gap-x-3 px-4 py-3">
                  <SortableList.DragHandle />
                  <Text size="small">{item.value}</Text>
                </div>
              </SortableList.Item>
            )}
          />{" "}
        </div>
      </div>
    </div>
  )
}
