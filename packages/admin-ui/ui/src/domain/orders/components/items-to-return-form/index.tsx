import { Order } from "@medusajs/medusa"
import {
  getCoreRowModel,
  getExpandedRowModel,
  useReactTable,
} from "@tanstack/react-table"
import { FieldArrayWithId, useFieldArray } from "react-hook-form"
import { useTranslation } from "react-i18next"
import InputError from "../../../../components/atoms/input-error"
import { FormImage, Option } from "../../../../types/shared"
import { NestedForm } from "../../../../utils/nested-form"
import { ItemsToReturnTable } from "./items-to-return-table"
import { useItemsToReturnColumns } from "./use-return-item-columns"

export type ReturnReasonDetails = {
  note?: string
  reason?: Option
  images?: FormImage[]
}

export type ReturnItem = {
  item_id: string
  thumbnail?: string | null
  product_title: string
  variant_title: string
  sku?: string | null
  quantity: number
  original_quantity: number
  total: number
  refundable?: number | null
  return_reason_details: ReturnReasonDetails
  return: boolean
}

export type ItemsToReturnFormType = {
  items: ReturnItem[]
}

export type ReturnItemObject = FieldArrayWithId<
  {
    __nested__: ItemsToReturnFormType
  },
  "__nested__.items",
  "fieldId"
>

type Props = {
  form: NestedForm<ItemsToReturnFormType>
  order: Order
  isClaim?: boolean
}

const ItemsToReturnForm = ({ form, order, isClaim = false }: Props) => {
  const { t } = useTranslation()
  const {
    control,
    path,
    formState: { errors },
  } = form

  const { fields } = useFieldArray({
    control,
    name: path("items"),
    keyName: "fieldId",
    shouldUnregister: true,
  })

  const columns = useItemsToReturnColumns({
    form,
    orderCurrency: order.currency_code,
  })

  const table = useReactTable({
    data: fields,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getExpandedRowModel: getExpandedRowModel(),
  })

  return (
    <div className="gap-y-base flex flex-col">
      <h2 className="inter-base-semibold">
        {isClaim
          ? t("items-to-return-form-items-to-claim", "Items to claim")
          : t("items-to-return-form-items-to-return", "Items to return")}
      </h2>
      <ItemsToReturnTable form={form} instance={table} isClaim={isClaim} />
      <InputError errors={errors} name={path("items")} />
    </div>
  )
}

export default ItemsToReturnForm
