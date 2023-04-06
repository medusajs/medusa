import {
  AdminDeleteTaxRatesTaxRateProductsReq,
  AdminDeleteTaxRatesTaxRateProductTypesReq,
  AdminDeleteTaxRatesTaxRateShippingOptionsReq,
  AdminPostTaxRatesReq,
  AdminPostTaxRatesTaxRateProductsReq,
  AdminPostTaxRatesTaxRateProductTypesReq,
  AdminPostTaxRatesTaxRateReq,
  AdminPostTaxRatesTaxRateShippingOptionsReq,
  AdminTaxRatesDeleteRes,
  AdminTaxRatesRes,
} from "@medusajs/medusa"
import { Response } from "@medusajs/medusa-js"
import {
  useMutation,
  UseMutationOptions,
  useQueryClient,
} from "@tanstack/react-query"
import { useMedusa } from "../../../contexts/medusa"
import { buildOptions } from "../../utils/buildOptions"
import { adminTaxRateKeys } from "./queries"

export const useAdminCreateTaxRate = (
  options?: UseMutationOptions<
    Response<AdminTaxRatesRes>,
    Error,
    AdminPostTaxRatesReq
  >
) => {
  const { client } = useMedusa()
  const queryClient = useQueryClient()
  return useMutation(
    (payload: AdminPostTaxRatesReq) => client.admin.taxRates.create(payload),
    buildOptions(queryClient, adminTaxRateKeys.lists(), options)
  )
}

export const useAdminUpdateTaxRate = (
  id: string,
  options?: UseMutationOptions<
    Response<AdminTaxRatesRes>,
    Error,
    AdminPostTaxRatesTaxRateReq
  >
) => {
  const { client } = useMedusa()
  const queryClient = useQueryClient()

  return useMutation(
    (payload: AdminPostTaxRatesTaxRateReq) =>
      client.admin.taxRates.update(id, payload),
    buildOptions(
      queryClient,
      [adminTaxRateKeys.lists(), adminTaxRateKeys.detail(id)],
      options
    )
  )
}

export const useAdminDeleteTaxRate = (
  id: string,
  options?: UseMutationOptions<Response<AdminTaxRatesDeleteRes>, Error, void>
) => {
  const { client } = useMedusa()
  const queryClient = useQueryClient()

  return useMutation(
    () => client.admin.taxRates.delete(id),
    buildOptions(
      queryClient,
      [adminTaxRateKeys.lists(), adminTaxRateKeys.detail(id)],
      options
    )
  )
}

export const useAdminCreateProductTaxRates = (
  id: string,
  options?: UseMutationOptions<
    Response<AdminTaxRatesRes>,
    Error,
    AdminPostTaxRatesTaxRateProductsReq
  >
) => {
  const { client } = useMedusa()
  const queryClient = useQueryClient()

  return useMutation(
    (payload: AdminPostTaxRatesTaxRateProductsReq) =>
      client.admin.taxRates.addProducts(id, payload),
    buildOptions(
      queryClient,
      [adminTaxRateKeys.lists(), adminTaxRateKeys.detail(id)],
      options
    )
  )
}

export const useAdminDeleteProductTaxRates = (
  id: string,
  options?: UseMutationOptions<
    Response<AdminTaxRatesRes>,
    Error,
    AdminDeleteTaxRatesTaxRateProductsReq
  >
) => {
  const { client } = useMedusa()
  const queryClient = useQueryClient()

  return useMutation(
    (payload: AdminDeleteTaxRatesTaxRateProductsReq) =>
      client.admin.taxRates.removeProducts(id, payload),
    buildOptions(
      queryClient,
      [adminTaxRateKeys.lists(), adminTaxRateKeys.detail(id)],
      options
    )
  )
}

export const useAdminCreateProductTypeTaxRates = (
  id: string,
  options?: UseMutationOptions<
    Response<AdminTaxRatesRes>,
    Error,
    AdminPostTaxRatesTaxRateProductTypesReq
  >
) => {
  const { client } = useMedusa()
  const queryClient = useQueryClient()

  return useMutation(
    (payload: AdminPostTaxRatesTaxRateProductTypesReq) =>
      client.admin.taxRates.addProductTypes(id, payload),
    buildOptions(
      queryClient,
      [adminTaxRateKeys.lists(), adminTaxRateKeys.detail(id)],
      options
    )
  )
}

export const useAdminDeleteProductTypeTaxRates = (
  id: string,
  options?: UseMutationOptions<
    Response<AdminTaxRatesRes>,
    Error,
    AdminDeleteTaxRatesTaxRateProductTypesReq
  >
) => {
  const { client } = useMedusa()
  const queryClient = useQueryClient()

  return useMutation(
    (payload: AdminDeleteTaxRatesTaxRateProductTypesReq) =>
      client.admin.taxRates.removeProductTypes(id, payload),
    buildOptions(
      queryClient,
      [adminTaxRateKeys.lists(), adminTaxRateKeys.detail(id)],
      options
    )
  )
}

export const useAdminCreateShippingTaxRates = (
  id: string,
  options?: UseMutationOptions<
    Response<AdminTaxRatesRes>,
    Error,
    AdminPostTaxRatesTaxRateShippingOptionsReq
  >
) => {
  const { client } = useMedusa()
  const queryClient = useQueryClient()

  return useMutation(
    (payload: AdminPostTaxRatesTaxRateShippingOptionsReq) =>
      client.admin.taxRates.addShippingOptions(id, payload),
    buildOptions(
      queryClient,
      [adminTaxRateKeys.lists(), adminTaxRateKeys.detail(id)],
      options
    )
  )
}

export const useAdminDeleteShippingTaxRates = (
  id: string,
  options?: UseMutationOptions<
    Response<AdminTaxRatesRes>,
    Error,
    AdminDeleteTaxRatesTaxRateShippingOptionsReq
  >
) => {
  const { client } = useMedusa()
  const queryClient = useQueryClient()

  return useMutation(
    (payload: AdminDeleteTaxRatesTaxRateShippingOptionsReq) =>
      client.admin.taxRates.removeShippingOptions(id, payload),
    buildOptions(
      queryClient,
      [adminTaxRateKeys.lists(), adminTaxRateKeys.detail(id)],
      options
    )
  )
}
