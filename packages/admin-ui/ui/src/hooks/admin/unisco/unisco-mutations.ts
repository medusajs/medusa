import { AxiosError, AxiosResponse } from "axios"
import { useMutation } from "react-query"
import medusaRequest from "../../../services/request"
import { UniscoConfig } from "./unisco-queries"

export interface UpdateUniscoConfig {
  username?: string
  password?: string
  unisco_base_url?: string
  unisco_company_id?: string
  unisco_customer_id?: string
  unisco_facility_id?: string
  automatically_fulfill_orders?: boolean
}

export type CreateUniscoConfig = Omit<UniscoConfig, "id">

export const useAdminUpdateUniscoConfig = () => {
  const path = `/admin/unisco/config`

  return useMutation<
    AxiosResponse<{ config: UniscoConfig }>,
    AxiosError,
    UpdateUniscoConfig
  >((payload) => medusaRequest("PUT", path, payload))
}

export const useAdminCreateUnicoConfig = () => {
  const path = `/admin/unisco/config`

  return useMutation<
    AxiosResponse<{ config: UniscoConfig }>,
    AxiosError,
    CreateUniscoConfig
  >((payload) => medusaRequest("POST", path, payload))
}
