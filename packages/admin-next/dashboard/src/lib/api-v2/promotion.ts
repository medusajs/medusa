import {
  AdminGetPromotionsParams,
  AdminGetPromotionsPromotionParams,
  AdminPostPromotionsPromotionReq,
  AdminPromotionRes,
  AdminPromotionsListRes,
} from "@medusajs/medusa"
import { useMutation } from "@tanstack/react-query"
import { queryKeysFactory, useAdminCustomQuery } from "medusa-react"
import { medusa } from "../medusa"

const QUERY_KEY = "admin_promotions"
export const adminPromotionKeys = queryKeysFactory<
  typeof QUERY_KEY,
  AdminGetPromotionsParams
>(QUERY_KEY)

export const adminPromotionQueryFns = {
  list: (query: AdminGetPromotionsParams) =>
    medusa.admin.custom.get(`/admin/promotions`, query),
  detail: (id: string) => medusa.admin.custom.get(`/admin/promotions/${id}`),
}

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

export const useV2Promotion = (
  id: string,
  query?: AdminGetPromotionsParams,
  options?: object
) => {
  const { data, ...rest } = useAdminCustomQuery<
    AdminGetPromotionsPromotionParams,
    AdminPromotionRes
  >(`/admin/promotions/${id}`, adminPromotionKeys.detail(id), query, options)

  return { ...data, ...rest }
}

export const useV2DeletePromotion = (id: string) => {
  return useMutation(() =>
    medusa.admin.custom.delete(`/admin/promotions/${id}`)
  )
}

export const useV2PostPromotion = (id: string) => {
  return useMutation((args: AdminPostPromotionsPromotionReq) =>
    medusa.client.request("POST", `/admin/promotions/${id}`, args)
  )
}
