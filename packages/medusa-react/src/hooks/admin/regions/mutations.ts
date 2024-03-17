import {
  AdminPostRegionsRegionCountriesReq,
  AdminPostRegionsRegionFulfillmentProvidersReq,
  AdminPostRegionsRegionPaymentProvidersReq,
  AdminPostRegionsRegionReq,
  AdminPostRegionsReq,
  AdminRegionsDeleteRes,
  AdminRegionsRes,
} from "@medusajs/medusa"
import { Response } from "@medusajs/medusa-js"
import {
  useMutation,
  UseMutationOptions,
  useQueryClient,
} from "@tanstack/react-query"
import { useMedusa } from "../../../contexts/medusa"
import { buildOptions } from "../../utils/buildOptions"
import { adminRegionKeys } from "./queries"

/**
 * This hook creates a region.
 *
 * @example
 * import React from "react"
 * import { useAdminCreateRegion } from "medusa-react"
 *
 * type CreateData = {
 *   name: string
 *   currency_code: string
 *   tax_rate: number
 *   payment_providers: string[]
 *   fulfillment_providers: string[]
 *   countries: string[]
 * }
 *
 * const CreateRegion = () => {
 *   const createRegion = useAdminCreateRegion()
 *   // ...
 *
 *   const handleCreate = (regionData: CreateData) => {
 *     createRegion.mutate(regionData, {
 *       onSuccess: ({ region }) => {
 *         console.log(region.id)
 *       }
 *     })
 *   }
 *
 *   // ...
 * }
 *
 * export default CreateRegion
 *
 * @customNamespace Hooks.Admin.Regions
 * @category Mutations
 */
export const useAdminCreateRegion = (
  options?: UseMutationOptions<
    Response<AdminRegionsRes>,
    Error,
    AdminPostRegionsReq
  >
) => {
  const { client } = useMedusa()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: AdminPostRegionsReq) =>
      client.admin.regions.create(payload),
    ...buildOptions(queryClient, adminRegionKeys.lists(), options),
  })
}

/**
 * This hook updates a region's details.
 *
 * @example
 * import React from "react"
 * import { useAdminUpdateRegion } from "medusa-react"
 *
 * type Props = {
 *   regionId: string
 * }
 *
 * const Region = ({
 *   regionId
 * }: Props) => {
 *   const updateRegion = useAdminUpdateRegion(regionId)
 *   // ...
 *
 *   const handleUpdate = (
 *     countries: string[]
 *   ) => {
 *     updateRegion.mutate({
 *       countries,
 *     }, {
 *       onSuccess: ({ region }) => {
 *         console.log(region.id)
 *       }
 *     })
 *   }
 *
 *   // ...
 * }
 *
 * export default Region
 *
 * @customNamespace Hooks.Admin.Regions
 * @category Mutations
 */
export const useAdminUpdateRegion = (
  /**
   * The region's ID.
   */
  id: string,
  options?: UseMutationOptions<
    Response<AdminRegionsRes>,
    Error,
    AdminPostRegionsRegionReq
  >
) => {
  const { client } = useMedusa()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: AdminPostRegionsRegionReq) =>
      client.admin.regions.update(id, payload),
    ...buildOptions(
      queryClient,
      [adminRegionKeys.lists(), adminRegionKeys.detail(id)],
      options
    ),
  })
}

/**
 * This hook deletes a region. Associated resources, such as providers or currencies are not deleted. Associated tax rates are deleted.
 *
 * @example
 * import React from "react"
 * import { useAdminDeleteRegion } from "medusa-react"
 *
 * type Props = {
 *   regionId: string
 * }
 *
 * const Region = ({
 *   regionId
 * }: Props) => {
 *   const deleteRegion = useAdminDeleteRegion(regionId)
 *   // ...
 *
 *   const handleDelete = () => {
 *     deleteRegion.mutate(void 0, {
 *       onSuccess: ({ id, object, deleted }) => {
 *         console.log(id)
 *       }
 *     })
 *   }
 *
 *   // ...
 * }
 *
 * export default Region
 *
 * @customNamespace Hooks.Admin.Regions
 * @category Mutations
 */
export const useAdminDeleteRegion = (
  /**
   * The region's ID.
   */
  id: string,
  options?: UseMutationOptions<Response<AdminRegionsDeleteRes>, Error, void>
) => {
  const { client } = useMedusa()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: () => client.admin.regions.delete(id),
    ...buildOptions(
      queryClient,
      [adminRegionKeys.lists(), adminRegionKeys.detail(id)],
      options
    ),
  })
}

