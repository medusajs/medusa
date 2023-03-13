/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { UseQueryOptionsWrapper, UseMutationOptionsWrapper} from '../core/HookUtils';
import { useMedusaAdmin } from '../useMedusaAdmin';
import type { AdminDeleteDiscountsDiscountConditionsConditionBatchReq } from '@medusajs/client-types';
import type { AdminDeleteDiscountsDiscountConditionsConditionParams } from '@medusajs/client-types';
import type { AdminDiscountConditionsDeleteRes } from '@medusajs/client-types';
import type { AdminDiscountConditionsRes } from '@medusajs/client-types';
import type { AdminDiscountsDeleteRes } from '@medusajs/client-types';
import type { AdminDiscountsListRes } from '@medusajs/client-types';
import type { AdminDiscountsRes } from '@medusajs/client-types';
import type { AdminGetDiscountParams } from '@medusajs/client-types';
import type { AdminGetDiscountsDiscountCodeParams } from '@medusajs/client-types';
import type { AdminGetDiscountsDiscountConditionsConditionParams } from '@medusajs/client-types';
import type { AdminGetDiscountsParams } from '@medusajs/client-types';
import type { AdminPostDiscountsDiscountConditions } from '@medusajs/client-types';
import type { AdminPostDiscountsDiscountConditionsCondition } from '@medusajs/client-types';
import type { AdminPostDiscountsDiscountConditionsConditionBatchParams } from '@medusajs/client-types';
import type { AdminPostDiscountsDiscountConditionsConditionBatchReq } from '@medusajs/client-types';
import type { AdminPostDiscountsDiscountConditionsConditionParams } from '@medusajs/client-types';
import type { AdminPostDiscountsDiscountConditionsParams } from '@medusajs/client-types';
import type { AdminPostDiscountsDiscountDynamicCodesReq } from '@medusajs/client-types';
import type { AdminPostDiscountsDiscountParams } from '@medusajs/client-types';
import type { AdminPostDiscountsDiscountReq } from '@medusajs/client-types';
import type { AdminPostDiscountsParams } from '@medusajs/client-types';
import type { AdminPostDiscountsReq } from '@medusajs/client-types';

const { client } = useMedusaAdmin()

export const useDiscountsList = (
  queryParams: AdminGetDiscountsParams,
  options: UseQueryOptionsWrapper<Awaited<ReturnType<typeof client.discounts.list>>> = {}
) => {
  const { data, ...rest } = useQuery<Awaited<ReturnType<typeof client.discounts.list>>>(
    ['discounts', 'list', queryParams],
    () => client.discounts.list(queryParams),
    options
  );
  return { ...data, ...rest } as const
};

export const useDiscountsCreate = (
  requestBody: AdminPostDiscountsReq,
  queryParams: AdminPostDiscountsParams,
  options: UseMutationOptionsWrapper<Awaited<ReturnType<typeof client.discounts.create>>, unknown, AdminPostDiscountsReq> = {}
) => {
  if (!options?.onSuccess) {
    const queryClient = useQueryClient()
    options.onSuccess = async () => {
      await queryClient.invalidateQueries('discounts')
    }
  }
  return useMutation<Awaited<ReturnType<typeof client.discounts.create>>, unknown, AdminPostDiscountsReq>(
    ['discounts', 'create', requestBody,queryParams],
    () => client.discounts.create(requestBody,queryParams),
    options
  );
};

export const useDiscountsRetrieveByCode = (
  code: string,
  queryParams: AdminGetDiscountsDiscountCodeParams,
  options: UseQueryOptionsWrapper<Awaited<ReturnType<typeof client.discounts.retrieveByCode>>> = {}
) => {
  const { data, ...rest } = useQuery<Awaited<ReturnType<typeof client.discounts.retrieveByCode>>>(
    ['discounts', 'retrieveByCode', code,queryParams],
    () => client.discounts.retrieveByCode(code,queryParams),
    options
  );
  return { ...data, ...rest } as const
};

export const useDiscountsCreateCondition = (
  discountId: string,
  requestBody: AdminPostDiscountsDiscountConditions,
  queryParams: AdminPostDiscountsDiscountConditionsParams,
  options: UseMutationOptionsWrapper<Awaited<ReturnType<typeof client.discounts.createCondition>>, unknown, AdminPostDiscountsDiscountConditions> = {}
) => {
  if (!options?.onSuccess) {
    const queryClient = useQueryClient()
    options.onSuccess = async () => {
      await queryClient.invalidateQueries('discounts')
    }
  }
  return useMutation<Awaited<ReturnType<typeof client.discounts.createCondition>>, unknown, AdminPostDiscountsDiscountConditions>(
    ['discounts', 'createCondition', discountId,requestBody,queryParams],
    () => client.discounts.createCondition(discountId,requestBody,queryParams),
    options
  );
};

