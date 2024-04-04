import {
  AdminGetPromotionsParams,
  AdminGetPromotionsPromotionParams,
  AdminPostPromotionsPromotionReq,
  AdminPromotionRes,
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

export const adminPromotionQueryFns = {
  list: (query: AdminGetPromotionsParams) =>
    medusa.admin.custom.get(`/admin/promotions`, query),
  detail: (id: string) => medusa.admin.custom.get(`/admin/promotions/${id}`),
  ruleAttributes: (ruleType: string) =>
    medusa.admin.custom.get(
      `/admin/promotions/rule-attribute-options/${ruleType}`
    ),
}

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

export const useV2PromotionRuleAttributeOptions = (
  ruleType: string,
  options?: object
) => {
  const { data, ...rest } = useAdminCustomQuery(
    `/admin/promotions/rule-attribute-options/${ruleType}`,
    adminPromotionKeys.all,
    {},
    options
  )

  return { ...data, ...rest }
}

export const useV2PromotionRuleValueOptions = (
  ruleType: string,
  ruleValue: string,
  options?: object
) => {
  const { data, ...rest } = useAdminCustomQuery(
    `/admin/promotions/rule-value-options/${ruleType}/${ruleValue}`,
    adminPromotionKeys.all,
    {},
    options
  )

  return { ...data, ...rest }
}

export const useV2PromotionRuleOperatorOptions = (options?: object) => {
  const { data, ...rest } = useAdminCustomQuery(
    `/admin/promotions/rule-operator-options`,
    adminPromotionKeys.all,
    {},
    options
  )

  return { ...data, ...rest }
}
