import {
  AdminPaymentProvidersList,
  AdminStoresRes,
  AdminTaxProvidersList,
} from "@medusajs/medusa"
import { Response } from "@medusajs/medusa-js"
import { useQuery } from "@tanstack/react-query"
import { useMedusa } from "../../../contexts"
import { UseQueryOptionsWrapper } from "../../../types"
import { queryKeysFactory } from "../../utils/index"

const ADMIN_STORE_QUERY_KEY = `admin_store` as const

export const adminStoreKeys = queryKeysFactory(ADMIN_STORE_QUERY_KEY)

type StoreQueryKeys = typeof adminStoreKeys

export const useAdminStorePaymentProviders = (
  options?: UseQueryOptionsWrapper<
    Response<AdminPaymentProvidersList>,
    Error,
    ReturnType<StoreQueryKeys["detail"]>
  >
) => {
  const { client } = useMedusa()
  const { data, ...rest } = useQuery(
    adminStoreKeys.detail("payment_providers"),
    () => client.admin.store.listPaymentProviders(),
    options
  )
  return { ...data, ...rest } as const
}

export const useAdminStoreTaxProviders = (
  options?: UseQueryOptionsWrapper<
    Response<AdminTaxProvidersList>,
    Error,
    ReturnType<StoreQueryKeys["detail"]>
  >
) => {
  const { client } = useMedusa()
  const { data, ...rest } = useQuery(
    adminStoreKeys.detail("tax_providers"),
    () => client.admin.store.listTaxProviders(),
    options
  )
  return { ...data, ...rest } as const
}

export const useAdminStore = (
  options?: UseQueryOptionsWrapper<
    Response<AdminStoresRes>,
    Error,
    ReturnType<StoreQueryKeys["details"]>
  >
) => {
  const { client } = useMedusa()
  const { data, ...rest } = useQuery(
    adminStoreKeys.details(),
    () => client.admin.store.retrieve(),
    options
  )
  return { ...data, ...rest } as const
}
