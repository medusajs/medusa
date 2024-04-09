import { useQueryParams } from "../../../../../hooks/use-query-params"

export const useLocationLevelTableQuery = ({
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
      "stocked_quantity",
      "reserved_quantity",
      "incoming_quantity",
      "available_quantity",
      "*stock_locations",
    ],
    prefix
  )

  const { reserved_quantity, stocked_quantity, available_quantity, ...params } =
    raw

  const searchParams = {
    limit: pageSize,
    reserved_quantity: reserved_quantity
      ? JSON.parse(reserved_quantity)
      : undefined,
    stocked_quantity: stocked_quantity
      ? JSON.parse(stocked_quantity)
      : undefined,
    available_quantity: available_quantity
      ? JSON.parse(available_quantity)
      : undefined,
    ...params,
  }

  return {
    searchParams,
    raw,
  }
}
