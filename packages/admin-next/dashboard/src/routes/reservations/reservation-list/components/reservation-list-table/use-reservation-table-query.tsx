import { AdminGetReservationsParams } from "@medusajs/medusa"
import { useQueryParams } from "../../../../../hooks/use-query-params"

export const useReservationTableQuery = ({
  pageSize = 20,
  prefix,
}: {
  pageSize?: number
  prefix?: string
}) => {
  const raw = useQueryParams(["location_id", "offset", "created_at"], prefix)

  const { location_id, created_at, offset } = raw

  const searchParams: AdminGetReservationsParams = {
    limit: pageSize,
    offset: offset ? parseInt(offset) : undefined,
    location_id: location_id,
    created_at: created_at ? JSON.parse(created_at) : undefined,
  }

  return {
    searchParams,
    raw,
  }
}
