/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { UseQueryOptionsWrapper, UseMutationOptionsWrapper} from '../core/HookUtils';
import { useMedusaAdmin } from '../useMedusaAdmin';
import type { AdminDeleteDiscountsDiscountConditionsConditionBatchReq } from '../models/AdminDeleteDiscountsDiscountConditionsConditionBatchReq';
import type { AdminDeleteDiscountsDiscountConditionsConditionParams } from '../models/AdminDeleteDiscountsDiscountConditionsConditionParams';
import type { AdminDiscountConditionsDeleteRes } from '../models/AdminDiscountConditionsDeleteRes';
import type { AdminDiscountConditionsRes } from '../models/AdminDiscountConditionsRes';
import type { AdminDiscountsRes } from '../models/AdminDiscountsRes';
import type { AdminGetDiscountsDiscountConditionsConditionParams } from '../models/AdminGetDiscountsDiscountConditionsConditionParams';
import type { AdminPostDiscountsDiscountConditions } from '../models/AdminPostDiscountsDiscountConditions';
import type { AdminPostDiscountsDiscountConditionsConditionBatchParams } from '../models/AdminPostDiscountsDiscountConditionsConditionBatchParams';
import type { AdminPostDiscountsDiscountConditionsConditionBatchReq } from '../models/AdminPostDiscountsDiscountConditionsConditionBatchReq';
import type { AdminPostDiscountsDiscountConditionsParams } from '../models/AdminPostDiscountsDiscountConditionsParams';

export const useDiscountConditionCreateCondition = (
  discountId: string,
  requestBody: AdminPostDiscountsDiscountConditions,
  queryParams: AdminPostDiscountsDiscountConditionsParams,
  options: UseMutationOptionsWrapper<Awaited<ReturnType<typeof client.discountCondition.createCondition>>, unknown, AdminPostDiscountsDiscountConditions> = {}
) => {
  const { client } = useMedusaAdmin()
  if (!options?.onSuccess) {
    const queryClient = useQueryClient()
    options.onSuccess = async () => {
      await queryClient.invalidateQueries('discountCondition')
    }
  }
  return useMutation<Awaited<ReturnType<typeof client.discountCondition.createCondition>>, unknown, AdminPostDiscountsDiscountConditions>(
    ['discountCondition', 'createCondition', discountId,requestBody,queryParams],
    () => client.discountCondition.createCondition(discountId,requestBody,queryParams),
    options
  );
};

export const useDiscountConditionGetCondition = (
  discountId: string,
  conditionId: string,
  queryParams: AdminGetDiscountsDiscountConditionsConditionParams,
  options: UseQueryOptionsWrapper<Awaited<ReturnType<typeof client.discountCondition.getCondition>>> = {}
) => {
  const { client } = useMedusaAdmin()
  const { data, ...rest } = useQuery<Awaited<ReturnType<typeof client.discountCondition.getCondition>>>(
    ['discountCondition', 'getCondition', discountId,conditionId,queryParams],
    () => client.discountCondition.getCondition(discountId,conditionId,queryParams),
    options
  );
  return { ...data, ...rest } as const
};

export const useDiscountConditionDeleteCondition = (
  discountId: string,
  conditionId: string,
  queryParams: AdminDeleteDiscountsDiscountConditionsConditionParams,
  options: UseMutationOptionsWrapper<Awaited<ReturnType<typeof client.discountCondition.deleteCondition>>, unknown, void> = {}
) => {
  const { client } = useMedusaAdmin()
  if (!options?.onSuccess) {
    const queryClient = useQueryClient()
    options.onSuccess = async () => {
      await queryClient.invalidateQueries('discountCondition')
    }
  }
  return useMutation<Awaited<ReturnType<typeof client.discountCondition.deleteCondition>>, unknown, void>(
    ['discountCondition', 'deleteCondition', discountId,conditionId,queryParams],
    () => client.discountCondition.deleteCondition(discountId,conditionId,queryParams),
    options
  );
};

export const useDiscountConditionAddConditionResourceBatch = (
  discountId: string,
  conditionId: string,
  requestBody: AdminPostDiscountsDiscountConditionsConditionBatchReq,
  queryParams: AdminPostDiscountsDiscountConditionsConditionBatchParams,
  options: UseMutationOptionsWrapper<Awaited<ReturnType<typeof client.discountCondition.addConditionResourceBatch>>, unknown, AdminPostDiscountsDiscountConditionsConditionBatchReq> = {}
) => {
  const { client } = useMedusaAdmin()
  if (!options?.onSuccess) {
    const queryClient = useQueryClient()
    options.onSuccess = async () => {
      await queryClient.invalidateQueries('discountCondition')
    }
  }
  return useMutation<Awaited<ReturnType<typeof client.discountCondition.addConditionResourceBatch>>, unknown, AdminPostDiscountsDiscountConditionsConditionBatchReq>(
    ['discountCondition', 'addConditionResourceBatch', discountId,conditionId,requestBody,queryParams],
    () => client.discountCondition.addConditionResourceBatch(discountId,conditionId,requestBody,queryParams),
    options
  );
};

export const useDiscountConditionDeleteConditionResourceBatch = (
  discountId: string,
  conditionId: string,
  requestBody: AdminDeleteDiscountsDiscountConditionsConditionBatchReq,
  queryParams: {
    /**
     * (Comma separated) Which relations should be expanded in each discount of the result.
     */
    expand?: string,
    /**
     * (Comma separated) Which fields should be included in each discount of the result.
     */
    fields?: string,
  },
  options: UseMutationOptionsWrapper<Awaited<ReturnType<typeof client.discountCondition.deleteConditionResourceBatch>>, unknown, AdminDeleteDiscountsDiscountConditionsConditionBatchReq> = {}
) => {
  const { client } = useMedusaAdmin()
  if (!options?.onSuccess) {
    const queryClient = useQueryClient()
    options.onSuccess = async () => {
      await queryClient.invalidateQueries('discountCondition')
    }
  }
  return useMutation<Awaited<ReturnType<typeof client.discountCondition.deleteConditionResourceBatch>>, unknown, AdminDeleteDiscountsDiscountConditionsConditionBatchReq>(
    ['discountCondition', 'deleteConditionResourceBatch', discountId,conditionId,requestBody,queryParams],
    () => client.discountCondition.deleteConditionResourceBatch(discountId,conditionId,requestBody,queryParams),
    options
  );
};