/**
 * This hook adds a country to the list of countries in a region.
 *
 * @example
 * import React from "react"
 * import { useAdminRegionAddCountry } from "medusa-react"
 *
 * type Props = {
 *   regionId: string
 * }
 *
 * const Region = ({
 *   regionId
 * }: Props) => {
 *   const addCountry = useAdminRegionAddCountry(regionId)
 *   // ...
 *
 *   const handleAddCountry = (
 *     countryCode: string
 *   ) => {
 *     addCountry.mutate({
 *       country_code: countryCode
 *     }, {
 *       onSuccess: ({ region }) => {
 *         console.log(region.countries)
 *       }
 *     })
 *   }
 *
 *   // ...
 * }
 *
 * export default Region
 *
 * @customNamespace Hooks.Admin.Regions
 * @category Mutations
 */
export const useAdminRegionAddCountry = (
  /**
   * The region's ID.
   */
  id: string,
  options?: UseMutationOptions<
    Response<AdminRegionsRes>,
    Error,
    AdminPostRegionsRegionCountriesReq
  >
) => {
  const { client } = useMedusa()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: AdminPostRegionsRegionCountriesReq) =>
      client.admin.regions.addCountry(id, payload),
    ...buildOptions(queryClient, adminRegionKeys.detail(id), options),
  })
}

/**
 * This hook deletes a country from the list of countries in a region. The country will still be available in the system, and it can be used in other regions.
 *
 * @typeParamDefinition string - The code of the country to delete from the region.
 *
 * @example
 * import React from "react"
 * import { useAdminRegionRemoveCountry } from "medusa-react"
 *
 * type Props = {
 *   regionId: string
 * }
 *
 * const Region = ({
 *   regionId
 * }: Props) => {
 *   const removeCountry = useAdminRegionRemoveCountry(regionId)
 *   // ...
 *
 *   const handleRemoveCountry = (
 *     countryCode: string
 *   ) => {
 *     removeCountry.mutate(countryCode, {
 *       onSuccess: ({ region }) => {
 *         console.log(region.countries)
 *       }
 *     })
 *   }
 *
 *   // ...
 * }
 *
 * export default Region
 *
 * @customNamespace Hooks.Admin.Regions
 * @category Mutations
 */
export const useAdminRegionRemoveCountry = (
  /**
   * The region's ID.
   */
  id: string,
  options?: UseMutationOptions<Response<AdminRegionsRes>, Error, string>
) => {
  const { client } = useMedusa()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (country_code: string) =>
      client.admin.regions.deleteCountry(id, country_code),
    ...buildOptions(queryClient, adminRegionKeys.detail(id), options),
  })
}

/**
 * This hook adds a fulfillment provider to the list of fulfullment providers in a region.
 *
 * @example
 * import React from "react"
 * import {
 *   useAdminRegionAddFulfillmentProvider
 * } from "medusa-react"
 *
 * type Props = {
 *   regionId: string
 * }
 *
 * const Region = ({
 *   regionId
 * }: Props) => {
 *   const addFulfillmentProvider =
 *     useAdminRegionAddFulfillmentProvider(regionId)
 *   // ...
 *
 *   const handleAddFulfillmentProvider = (
 *     providerId: string
 *   ) => {
 *     addFulfillmentProvider.mutate({
 *       provider_id: providerId
 *     }, {
 *       onSuccess: ({ region }) => {
 *         console.log(region.fulfillment_providers)
 *       }
 *     })
 *   }
 *
 *   // ...
 * }
 *
 * export default Region
 *
 * @customNamespace Hooks.Admin.Regions
 * @category Mutations
 */
export const useAdminRegionAddFulfillmentProvider = (
  /**
   * The region's ID.
   */
  id: string,
  options?: UseMutationOptions<
    Response<AdminRegionsRes>,
    Error,
    AdminPostRegionsRegionFulfillmentProvidersReq
  >
) => {
  const { client } = useMedusa()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: AdminPostRegionsRegionFulfillmentProvidersReq) =>
      client.admin.regions.addFulfillmentProvider(id, payload),
    ...buildOptions(queryClient, adminRegionKeys.detail(id), options),
  })
}

