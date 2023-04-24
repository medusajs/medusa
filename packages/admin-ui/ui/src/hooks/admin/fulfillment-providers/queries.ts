import { useQuery } from "react-query"
import { Response } from "@medusajs/medusa-js"

import { AdminGetShippingOptionsParams } from "@medusajs/medusa/dist/api/routes/admin/shipping-options/list-shipping-options"
import { AxiosResponse } from "axios"
import { UseQueryOptionsWrapper } from "medusa-react/dist/types"
import medusaRequest from "../../../services/request"
import { queryKeysFactory } from "../../utils"

import { FulfillmentProvider } from "@medusajs/medusa/dist/models/fulfillment-provider"
import { PaymentProvider } from "@medusajs/medusa/dist/models/payment-provider"
import { FulfillmentOption } from "@medusajs/medusa"
import { PackageType } from "../packages"
import { useSelectedVendor } from "../../../context/vendor"

const MARKETPLACE_PROVIDERS_QUERY_KEY = `fulfillment_providers` as const

export const marketplaceProviderQueryKeys = queryKeysFactory(
  MARKETPLACE_PROVIDERS_QUERY_KEY
)

type MarketplaceProvidersQueryKeys = typeof marketplaceProviderQueryKeys

interface MarketplaceProvidersReturn {
  payment_providers: PaymentProvider[]
  fulfillment_providers: FulfillmentProvider[]
}

export interface ExtendedFulfillmentProvider extends FulfillmentProvider {
  configured: boolean
}

export const useGetVendorFulfillmentProviders = (
  vendorId: string,
  options?: UseQueryOptionsWrapper<
    AxiosResponse<{ providers: ExtendedFulfillmentProvider[] }>,
    Error,
    ReturnType<MarketplaceProvidersQueryKeys["list"]>
  >
) => {
  const path = `/admin/vendors/${vendorId}/fulfillment-providers`

  const { data, refetch, ...rest } = useQuery(
    marketplaceProviderQueryKeys.list(vendorId),
    () =>
      medusaRequest<Response<{ providers: ExtendedFulfillmentProvider[] }>>(
        "GET",
        path
      ),
    options
  )
  return {
    fulfillmentProviders: data?.data?.providers,
    ...rest,
    refetch,
  } as const
}

export const useGetStoreFulfillmentProviders = (
  options?: UseQueryOptionsWrapper<
    AxiosResponse<{ providers: ExtendedFulfillmentProvider[] }>,
    Error,
    ReturnType<MarketplaceProvidersQueryKeys["list"]>
  >
) => {
  const path = `/admin/fulfillment-providers`

  const { data, refetch, ...rest } = useQuery(
    marketplaceProviderQueryKeys.list(),
    () =>
      medusaRequest<Response<{ providers: ExtendedFulfillmentProvider[] }>>(
        "GET",
        path
      ),
    options
  )
  return {
    fulfillmentProviders: data?.data?.providers,
    ...rest,
    refetch,
  } as const
}

export const useGetVendorFulfillmentOptions = (
  { vendorId, regionId }: { vendorId: string; regionId: string },
  options?: UseQueryOptionsWrapper<
    AxiosResponse<{ options: FulfillmentOption[] }>,
    Error,
    ReturnType<MarketplaceProvidersQueryKeys["list"]>
  >
) => {
  const path = `/admin/vendors/${vendorId}/regions/${regionId}/fulfillment-options`

  const { data, refetch, ...rest } = useQuery(
    marketplaceProviderQueryKeys.list({ vendorId, regionId }),
    () =>
      medusaRequest<Response<{ options: FulfillmentOption[] }>>("GET", path),
    options
  )
  return { fulfillment_options: data?.data?.options, ...rest, refetch } as const
}

export const useGetStoreFulfillmentOptions = (
  { regionId }: { regionId: string },
  options?: UseQueryOptionsWrapper<
    AxiosResponse<{ options: FulfillmentOption[] }>,
    Error,
    ReturnType<MarketplaceProvidersQueryKeys["list"]>
  >
) => {
  const path = `/admin/store/regions/${regionId}/fulfillment-options`

  const { data, refetch, ...rest } = useQuery(
    marketplaceProviderQueryKeys.list({ regionId }),
    () =>
      medusaRequest<Response<{ options: FulfillmentOption[] }>>("GET", path),
    options
  )
  return { fulfillment_options: data?.data?.options, ...rest, refetch } as const
}

export const useGetFulfillmentOptions = ({
  regionId,
}: {
  regionId: string
}) => {
  const { isVendorView, selectedVendor } = useSelectedVendor()
  return isVendorView
    ? useGetVendorFulfillmentOptions({
        regionId,
        vendorId: selectedVendor?.id!,
      })
    : useGetStoreFulfillmentOptions({ regionId })
}

export const useGetMarketplaceProviders = (
  query?: AdminGetShippingOptionsParams,
  options?: UseQueryOptionsWrapper<
    AxiosResponse<MarketplaceProvidersReturn>,
    Error,
    ReturnType<MarketplaceProvidersQueryKeys["list"]>
  >
) => {
  const path = `/admin/marketplace/providers`

  const { data, refetch, ...rest } = useQuery(
    marketplaceProviderQueryKeys.list(query),
    () => medusaRequest<Response<MarketplaceProvidersReturn>>("GET", path),
    options
  )
  return { ...data, ...rest, refetch } as const
}

export declare class AdminGetCarrierPackageOptionsParams {
  carrier_id?: string
  package_type: string
}

export declare class PackageOptionsReturn {
  packagesByCarrier: { [key: string]: PackageOption[] }
}

export interface PackageOption {
  name: string
  package_type: PackageType
  package_code: string
  length?: number
  width?: number
  height?: number
  max_weight?: number
  service_codes: string[]
  girth_restriction?: number
  is_flat_rate: boolean
}

export const useGetCarrierPackageOptions = (
  query?: AdminGetCarrierPackageOptionsParams,
  options?: UseQueryOptionsWrapper<
    AxiosResponse<PackageOptionsReturn>,
    Error,
    ReturnType<MarketplaceProvidersQueryKeys["list"]>
  >
) => {
  const path = `/admin/shipengine/package-options`

  const { data, refetch, ...rest } = useQuery(
    marketplaceProviderQueryKeys.list(query),
    () => medusaRequest<Response<PackageOptionsReturn>>("GET", path),
    options
  )
  return { ...data, ...rest, refetch } as const
}
