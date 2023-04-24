import { ConfiguredTaxRegion, TaxRegion } from "@medusajs/medusa"
import { Response } from "@medusajs/medusa-js"
import { AxiosResponse } from "axios"
import { UseQueryOptionsWrapper } from "medusa-react/dist/types"
import { useQuery } from "react-query"
import medusaRequest from "../../../services/request"
import { queryKeysFactory } from "../../utils"

const TAX_REGIONS_QUERY_KEY = `tax-regions`
const CONFIGURED_TAX_REGIONS_QUERY_KEY = `configured-tax-regions`

export const taxRegionsKeys = queryKeysFactory(TAX_REGIONS_QUERY_KEY)
export const configuredTaxRegionsKeys = queryKeysFactory(
  CONFIGURED_TAX_REGIONS_QUERY_KEY
)

export const useAdminGetTaxRegions = (
  options?: UseQueryOptionsWrapper<
    AxiosResponse<{ tax_regions: TaxRegion[] }>,
    Error,
    ReturnType<any>
  >
) => {
  const path = "/admin/tax-regions"

  const { data, refetch, ...rest } = useQuery(
    taxRegionsKeys.list(),
    () => medusaRequest<Response<{ tax_regions: TaxRegion[] }>>("GET", path),
    options
  )

  return { ...data?.data, ...rest, refetch }
}

export const useAdminGetConfiguredTaxRegions = (
  options?: UseQueryOptionsWrapper<
    AxiosResponse<{ configured_tax_regions: ConfiguredTaxRegion[] }>,
    Error,
    ReturnType<any>
  >
) => {
  const path = "/admin/configured-tax-regions"

  const { data, refetch, ...rest } = useQuery(
    configuredTaxRegionsKeys.list(),
    () =>
      medusaRequest<
        Response<{ configured_tax_regions: ConfiguredTaxRegion[] }>
      >("GET", path),
    options
  )

  return { ...data?.data, ...rest, refetch }
}
