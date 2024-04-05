import { GetPublishableApiKeysParams } from "@medusajs/medusa"
import { useQueryParams } from "../../../../../hooks/use-query-params"

type UseApiKeyManagementTableQueryProps = {
  prefix?: string
  pageSize?: number
}

export const useApiKeyManagementTableQuery = ({
  prefix,
  pageSize = 20,
}: UseApiKeyManagementTableQueryProps) => {
  const queryObject = useQueryParams(
    ["offset", "q", "created_at", "updated_at", "revoked_at", "order"],
    prefix
  )

  const { offset, created_at, updated_at, revoked_at, q, order } = queryObject

  const searchParams: GetPublishableApiKeysParams = {
    limit: pageSize,
    offset: offset ? Number(offset) : 0,
    created_at: created_at ? JSON.parse(created_at) : undefined,
    updated_at: updated_at ? JSON.parse(updated_at) : undefined,
    revoked_at: revoked_at ? JSON.parse(revoked_at) : undefined,
    order,
    q,
  }

  return {
    searchParams,
    raw: queryObject,
  }
}
