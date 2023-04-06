import {
  AdminDiscountConditionsRes,
  AdminDiscountsListRes,
  AdminDiscountsRes,
  AdminGetDiscountParams,
  AdminGetDiscountsDiscountConditionsConditionParams,
  AdminGetDiscountsParams,
} from "@medusajs/medusa"
import { Response } from "@medusajs/medusa-js"
import { useQuery } from "@tanstack/react-query"
import { useMedusa } from "../../../contexts"
import { UseQueryOptionsWrapper } from "../../../types"
import { queryKeysFactory } from "../../utils"

const ADMIN_DISCOUNTS_QUERY_KEY = `admin_discounts` as const

export const adminDiscountKeys = {
  ...queryKeysFactory(ADMIN_DISCOUNTS_QUERY_KEY),
  detailCondition(id: string, query?: any) {
    return [
      ...this.detail(id),
      "condition" as const,
      { ...(query || {}) },
    ] as const
  },
}

type DiscountQueryKeys = typeof adminDiscountKeys

export const useAdminDiscounts = (
  query?: AdminGetDiscountsParams,
  options?: UseQueryOptionsWrapper<
    Response<AdminDiscountsListRes>,
    Error,
    ReturnType<DiscountQueryKeys["list"]>
  >
) => {
  const { client } = useMedusa()
  const { data, ...rest } = useQuery(
    adminDiscountKeys.list(query),
    () => client.admin.discounts.list(query),
    options
  )
  return { ...data, ...rest } as const
}

export const useAdminDiscount = (
  id: string,
  query?: AdminGetDiscountParams,
  options?: UseQueryOptionsWrapper<
    Response<AdminDiscountsRes>,
    Error,
    ReturnType<DiscountQueryKeys["detail"]>
  >
) => {
  const { client } = useMedusa()
  const { data, ...rest } = useQuery(
    adminDiscountKeys.detail(id),
    () => client.admin.discounts.retrieve(id, query),
    options
  )
  return { ...data, ...rest } as const
}

export const useAdminGetDiscountByCode = (
  code: string,
  options?: UseQueryOptionsWrapper<
    Response<AdminDiscountsRes>,
    Error,
    ReturnType<DiscountQueryKeys["detail"]>
  >
) => {
  const { client } = useMedusa()
  const { data, ...rest } = useQuery(
    adminDiscountKeys.detail(code),
    () => client.admin.discounts.retrieveByCode(code),
    options
  )
  return { ...data, ...rest } as const
}

export const useAdminGetDiscountCondition = (
  id: string,
  conditionId: string,
  query?: AdminGetDiscountsDiscountConditionsConditionParams,
  options?: UseQueryOptionsWrapper<
    Response<AdminDiscountConditionsRes>,
    Error,
    ReturnType<DiscountQueryKeys["detailCondition"]>
  >
) => {
  const { client } = useMedusa()
  const { data, ...rest } = useQuery(
    adminDiscountKeys.detailCondition(conditionId),
    () => client.admin.discounts.getCondition(id, conditionId, query),
    options
  )
  return { ...data, ...rest } as const
}
