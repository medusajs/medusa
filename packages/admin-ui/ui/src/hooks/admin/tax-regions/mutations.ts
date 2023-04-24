import { useMutation, useQueryClient } from "react-query"
import medusaRequest from "../../../services/request"
import { buildOptions } from "../../utils/buildOptions"
import { configuredTaxRegionsKeys } from "./queries"

export interface AdminCreateConfiguredTaxRegion {
  tax_region_id: string
  registered_tax_id?: string
  enabled: boolean
}

export interface AdminUpdateConfiguredTaxRegion {
  registered_tax_id?: string
}

export const useAdminCreateConfiguredTaxRegion = () => {
  const path = `/admin/configured-tax-regions`
  const queryClient = useQueryClient()

  return useMutation(
    (payload: AdminCreateConfiguredTaxRegion) =>
      medusaRequest<AdminCreateConfiguredTaxRegion>("POST", path, payload),
    buildOptions(queryClient, [configuredTaxRegionsKeys.list()])
  )
}

export const useAdminUpdateConfiguredTaxRegion = (id: string) => {
  const path = `/admin/configured-tax-regions/${id}`
  const queryClient = useQueryClient()

  return useMutation(
    (payload: AdminUpdateConfiguredTaxRegion) =>
      medusaRequest<AdminUpdateConfiguredTaxRegion>("PUT", path, payload),
    buildOptions(queryClient, [configuredTaxRegionsKeys.list()])
  )
}
