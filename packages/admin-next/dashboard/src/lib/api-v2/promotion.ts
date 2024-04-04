import {
  AdminGetPromotionsParams,
  AdminPromotionsListRes,
} from "@medusajs/medusa"
import { Response } from "@medusajs/medusa-js"
import {
  UseQueryOptionsWrapper,
  queryKeysFactory,
  useAdminCustomQuery,
} from "medusa-react"

const ADMIN_PROMOTIONS_QUERY_KEY = "admin_promotions"

export const adminPromotionKeys = queryKeysFactory<
  typeof ADMIN_PROMOTIONS_QUERY_KEY,
  AdminGetPromotionsParams
>(ADMIN_PROMOTIONS_QUERY_KEY)

type PromotionQueryKey = typeof adminPromotionKeys

export const useV2Promotions = (
  query?: AdminGetPromotionsParams,
  options?: UseQueryOptionsWrapper<
    Response<AdminPromotionsListRes>,
    Error,
    ReturnType<PromotionQueryKey["list"]>
  >
) => {
  const { data, ...rest } = useAdminCustomQuery<
    AdminGetPromotionsParams,
    AdminPromotionsListRes
  >("/promotions", adminPromotionKeys.list(query), query, options as any)

  return { ...data, ...rest }
}