export const useDiscountsGetCondition = (
  discountId: string,
  conditionId: string,
  queryParams: AdminGetDiscountsDiscountConditionsConditionParams,
  options: UseQueryOptionsWrapper<Awaited<ReturnType<typeof client.discounts.getCondition>>> = {}
) => {
  const { data, ...rest } = useQuery<Awaited<ReturnType<typeof client.discounts.getCondition>>>(
    ['discounts', 'getCondition', discountId,conditionId,queryParams],
    () => client.discounts.getCondition(discountId,conditionId,queryParams),
    options
  );
  return { ...data, ...rest } as const
};

export const useDiscountsUpdateCondition = (
  discountId: string,
  conditionId: string,
  requestBody: AdminPostDiscountsDiscountConditionsCondition,
  queryParams: AdminPostDiscountsDiscountConditionsConditionParams,
  options: UseMutationOptionsWrapper<Awaited<ReturnType<typeof client.discounts.updateCondition>>, unknown, AdminPostDiscountsDiscountConditionsCondition> = {}
) => {
  if (!options?.onSuccess) {
    const queryClient = useQueryClient()
    options.onSuccess = async () => {
      await queryClient.invalidateQueries('discounts')
    }
  }
  return useMutation<Awaited<ReturnType<typeof client.discounts.updateCondition>>, unknown, AdminPostDiscountsDiscountConditionsCondition>(
    ['discounts', 'updateCondition', discountId,conditionId,requestBody,queryParams],
    () => client.discounts.updateCondition(discountId,conditionId,requestBody,queryParams),
    options
  );
};

export const useDiscountsDeleteCondition = (
  discountId: string,
  conditionId: string,
  queryParams: AdminDeleteDiscountsDiscountConditionsConditionParams,
  options: UseMutationOptionsWrapper<Awaited<ReturnType<typeof client.discounts.deleteCondition>>, unknown, void> = {}
) => {
  if (!options?.onSuccess) {
    const queryClient = useQueryClient()
    options.onSuccess = async () => {
      await queryClient.invalidateQueries('discounts')
    }
  }
  return useMutation<Awaited<ReturnType<typeof client.discounts.deleteCondition>>, unknown, void>(
    ['discounts', 'deleteCondition', discountId,conditionId,queryParams],
    () => client.discounts.deleteCondition(discountId,conditionId,queryParams),
    options
  );
};

export const useDiscountsAddConditionResourceBatch = (
  discountId: string,
  conditionId: string,
  requestBody: AdminPostDiscountsDiscountConditionsConditionBatchReq,
  queryParams: AdminPostDiscountsDiscountConditionsConditionBatchParams,
  options: UseMutationOptionsWrapper<Awaited<ReturnType<typeof client.discounts.addConditionResourceBatch>>, unknown, AdminPostDiscountsDiscountConditionsConditionBatchReq> = {}
) => {
  if (!options?.onSuccess) {
    const queryClient = useQueryClient()
    options.onSuccess = async () => {
      await queryClient.invalidateQueries('discounts')
    }
  }
  return useMutation<Awaited<ReturnType<typeof client.discounts.addConditionResourceBatch>>, unknown, AdminPostDiscountsDiscountConditionsConditionBatchReq>(
    ['discounts', 'addConditionResourceBatch', discountId,conditionId,requestBody,queryParams],
    () => client.discounts.addConditionResourceBatch(discountId,conditionId,requestBody,queryParams),
    options
  );
};

export const useDiscountsDeleteConditionResourceBatch = (
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
  options: UseMutationOptionsWrapper<Awaited<ReturnType<typeof client.discounts.deleteConditionResourceBatch>>, unknown, AdminDeleteDiscountsDiscountConditionsConditionBatchReq> = {}
) => {
  if (!options?.onSuccess) {
    const queryClient = useQueryClient()
    options.onSuccess = async () => {
      await queryClient.invalidateQueries('discounts')
    }
  }
  return useMutation<Awaited<ReturnType<typeof client.discounts.deleteConditionResourceBatch>>, unknown, AdminDeleteDiscountsDiscountConditionsConditionBatchReq>(
    ['discounts', 'deleteConditionResourceBatch', discountId,conditionId,requestBody,queryParams],
    () => client.discounts.deleteConditionResourceBatch(discountId,conditionId,requestBody,queryParams),
    options
  );
};

