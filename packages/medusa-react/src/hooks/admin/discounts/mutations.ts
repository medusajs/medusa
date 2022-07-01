import {
  AdminDiscountsDeleteRes,
  AdminDiscountsRes,
  AdminPostDiscountsDiscountConditions,
  AdminPostDiscountsDiscountConditionsCondition,
  AdminPostDiscountsDiscountDynamicCodesReq,
  AdminPostDiscountsDiscountReq,
  AdminPostDiscountsReq
} from "@medusajs/medusa"
import { Response } from "@medusajs/medusa-js"
import { useMutation, UseMutationOptions, useQueryClient } from "react-query"
import { useMedusa } from "../../../contexts/medusa"
import { buildOptions } from "../../utils/buildOptions"
import { adminDiscountKeys } from "./queries"

export const useAdminCreateDiscount = (
  options?: UseMutationOptions<
    Response<AdminDiscountsRes>,
    Error,
    AdminPostDiscountsReq
  >
) => {
  const { client } = useMedusa()
  const queryClient = useQueryClient()
  return useMutation(
    (payload: AdminPostDiscountsReq) => client.admin.discounts.create(payload),
    buildOptions(queryClient, adminDiscountKeys.lists(), options)
  )
}

export const useAdminUpdateDiscount = (
  id: string,
  options?: UseMutationOptions<
    Response<AdminDiscountsRes>,
    Error,
    AdminPostDiscountsDiscountReq
  >
) => {
  const { client } = useMedusa()
  const queryClient = useQueryClient()
  return useMutation(
    (payload: AdminPostDiscountsDiscountReq) =>
      client.admin.discounts.update(id, payload),
    buildOptions(queryClient, adminDiscountKeys.detail(id), options)
  )
}

export const useAdminDeleteDiscount = (
  id: string,
  options?: UseMutationOptions<Response<AdminDiscountsDeleteRes>, Error, void>
) => {
  const { client } = useMedusa()
  const queryClient = useQueryClient()
  return useMutation(
    () => client.admin.discounts.delete(id),
    buildOptions(queryClient, adminDiscountKeys.lists(), options)
  )
}

export const useAdminDiscountAddRegion = (
  id: string,
  options?: UseMutationOptions<Response<AdminDiscountsRes>, Error, string>
) => {
  const { client } = useMedusa()
  const queryClient = useQueryClient()
  return useMutation(
    (regionId: string) => client.admin.discounts.addRegion(id, regionId),
    buildOptions(queryClient, adminDiscountKeys.detail(id), options)
  )
}

export const useAdminDiscountRemoveRegion = (
  id: string,
  options?: UseMutationOptions<Response<AdminDiscountsRes>, Error, string>
) => {
  const { client } = useMedusa()
  const queryClient = useQueryClient()
  return useMutation(
    (regionId: string) => client.admin.discounts.removeRegion(id, regionId),
    buildOptions(queryClient, adminDiscountKeys.detail(id), options)
  )
}

export const useAdminCreateDynamicDiscountCode = (
  id: string,
  options?: UseMutationOptions<
    Response<AdminDiscountsRes>,
    Error,
    AdminPostDiscountsDiscountDynamicCodesReq
  >
) => {
  const { client } = useMedusa()
  const queryClient = useQueryClient()
  return useMutation(
    (payload: AdminPostDiscountsDiscountDynamicCodesReq) =>
      client.admin.discounts.createDynamicCode(id, payload),
    buildOptions(
      queryClient,
      [adminDiscountKeys.lists(), adminDiscountKeys.detail(id)],
      options
    )
  )
}

export const useAdminDeleteDynamicDiscountCode = (
  id: string,
  options?: UseMutationOptions<Response<AdminDiscountsRes>, Error, string>
) => {
  const { client } = useMedusa()
  const queryClient = useQueryClient()
  return useMutation(
    (code: string) => client.admin.discounts.deleteDynamicCode(id, code),
    buildOptions(
      queryClient,
      [adminDiscountKeys.lists(), adminDiscountKeys.detail(id)],
      options
    )
  )
}

export const useAdminDiscountCreateCondition = (
  discountId: string,
  options?: UseMutationOptions<
    Response<AdminDiscountsRes>,
    Error,
    AdminPostDiscountsDiscountConditions
  >
) => {
  const { client } = useMedusa()
  const queryClient = useQueryClient()
  return useMutation(
    (payload: AdminPostDiscountsDiscountConditions) =>
      client.admin.discounts.createCondition(discountId, payload),
    buildOptions(queryClient, adminDiscountKeys.detail(discountId), options)
  )
}

export const useAdminDiscountUpdateCondition = (
  discountId: string,
  conditionId: string,
  options?: UseMutationOptions<
    Response<AdminDiscountsRes>,
    Error,
    AdminPostDiscountsDiscountConditionsCondition
  >
) => {
  const { client } = useMedusa()
  const queryClient = useQueryClient()
  return useMutation(
    (payload: AdminPostDiscountsDiscountConditionsCondition) =>
      client.admin.discounts.updateCondition(discountId, conditionId, payload),
    buildOptions(queryClient, adminDiscountKeys.detail(discountId), options)
  )
}

export const useAdminDiscountRemoveCondition = (
  discountId: string,
  options?: UseMutationOptions<Response<AdminDiscountsDeleteRes>, Error, string>
) => {
  const { client } = useMedusa()
  const queryClient = useQueryClient()
  return useMutation(
    (conditionId: string) =>
      client.admin.discounts.deleteCondition(discountId, conditionId),
    buildOptions(queryClient, adminDiscountKeys.detail(discountId), options)
  )
}
