import { AdminGetDraftOrdersParams } from "@medusajs/medusa"
import { useQueryParams } from "../../../../../hooks/use-query-params"

export const useDraftOrderTableQuery = ({
  pageSize = 20,
  prefix,
}: {
  pageSize?: number
  prefix?: string
}) => {
  const raw = useQueryParams(
    ["offset", "q", "order", "status", "created_at", "updated_at"],
    prefix
  )

  const { status, offset, created_at, updated_at, ...rest } = raw

  const searchParams: AdminGetDraftOrdersParams = {
    limit: pageSize,
    offset: offset ? Number(offset) : 0,
    status: status ? (status.split(",") as ["open" | "completed"]) : undefined,
    created_at: created_at ? JSON.parse(created_at) : undefined,
    updated_at: updated_at ? JSON.parse(updated_at) : undefined,
    ...rest,
  }

  return {
    searchParams,
    raw,
  }
}