export const useDiscountsRetrieve = (
  id: string,
  queryParams: AdminGetDiscountParams,
  options: UseQueryOptionsWrapper<Awaited<ReturnType<typeof client.discounts.retrieve>>> = {}
) => {
  const { data, ...rest } = useQuery<Awaited<ReturnType<typeof client.discounts.retrieve>>>(
    ['discounts', 'retrieve', id,queryParams],
    () => client.discounts.retrieve(id,queryParams),
    options
  );
  return { ...data, ...rest } as const
};

export const useDiscountsUpdate = (
  id: string,
  requestBody: AdminPostDiscountsDiscountReq,
  queryParams: AdminPostDiscountsDiscountParams,
  options: UseMutationOptionsWrapper<Awaited<ReturnType<typeof client.discounts.update>>, unknown, AdminPostDiscountsDiscountReq> = {}
) => {
  if (!options?.onSuccess) {
    const queryClient = useQueryClient()
    options.onSuccess = async () => {
      await queryClient.invalidateQueries('discounts')
    }
  }
  return useMutation<Awaited<ReturnType<typeof client.discounts.update>>, unknown, AdminPostDiscountsDiscountReq>(
    ['discounts', 'update', id,requestBody,queryParams],
    () => client.discounts.update(id,requestBody,queryParams),
    options
  );
};

export const useDiscountsDelete = (
  id: string,
  options: UseMutationOptionsWrapper<Awaited<ReturnType<typeof client.discounts.delete>>, unknown, void> = {}
) => {
  if (!options?.onSuccess) {
    const queryClient = useQueryClient()
    options.onSuccess = async () => {
      await queryClient.invalidateQueries('discounts')
    }
  }
  return useMutation<Awaited<ReturnType<typeof client.discounts.delete>>, unknown, void>(
    ['discounts', 'delete', id],
    () => client.discounts.delete(id),
    options
  );
};

export const useDiscountsCreateDynamicCode = (
  id: string,
  requestBody: AdminPostDiscountsDiscountDynamicCodesReq,
  options: UseMutationOptionsWrapper<Awaited<ReturnType<typeof client.discounts.createDynamicCode>>, unknown, AdminPostDiscountsDiscountDynamicCodesReq> = {}
) => {
  if (!options?.onSuccess) {
    const queryClient = useQueryClient()
    options.onSuccess = async () => {
      await queryClient.invalidateQueries('discounts')
    }
  }
  return useMutation<Awaited<ReturnType<typeof client.discounts.createDynamicCode>>, unknown, AdminPostDiscountsDiscountDynamicCodesReq>(
    ['discounts', 'createDynamicCode', id,requestBody],
    () => client.discounts.createDynamicCode(id,requestBody),
    options
  );
};

export const useDiscountsDeleteDynamicCode = (
  id: string,
  code: string,
  options: UseMutationOptionsWrapper<Awaited<ReturnType<typeof client.discounts.deleteDynamicCode>>, unknown, void> = {}
) => {
  if (!options?.onSuccess) {
    const queryClient = useQueryClient()
    options.onSuccess = async () => {
      await queryClient.invalidateQueries('discounts')
    }
  }
  return useMutation<Awaited<ReturnType<typeof client.discounts.deleteDynamicCode>>, unknown, void>(
    ['discounts', 'deleteDynamicCode', id,code],
    () => client.discounts.deleteDynamicCode(id,code),
    options
  );
};

export const useDiscountsAddRegion = (
  id: string,
  regionId: string,
  options: UseMutationOptionsWrapper<Awaited<ReturnType<typeof client.discounts.addRegion>>, unknown, void> = {}
) => {
  if (!options?.onSuccess) {
    const queryClient = useQueryClient()
    options.onSuccess = async () => {
      await queryClient.invalidateQueries('discounts')
    }
  }
  return useMutation<Awaited<ReturnType<typeof client.discounts.addRegion>>, unknown, void>(
    ['discounts', 'addRegion', id,regionId],
    () => client.discounts.addRegion(id,regionId),
    options
  );
};

export const useDiscountsRemoveRegion = (
  id: string,
  regionId: string,
  options: UseMutationOptionsWrapper<Awaited<ReturnType<typeof client.discounts.removeRegion>>, unknown, void> = {}
) => {
  if (!options?.onSuccess) {
    const queryClient = useQueryClient()
    options.onSuccess = async () => {
      await queryClient.invalidateQueries('discounts')
    }
  }
  return useMutation<Awaited<ReturnType<typeof client.discounts.removeRegion>>, unknown, void>(
    ['discounts', 'removeRegion', id,regionId],
    () => client.discounts.removeRegion(id,regionId),
    options
  );
};


