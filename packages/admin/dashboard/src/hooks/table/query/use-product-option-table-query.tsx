import { HttpTypes } from "@medusajs/types"
import { useQueryParams } from "../../use-query-params"

type UseProductOptionTableQueryProps = {
  prefix?: string
  pageSize?: number
}

export const useProductOptionTableQuery = ({
  prefix,
  pageSize = 20,
}: UseProductOptionTableQueryProps) => {
  const queryObject = useQueryParams(
    ["offset", "q", "order", "created_at", "updated_at", "is_exclusive"],
    prefix
  )

  const { offset, created_at, updated_at, q, order, is_exclusive } = queryObject

  const searchParams: HttpTypes.AdminProductOptionListParams = {
    limit: pageSize,
    offset: offset ? Number(offset) : 0,
    order,
    created_at: created_at ? JSON.parse(created_at) : undefined,
    updated_at: updated_at ? JSON.parse(updated_at) : undefined,
    is_exclusive: parseIsExclusive(is_exclusive),
    // ^ undefined when the user explicitly removed the chip, so all options
    // are returned regardless of type. The list seeds a default on first load.
    q,
  }

  return {
    searchParams,
    raw: queryObject,
  }
}

// Tolerate both the quoted form produced by the DataTable filter UI
// (`"false"`) and the plain form a human might write when sharing/bookmarking
// a URL (`false`). Returns undefined when the filter is absent so the user
// can clear the chip to see all options regardless of type.
const parseIsExclusive = (raw: string | undefined): boolean | undefined => {
  if (raw === undefined) {
    return undefined
  }
  try {
    const parsed = JSON.parse(raw)
    if (typeof parsed === "boolean") {
      return parsed
    }
    if (typeof parsed === "string") {
      return parsed === "true"
    }
    return undefined
  } catch {
    return raw === "true"
  }
}
