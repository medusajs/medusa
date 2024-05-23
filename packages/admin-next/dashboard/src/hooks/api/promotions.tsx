import { AdminGetPromotionsParams } from "@medusajs/medusa"
import {
  QueryKey,
  useMutation,
  UseMutationOptions,
  useQuery,
  UseQueryOptions,
} from "@tanstack/react-query"
import { client } from "../../lib/client"
import { queryClient } from "../../lib/query-client"
import { queryKeysFactory } from "../../lib/query-key-factory"
import {
  BatchAddPromotionRulesReq,
  BatchRemovePromotionRulesReq,
  BatchUpdatePromotionRulesReq,
  CreatePromotionReq,
  UpdatePromotionReq,
} from "../../types/api-payloads"
import {
  PromotionDeleteRes,
  PromotionListRes,
  PromotionRes,
  PromotionRuleAttributesListRes,
  PromotionRuleOperatorsListRes,
  PromotionRulesListRes,
  PromotionRuleValuesListRes,
} from "../../types/api-responses"
import { campaignsQueryKeys } from "./campaigns"

const PROMOTIONS_QUERY_KEY = "promotions" as const
export const promotionsQueryKeys = {
  ...queryKeysFactory(PROMOTIONS_QUERY_KEY),
  listRules: (id: string | null, ruleType: string) => [
    PROMOTIONS_QUERY_KEY,
    id,
    ruleType,
  ],
  listRuleAttributes: (ruleType: string) => [PROMOTIONS_QUERY_KEY, ruleType],
  listRuleValues: (ruleType: string, ruleValue: string) => [
    PROMOTIONS_QUERY_KEY,
    ruleType,
    ruleValue,
  ],
  listRuleOperators: () => [PROMOTIONS_QUERY_KEY],
}

export const usePromotion = (
  id: string,
  options?: Omit<
    UseQueryOptions<PromotionRes, Error, PromotionRes, QueryKey>,
    "queryFn" | "queryKey"
  >
) => {
  const { data, ...rest } = useQuery({
    queryKey: promotionsQueryKeys.detail(id),
    queryFn: async () => client.promotions.retrieve(id),
    ...options,
  })

  return { ...data, ...rest }
}

export const usePromotionRules = (
  id: string | null,
  ruleType: string,
  options?: Omit<
    UseQueryOptions<
      PromotionRulesListRes,
      Error,
      PromotionRulesListRes,
      QueryKey
    >,
    "queryFn" | "queryKey"
  >
) => {
  const { data, ...rest } = useQuery({
    queryKey: promotionsQueryKeys.listRules(id, ruleType),
    queryFn: async () => client.promotions.listRules(id, ruleType),
    ...options,
  })

  return { ...data, ...rest }
}

export const usePromotions = (
  query?: AdminGetPromotionsParams,
  options?: Omit<
    UseQueryOptions<PromotionListRes, Error, PromotionListRes, QueryKey>,
    "queryFn" | "queryKey"
  >
) => {
  const { data, ...rest } = useQuery({
    queryKey: promotionsQueryKeys.list(query),
    queryFn: async () => client.promotions.list(query),
    ...options,
  })

  return { ...data, ...rest }
}

export const usePromotionRuleOperators = (
  options?: Omit<
    UseQueryOptions<
      PromotionListRes,
      Error,
      PromotionRuleOperatorsListRes,
      QueryKey
    >,
    "queryFn" | "queryKey"
  >
) => {
  const { data, ...rest } = useQuery({
    queryKey: promotionsQueryKeys.listRuleOperators(),
    queryFn: async () => client.promotions.listRuleOperators(),
    ...options,
  })

  return { ...data, ...rest }
}

export const usePromotionRuleAttributes = (
  ruleType: string,
  options?: Omit<
    UseQueryOptions<
      PromotionListRes,
      Error,
      PromotionRuleAttributesListRes,
      QueryKey
    >,
    "queryFn" | "queryKey"
  >
) => {
  const { data, ...rest } = useQuery({
    queryKey: promotionsQueryKeys.listRuleAttributes(ruleType),
    queryFn: async () => client.promotions.listRuleAttributes(ruleType),
    ...options,
  })

  return { ...data, ...rest }
}

