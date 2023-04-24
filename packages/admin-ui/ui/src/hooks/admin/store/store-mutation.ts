import { AxiosError, AxiosResponse } from "axios"
import { useMutation } from "react-query"
import medusaRequest from "../../../services/request"

export const useAdminUpdateStoreFees = () => {
  const path = `/admin/store-vendor-fees`

  return useMutation<
    AxiosResponse<{
      default_store_percent_fee: number
      vendors: { vendor_id: string; percent_fee: number }[]
    }>,
    AxiosError,
    any
  >((payload) => medusaRequest("PUT", path, payload))
}
