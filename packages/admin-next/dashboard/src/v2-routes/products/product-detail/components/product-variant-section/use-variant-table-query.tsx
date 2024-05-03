import { AdminGetProductsVariantsParams } from "@medusajs/medusa"
import { useQueryParams } from "../../../../../hooks/use-query-params"

export const useProductVariantTableQuery = ({
  pageSize,
  prefix,
}: {
  pageSize: number
  prefix?: string
}) => {
  const queryObject = useQueryParams(
    [
      "offset",
      "q",
      "manage_inventory",
      "allow_backorder",
      "order",
      "created_at",
      "updated_at",
    ],
    prefix
  )

  const {
    offset,
    manage_inventory,
    allow_backorder,
    created_at,
    updated_at,
    q,
    order,
  } = queryObject

  const searchParams: AdminGetProductsVariantsParams = {
    limit: pageSize,
    offset: offset ? Number(offset) : 0,
    manage_inventory: manage_inventory
      ? manage_inventory === "true"
      : undefined,
    allow_backorder: allow_backorder ? allow_backorder === "true" : undefined,
    order,
    created_at: created_at ? JSON.parse(created_at) : undefined,
    updated_at: updated_at ? JSON.parse(updated_at) : undefined,
    q,
  }

  return {
    searchParams,
    raw: queryObject,
  }
}
