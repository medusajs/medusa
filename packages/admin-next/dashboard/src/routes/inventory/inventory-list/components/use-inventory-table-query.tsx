import { HttpTypes } from "@medusajs/types"

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
      "id",
      "location_id",
      "q",
      "order",
      "requires_shipping",
      "offset",
      "sku",
      "origin_country",
      "material",
      "mid_code",
      "hs_code",
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

  const searchParams: HttpTypes.AdminInventoryItemParams = {
    limit: pageSize,
    offset: offset ? parseInt(offset) : undefined,
    weight: weight ? JSON.parse(weight) : undefined,
    width: width ? JSON.parse(width) : undefined,
    length: length ? JSON.parse(length) : undefined,
    height: height ? JSON.parse(height) : undefined,
    requires_shipping: requires_shipping
      ? JSON.parse(requires_shipping)
      : undefined,
    q: params.q,
    sku: params.sku,
    order: params.order,
    mid_code: params.mid_code,
    hs_code: params.hs_code,
    material: params.material,
    location_levels: {
      location_id: params.location_id || [],
    },
    id: params.id ? params.id.split(",") : undefined,
  }

  return {
    searchParams,
    raw,
  }
}
