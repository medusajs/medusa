import { HttpTypes } from "@medusajs/types"
import { UIMatch } from "react-router-dom"

import { useInventoryItem } from "../../../hooks/api"
import { INVENTORY_DETAIL_FIELDS } from "./constants"

type InventoryDetailBreadcrumbProps =
  UIMatch<HttpTypes.AdminInventoryItemResponse>

export const InventoryDetailBreadcrumb = (
  props: InventoryDetailBreadcrumbProps
) => {
  const { id } = props.params || {}

  const { inventory_item } = useInventoryItem(
    id!,
    {
      fields: INVENTORY_DETAIL_FIELDS,
    },
    {
      initialData: props.data,
      enabled: Boolean(id),
    }
  )

  if (!inventory_item) {
    return null
  }

  return <span>{inventory_item.title ?? inventory_item.sku ?? id}</span>
}

export const seo = (match: UIMatch<HttpTypes.AdminInventoryItemResponse>) => {
  const item = match.data?.inventory_item

  return {
    title: item ? item.title ?? item.sku ?? match.params.id : undefined,
  }
}
