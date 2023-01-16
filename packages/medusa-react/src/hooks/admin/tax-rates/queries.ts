import {
  AdminGetTaxRatesParams,
  AdminTaxRatesListRes,
  AdminTaxRatesRes,
} from "@medusajs/medusa"
import { Response } from "@medusajs/medusa-js"
import { useQuery } from "@tanstack/react-query"
import { useMedusa } from "../../../contexts"
import { UseQueryOptionsWrapper } from "../../../types"
import { queryKeysFactory } from "../../utils/index"

const ADMIN_TAX_RATES_QUERY_KEY = `admin_tax_rates` as const

export const adminTaxRateKeys = queryKeysFactory(ADMIN_TAX_RATES_QUERY_KEY)

type TaxRateQueryKeys = typeof adminTaxRateKeys

export const useAdminTaxRates = (
  query?: AdminGetTaxRatesParams,
  options?: UseQueryOptionsWrapper<
    Response<AdminTaxRatesListRes>,
    Error,
    ReturnType<TaxRateQueryKeys["list"]>
  >
) => {
  const { client } = useMedusa()
  const { data, ...rest } = useQuery(
    adminTaxRateKeys.list(query),
    () => client.admin.taxRates.list(query),
    options
  )
  return { ...data, ...rest } as const
}

export const useAdminTaxRate = (
  id: string,
  query?: AdminGetTaxRatesParams,
  options?: UseQueryOptionsWrapper<
    Response<AdminTaxRatesRes>,
    Error,
    ReturnType<TaxRateQueryKeys["detail"]>
  >
) => {
  const { client } = useMedusa()
  const { data, ...rest } = useQuery(
    adminTaxRateKeys.detail(id),
    () => client.admin.taxRates.retrieve(id, query),
    options
  )
  return { ...data, ...rest } as const
}