/**
 * This hook deletes a fulfillment provider from a region. The fulfillment provider will still be available for usage in other regions.
 *
 * @typeParamDefinition string - The fulfillment provider's ID to delete from the region.
 *
 * @example
 * import React from "react"
 * import {
 *   useAdminRegionDeleteFulfillmentProvider
 * } from "medusa-react"
 *
 * type Props = {
 *   regionId: string
 * }
 *
 * const Region = ({
 *   regionId
 * }: Props) => {
 *   const removeFulfillmentProvider =
 *     useAdminRegionDeleteFulfillmentProvider(regionId)
 *   // ...
 *
 *   const handleRemoveFulfillmentProvider = (
 *     providerId: string
 *   ) => {
 *     removeFulfillmentProvider.mutate(providerId, {
 *       onSuccess: ({ region }) => {
 *         console.log(region.fulfillment_providers)
 *       }
 *     })
 *   }
 *
 *   // ...
 * }
 *
 * export default Region
 *
 * @customNamespace Hooks.Admin.Regions
 * @category Mutations
 */
export const useAdminRegionDeleteFulfillmentProvider = (
  /**
   * The region's ID.
   */
  id: string,
  options?: UseMutationOptions<Response<AdminRegionsRes>, Error, string>
) => {
  const { client } = useMedusa()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (provider_id: string) =>
      client.admin.regions.deleteFulfillmentProvider(id, provider_id),
    ...buildOptions(queryClient, adminRegionKeys.detail(id), options),
  })
}

/**
 * This hook adds a payment provider to the list of payment providers in a region.
 *
 * @example
 * import React from "react"
 * import {
 *   useAdminRegionAddPaymentProvider
 * } from "medusa-react"
 *
 * type Props = {
 *   regionId: string
 * }
 *
 * const Region = ({
 *   regionId
 * }: Props) => {
 *   const addPaymentProvider =
 *     useAdminRegionAddPaymentProvider(regionId)
 *   // ...
 *
 *   const handleAddPaymentProvider = (
 *     providerId: string
 *   ) => {
 *     addPaymentProvider.mutate({
 *       provider_id: providerId
 *     }, {
 *       onSuccess: ({ region }) => {
 *         console.log(region.payment_providers)
 *       }
 *     })
 *   }
 *
 *   // ...
 * }
 *
 * export default Region
 *
 * @customNamespace Hooks.Admin.Regions
 * @category Mutations
 */
export const useAdminRegionAddPaymentProvider = (
  /**
   * The region's ID.
   */
  id: string,
  options?: UseMutationOptions<
    Response<AdminRegionsRes>,
    Error,
    AdminPostRegionsRegionPaymentProvidersReq
  >
) => {
  const { client } = useMedusa()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: AdminPostRegionsRegionPaymentProvidersReq) =>
      client.admin.regions.addPaymentProvider(id, payload),
    ...buildOptions(queryClient, adminRegionKeys.detail(id), options),
  })
}

/**
 * This hook deletes a payment provider from a region. The payment provider will still be available for usage in other regions.
 *
 * @typeParamDefinition string - The ID of the payment provider to delete from the region.
 *
 * @example
 * import React from "react"
 * import {
 *   useAdminRegionDeletePaymentProvider
 * } from "medusa-react"
 *
 * type Props = {
 *   regionId: string
 * }
 *
 * const Region = ({
 *   regionId
 * }: Props) => {
 *   const removePaymentProvider =
 *     useAdminRegionDeletePaymentProvider(regionId)
 *   // ...
 *
 *   const handleRemovePaymentProvider = (
 *     providerId: string
 *   ) => {
 *     removePaymentProvider.mutate(providerId, {
 *       onSuccess: ({ region }) => {
 *         console.log(region.payment_providers)
 *       }
 *     })
 *   }
 *
 *   // ...
 * }
 *
 * export default Region
 *
 * @customNamespace Hooks.Admin.Regions
 * @category Mutations
 */
export const useAdminRegionDeletePaymentProvider = (
  /**
   * The region's ID.
   */
  id: string,
  options?: UseMutationOptions<Response<AdminRegionsRes>, Error, string>
) => {
  const { client } = useMedusa()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (provider_id: string) =>
      client.admin.regions.deletePaymentProvider(id, provider_id),
    ...buildOptions(queryClient, adminRegionKeys.detail(id), options),
  })
}
