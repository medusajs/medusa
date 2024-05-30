import { AdminGetVariantsParams } from "@medusajs/medusa"

import { useQueryParams } from "../../../../../hooks/use-query-params"

export const useVariantTableQuery = ({
  pageSize = 50,
  prefix,
}: {
  pageSize?: number
  prefix: string
}) => {
  const raw = useQueryParams(
    ["offset", "q", "title", "customer_id", "inventory_quantity"],
    prefix
  )

  const searchParams: AdminGetVariantsParams = {
    limit: pageSize,
    offset: raw.offset ? Number(raw.offset) : 0,
    q: raw.q,
    title: raw.title,
    customer_id: raw.customer_id,
    inventory_quantity: raw.inventory_quantity
      ? Number(raw.inventory_quantity)
      : undefined,
  }

  return {
    searchParams,
    raw,
  }
}
