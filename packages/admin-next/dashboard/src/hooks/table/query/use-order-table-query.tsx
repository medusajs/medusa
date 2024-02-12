import { AdminGetOrdersParams } from "@medusajs/medusa"
import { useQueryParams } from "../../use-query-params"

type UseOrderTableQueryProps = {
  prefix?: string
  pageSize?: number
}

export const useOrderTableQuery = ({
  prefix,
  pageSize = 20,
}: UseOrderTableQueryProps) => {
  const queryObject = useQueryParams(
    [
      "offset",
      "q",
      "created_at",
      "updated_at",
      "region_id",
      "sales_channel_id",
      "payment_status",
      "fulfillment_status",
      "order",
    ],
    prefix
  )

  const {
    offset,
    sales_channel_id,
    created_at,
    updated_at,
    fulfillment_status,
    payment_status,
    region_id,
    q,
  } = queryObject

  const searchParams: AdminGetOrdersParams = {
    limit: pageSize,
    offset: offset ? Number(offset) : 0,
    sales_channel_id: sales_channel_id?.split(","),
    fulfillment_status: fulfillment_status?.split(","),
    payment_status: payment_status?.split(","),
    created_at: created_at ? JSON.parse(created_at) : undefined,
    updated_at: updated_at ? JSON.parse(updated_at) : undefined,
    region_id: region_id?.split(","),
    q,
  }

  return {
    searchParams,
    raw: queryObject,
  }
}