export const usePromotionRuleValues = (
  ruleType: string,
  ruleValue: string,
  options?: Omit<
    UseQueryOptions<
      PromotionListRes,
      Error,
      PromotionRuleValuesListRes,
      QueryKey
    >,
    "queryFn" | "queryKey"
  >
) => {
  const { data, ...rest } = useQuery({
    queryKey: promotionsQueryKeys.listRuleValues(ruleType, ruleValue),
    queryFn: async () => client.promotions.listRuleValues(ruleType, ruleValue),
    ...options,
  })

  return { ...data, ...rest }
}

export const useDeletePromotion = (
  id: string,
  options?: UseMutationOptions<PromotionDeleteRes, Error, void>
) => {
  return useMutation({
    mutationFn: () => client.promotions.delete(id),
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({ queryKey: promotionsQueryKeys.lists() })
      queryClient.invalidateQueries({
        queryKey: promotionsQueryKeys.detail(id),
      })

      options?.onSuccess?.(data, variables, context)
    },
    ...options,
  })
}

export const useCreatePromotion = (
  options?: UseMutationOptions<PromotionRes, Error, CreatePromotionReq>
) => {
  return useMutation({
    mutationFn: (payload) => client.promotions.create(payload),
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({ queryKey: promotionsQueryKeys.lists() })
      queryClient.invalidateQueries({ queryKey: campaignsQueryKeys.lists() })
      options?.onSuccess?.(data, variables, context)
    },
    ...options,
  })
}

export const useUpdatePromotion = (
  id: string,
  options?: UseMutationOptions<PromotionRes, Error, UpdatePromotionReq>
) => {
  return useMutation({
    mutationFn: (payload) => client.promotions.update(id, payload),
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({ queryKey: promotionsQueryKeys.lists() })
      queryClient.invalidateQueries({
        queryKey: promotionsQueryKeys.detail(id),
      })

      options?.onSuccess?.(data, variables, context)
    },
    ...options,
  })
}

export const usePromotionAddRules = (
  id: string,
  ruleType: string,
  options?: UseMutationOptions<PromotionRes, Error, BatchAddPromotionRulesReq>
) => {
  return useMutation({
    mutationFn: (payload) => client.promotions.addRules(id, ruleType, payload),
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({ queryKey: promotionsQueryKeys.lists() })
      queryClient.invalidateQueries({
        queryKey: promotionsQueryKeys.detail(id),
      })

      options?.onSuccess?.(data, variables, context)
    },
    ...options,
  })
}

export const usePromotionRemoveRules = (
  id: string,
  ruleType: string,
  options?: UseMutationOptions<
    PromotionRes,
    Error,
    BatchRemovePromotionRulesReq
  >
) => {
  return useMutation({
    mutationFn: (payload) =>
      client.promotions.removeRules(id, ruleType, payload),
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({ queryKey: promotionsQueryKeys.lists() })
      queryClient.invalidateQueries({
        queryKey: promotionsQueryKeys.detail(id),
      })

      options?.onSuccess?.(data, variables, context)
    },
    ...options,
  })
}

export const usePromotionUpdateRules = (
  id: string,
  ruleType: string,
  options?: UseMutationOptions<
    PromotionRes,
    Error,
    BatchUpdatePromotionRulesReq
  >
) => {
  return useMutation({
    mutationFn: (payload) =>
      client.promotions.updateRules(id, ruleType, payload),
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({ queryKey: promotionsQueryKeys.lists() })
      queryClient.invalidateQueries({
        queryKey: promotionsQueryKeys.listRules(id, ruleType),
      })
      queryClient.invalidateQueries({
        queryKey: promotionsQueryKeys.detail(id),
      })

      options?.onSuccess?.(data, variables, context)
    },
    ...options,
  })
}
