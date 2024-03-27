import {
  AdminGetPromotionsParams,
  AdminPromotionsListRes,
} from "@medusajs/medusa"
import { queryKeysFactory, useAdminCustomQuery } from "medusa-react"

const QUERY_KEY = "admin_promotions"
export const adminPromotionKeys = queryKeysFactory<
  typeof QUERY_KEY,
  AdminGetPromotionsParams
>(QUERY_KEY)

export const useV2Promotions = (
  query?: AdminGetPromotionsParams,
  options?: object
) => {
  const { data, ...rest } = useAdminCustomQuery<
    AdminGetPromotionsParams,
    AdminPromotionsListRes
  >("/admin/promotions", adminPromotionKeys.list(query), query, options)

  return { ...data, ...rest }
}
