import { Order } from "@medusajs/medusa"
import { getCoreRowModel, useReactTable } from "@tanstack/react-table"
import clsx from "clsx"
import { FieldArrayWithId, useFieldArray } from "react-hook-form"
import { useTranslation } from "react-i18next"
import Button from "../../../../components/fundamentals/button"
import { NestedForm } from "../../../../utils/nested-form"
import { useAddAdditionalItemsScreen } from "./add-additional-items-screen"
import { AdditionalItemsTable } from "./additional-items-table"
import { useAdditionalItemsColumns } from "./use-additional-items-columns"

export type AdditionalItem = {
  variant_id: string
  thumbnail?: string | null
  product_title: string
  sku?: string
  variant_title: string
  quantity: number
  in_stock: number
  price: number
  original_price: number
}

export type ItemsToSendFormType = {
  items: AdditionalItem[]
}

export type AdditionalItemObject = FieldArrayWithId<
  {
    __nested__: ItemsToSendFormType
  },
  "__nested__.items",
  "fieldId"
>

type Props = {
  form: NestedForm<ItemsToSendFormType>
  order: Order
}

const ItemsToSendForm = ({ form, order }: Props) => {
  const { t } = useTranslation()
  const { control, path } = form

  const { fields, append, remove } = useFieldArray({
    control,
    name: path("items"),
    keyName: "fieldId",
  })

  const columns = useAdditionalItemsColumns({
    orderCurrency: order.currency_code,
    form,
    removeItem: remove,
  })

  const tableInstance = useReactTable<AdditionalItemObject>({
    data: fields,
    columns,
    getCoreRowModel: getCoreRowModel(),
  })

  const { pushScreen } = useAddAdditionalItemsScreen()

  return (
    <div
      className={clsx({
        "gap-y-base flex flex-col": fields.length > 0,
        "flex items-center justify-between": !fields.length,
      })}
    >
      <div className="flex w-full items-center">
        <h2 className="inter-base-semibold">
          {t("items-to-send-form-items-to-send", "Items to send")}
        </h2>
      </div>
      {fields.length > 0 && <AdditionalItemsTable instance={tableInstance} />}

      <div className="flex w-full items-center justify-end">
        <Button
          variant="secondary"
          size="small"
          type="button"
          onClick={() =>
            pushScreen({
              append,
              remove,
              selectedIds: fields.map((f) => f.variant_id),
              order,
            })
          }
        >
          {t("items-to-send-form-add-products", "Add products")}
        </Button>
      </div>
    </div>
  )
}

export default ItemsToSendForm
