import { StoreFees } from "@medusajs/medusa"
import { AxiosError, AxiosResponse } from "axios"
import { UseQueryOptionsWrapper } from "medusa-react/dist/types"
import { useQuery } from "react-query"
import medusaRequest from "../../../services/request"

export const useAdminStoreFees = (
  options?: UseQueryOptionsWrapper<
    AxiosResponse<{ store_fees: StoreFees }>,
    Error,
    ReturnType<any>
  >
) => {
  const path = `/admin/store-fees`

  const { data, refetch, ...rest } = useQuery(
    "storeFees",
    () => medusaRequest<{ store_fees: StoreFees }>("GET", path),
    options
  )
  return { ...data?.data, ...rest, refetch } as const
}
