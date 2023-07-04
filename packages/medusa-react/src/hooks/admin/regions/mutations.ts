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

export const useAdminCreateRegion = (
  options?: UseMutationOptions<
    Response<AdminRegionsRes>,
    Error,
    AdminPostRegionsReq
  >
) => {
  const { client } = useMedusa()
  const queryClient = useQueryClient()

  return useMutation(
    (payload: AdminPostRegionsReq) => client.admin.regions.create(payload),
    buildOptions(queryClient, adminRegionKeys.lists(), options)
  )
}

export const useAdminUpdateRegion = (
  id: string,
  options?: UseMutationOptions<
    Response<AdminRegionsRes>,
    Error,
    AdminPostRegionsRegionReq
  >
) => {
  const { client } = useMedusa()
  const queryClient = useQueryClient()

  return useMutation(
    (payload: AdminPostRegionsRegionReq) =>
      client.admin.regions.update(id, payload),
    buildOptions(
      queryClient,
      [adminRegionKeys.lists(), adminRegionKeys.detail(id)],
      options
    )
  )
}

export const useAdminDeleteRegion = (
  id: string,
  options?: UseMutationOptions<Response<AdminRegionsDeleteRes>, Error, void>
) => {
  const { client } = useMedusa()
  const queryClient = useQueryClient()

  return useMutation(
    () => client.admin.regions.delete(id),
    buildOptions(
      queryClient,
      [adminRegionKeys.lists(), adminRegionKeys.detail(id)],
      options
    )
  )
}

export const useAdminRegionAddCountry = (
  id: string,
  options?: UseMutationOptions<
    Response<AdminRegionsRes>,
    Error,
    AdminPostRegionsRegionCountriesReq
  >
) => {
  const { client } = useMedusa()
  const queryClient = useQueryClient()

  return useMutation(
    (payload: AdminPostRegionsRegionCountriesReq) =>
      client.admin.regions.addCountry(id, payload),
    buildOptions(queryClient, adminRegionKeys.detail(id), options)
  )
}

export const useAdminRegionRemoveCountry = (
  id: string,
  options?: UseMutationOptions<Response<AdminRegionsRes>, Error, string>
) => {
  const { client } = useMedusa()
  const queryClient = useQueryClient()

  return useMutation(
    (country_code: string) =>
      client.admin.regions.deleteCountry(id, country_code),
    buildOptions(queryClient, adminRegionKeys.detail(id), options)
  )
}

export const useAdminRegionAddFulfillmentProvider = (
  id: string,
  options?: UseMutationOptions<
    Response<AdminRegionsRes>,
    Error,
    AdminPostRegionsRegionFulfillmentProvidersReq
  >
) => {
  const { client } = useMedusa()
  const queryClient = useQueryClient()

  return useMutation(
    (payload: AdminPostRegionsRegionFulfillmentProvidersReq) =>
      client.admin.regions.addFulfillmentProvider(id, payload),
    buildOptions(queryClient, adminRegionKeys.detail(id), options)
  )
}

export const useAdminRegionDeleteFulfillmentProvider = (
  id: string,
  options?: UseMutationOptions<Response<AdminRegionsRes>, Error, string>
) => {
  const { client } = useMedusa()
  const queryClient = useQueryClient()

  return useMutation(
    (provider_id: string) =>
      client.admin.regions.deleteFulfillmentProvider(id, provider_id),
    buildOptions(queryClient, adminRegionKeys.detail(id), options)
  )
}

export const useAdminRegionAddPaymentProvider = (
  id: string,
  options?: UseMutationOptions<
    Response<AdminRegionsRes>,
    Error,
    AdminPostRegionsRegionPaymentProvidersReq
  >
) => {
  const { client } = useMedusa()
  const queryClient = useQueryClient()

  return useMutation(
    (payload: AdminPostRegionsRegionPaymentProvidersReq) =>
      client.admin.regions.addPaymentProvider(id, payload),
    buildOptions(queryClient, adminRegionKeys.detail(id), options)
  )
}

export const useAdminRegionDeletePaymentProvider = (
  id: string,
  options?: UseMutationOptions<Response<AdminRegionsRes>, Error, string>
) => {
  const { client } = useMedusa()
  const queryClient = useQueryClient()

  return useMutation(
    (provider_id: string) =>
      client.admin.regions.deletePaymentProvider(id, provider_id),
    buildOptions(queryClient, adminRegionKeys.detail(id), options)
  )
}
