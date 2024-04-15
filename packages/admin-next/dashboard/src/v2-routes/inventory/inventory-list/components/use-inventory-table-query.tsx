import { AdminGetInventoryItemsParams } from "@medusajs/medusa"
import { useQueryParams } from "../../../../hooks/use-query-params"

export const useInventoryTableQuery = ({
  pageSize = 20,
  prefix,
}: {
  pageSize?: number
  prefix?: string
}) => {
  const raw = useQueryParams(
    [
      "location_id",
      "q",
      "order",
      "requires_shipping",
      "offset",
      "sku",
      "material",
      "mid_code",
      "order",
      "weight",
      "width",
      "length",
      "height",
    ],
    prefix
  )

  const {
    offset,
    weight,
    width,
    length,
    height,
    requires_shipping,
    ...params
  } = raw

  const searchParams: AdminGetInventoryItemsParams = {
    limit: pageSize,
    offset: offset ? parseInt(offset) : undefined,
    weight: weight ? JSON.parse(weight) : undefined,
    width: width ? JSON.parse(width) : undefined,
    length: length ? JSON.parse(length) : undefined,
    height: height ? JSON.parse(height) : undefined,
    requires_shipping: requires_shipping
      ? JSON.parse(requires_shipping)
      : undefined,
    ...params,
  }

  return {
    searchParams,
    raw,
  }
}
