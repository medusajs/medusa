import { Order } from "@medusajs/medusa"
import { getCoreRowModel, useReactTable } from "@tanstack/react-table"
import { FieldArrayWithId, useFieldArray } from "react-hook-form"
import { useTranslation } from "react-i18next"
import InputError from "../../../../components/atoms/input-error"
import { NestedForm } from "../../../../utils/nested-form"
import { ItemsToReceiveTable } from "./items-to-receive-table"
import { useItemsToReceiveColumns } from "./use-items-to-receive-columns"

export type ReceiveReturnItem = {
  item_id: string
  thumbnail?: string | null
  product_title: string
  variant_title: string
  sku?: string | null
  quantity: number
  original_quantity: number
  refundable?: number | null
  receive: boolean
  price: number
}

export type ItemsToReceiveFormType = {
  items: ReceiveReturnItem[]
}

export type ReceiveReturnObject = FieldArrayWithId<
  {
    __nested__: ItemsToReceiveFormType
  },
  "__nested__.items",
  "fieldId"
>

type Props = {
  form: NestedForm<ItemsToReceiveFormType>
  order: Order
}

export const ItemsToReceiveForm = ({ form, order }: Props) => {
  const {
    control,
    path,
    formState: { errors },
  } = form

  const { t } = useTranslation()
  const { fields } = useFieldArray({
    control,
    name: path("items"),
    keyName: "fieldId",
  })

  const columns = useItemsToReceiveColumns({
    form,
    orderCurrency: order.currency_code,
  })

  const tableInstance = useReactTable({
    data: fields,
    columns,
    getCoreRowModel: getCoreRowModel(),
  })

  return (
    <div className="gap-y-xsmall flex flex-col">
      <h2 className="inter-base-semibold">
        {t("items-to-receive-form-items-to-receive", "Items to receive")}
      </h2>

      <ItemsToReceiveTable instance={tableInstance} />
      <InputError errors={errors} name={path("items")} />
    </div>
  )
}
