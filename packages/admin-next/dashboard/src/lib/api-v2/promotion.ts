import { AdminPromotionsListRes } from "@medusajs/medusa"
import { Response } from "@medusajs/medusa-js"
import { FilterablePromotionProps } from "@medusajs/types"
import {
  queryKeysFactory,
  useAdminCustomQuery,
  UseQueryOptionsWrapper,
} from "medusa-react"

export const adminPromotionKeys = queryKeysFactory("promotions")
type PromotionQueryKeys = typeof adminPromotionKeys

export const useV2Promotions = (
  query?: FilterablePromotionProps,
  options?: UseQueryOptionsWrapper<
    Response<AdminPromotionsListRes>,
    Error,
    ReturnType<PromotionQueryKeys["list"]>
  >
) => {
  const { data, isLoading, isError, error } = useAdminCustomQuery(
    "/admin/promotions",
    adminPromotionKeys.list(query),
    options
  )

  return {
    promotions: data?.promotions,
    count: data?.count,
    isLoading,
    isError,
    error,
  }
}
