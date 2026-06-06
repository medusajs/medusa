import { FetchError } from "@zjedene-medusa/js-sdk"
import { HttpTypes } from "@zjedene-medusa/types"
import { QueryKey, UseQueryOptions, useQuery } from "@tanstack/react-query"

import { sdk } from "../../lib/queries/sdk"

const CUSTOMER_QUERY_KEY = "customers"

export const customersQueryKeys = {
  list: (query?: Record<string, any>) => [
    CUSTOMER_QUERY_KEY,
    query ? query : undefined,
  ],
  detail: (id: string, query?: Record<string, any>) => [
    CUSTOMER_QUERY_KEY,
    id,
    query ? query : undefined,
  ],
  addresses: (id: string, query?: Record<string, any>) => [
    CUSTOMER_QUERY_KEY,
    id,
    "addresses",
    query ? query : undefined,
  ],
  address: (id: string, addressId: string, query?: Record<string, any>) => [
    CUSTOMER_QUERY_KEY,
    id,
    "addresses",
    addressId,
    query ? query : undefined,
  ],
}

export const useCustomer = (
  id: string,
  query?: HttpTypes.SelectParams,
  options?: Omit<
    UseQueryOptions<
      HttpTypes.AdminCustomerResponse,
      FetchError,
      HttpTypes.AdminCustomerResponse,
      QueryKey
    >,
    "queryFn" | "queryKey"
  >
) => {
  const { data, ...rest } = useQuery({
    queryKey: customersQueryKeys.detail(id, query),
    queryFn: async () => sdk.admin.customer.retrieve(id, query),
    ...options,
  })

  return { ...data, ...rest }
}

export const useCustomers = (
  query?: HttpTypes.AdminCustomerFilters,
  options?: Omit<
    UseQueryOptions<
      HttpTypes.AdminCustomerListResponse,
      FetchError,
      HttpTypes.AdminCustomerListResponse,
      QueryKey
    >,
    "queryFn" | "queryKey"
  >
) => {
  const { data, ...rest } = useQuery({
    queryKey: customersQueryKeys.list(query),
    queryFn: async () => sdk.admin.customer.list(query),
    ...options,
  })

  return { ...data, ...rest }
}

export const useCustomerAddresses = (
  id: string,
  query?: HttpTypes.FindParams & HttpTypes.AdminCustomerAddressFilters,
  options?: Omit<
    UseQueryOptions<
      HttpTypes.AdminCustomerAddressListResponse,
      FetchError,
      HttpTypes.AdminCustomerAddressListResponse,
      QueryKey
    >,
    "queryFn" | "queryKey"
  >
) => {
  const { data, ...rest } = useQuery({
    queryKey: customersQueryKeys.addresses(id, query),
    queryFn: async () => {
      const response = await sdk.client.fetch(
        "/admin/customers/" + id + "/addresses",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        }
      )

      return response as HttpTypes.AdminCustomerAddressListResponse
    },
    ...options,
  })

  return { ...data, ...rest }
}

export const useCustomerAddress = (
  id: string,
  addressId: string,
  query?: HttpTypes.FindParams & HttpTypes.AdminCustomerAddressFilters,
  options?: Omit<
    UseQueryOptions<
      HttpTypes.AdminCustomerAddressResponse,
      FetchError,
      HttpTypes.AdminCustomerAddressResponse,
      QueryKey
    >,
    "queryFn" | "queryKey"
  >
) => {
  const { data, ...rest } = useQuery({
    queryKey: customersQueryKeys.address(id, addressId, query),
    queryFn: async () => {
      const response = await sdk.client.fetch(
        "/admin/customers/" + id + "/addresses/" + addressId
      )

      return response as HttpTypes.AdminCustomerAddressResponse
    },
    ...options,
  })

  return { ...data, ...rest }
}
