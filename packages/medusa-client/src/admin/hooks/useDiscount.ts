/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { UseQueryOptionsWrapper, UseMutationOptionsWrapper} from '../core/HookUtils';
import { useMedusaAdmin } from '../useMedusaAdmin';
import type { AdminDiscountsDeleteRes } from '../models/AdminDiscountsDeleteRes';
import type { AdminDiscountsListRes } from '../models/AdminDiscountsListRes';
import type { AdminDiscountsRes } from '../models/AdminDiscountsRes';
import type { AdminGetDiscountParams } from '../models/AdminGetDiscountParams';
import type { AdminGetDiscountsDiscountCodeParams } from '../models/AdminGetDiscountsDiscountCodeParams';
import type { AdminGetDiscountsParams } from '../models/AdminGetDiscountsParams';
import type { AdminPostDiscountsDiscountConditionsCondition } from '../models/AdminPostDiscountsDiscountConditionsCondition';
import type { AdminPostDiscountsDiscountConditionsConditionParams } from '../models/AdminPostDiscountsDiscountConditionsConditionParams';
import type { AdminPostDiscountsDiscountDynamicCodesReq } from '../models/AdminPostDiscountsDiscountDynamicCodesReq';
import type { AdminPostDiscountsDiscountParams } from '../models/AdminPostDiscountsDiscountParams';
import type { AdminPostDiscountsDiscountReq } from '../models/AdminPostDiscountsDiscountReq';
import type { AdminPostDiscountsParams } from '../models/AdminPostDiscountsParams';
import type { AdminPostDiscountsReq } from '../models/AdminPostDiscountsReq';

export const useDiscountList = (
  queryParams: AdminGetDiscountsParams,
  options: UseQueryOptionsWrapper<Awaited<ReturnType<typeof client.discount.list>>> = {}
) => {
  const { client } = useMedusaAdmin()
  const { data, ...rest } = useQuery<Awaited<ReturnType<typeof client.discount.list>>>(
    ['discount', 'list', queryParams],
    () => client.discount.list(queryParams),
    options
  );
  return { ...data, ...rest } as const
};

export const useDiscountCreate = (
  requestBody: AdminPostDiscountsReq,
  queryParams: AdminPostDiscountsParams,
  options: UseMutationOptionsWrapper<Awaited<ReturnType<typeof client.discount.create>>, unknown, AdminPostDiscountsReq> = {}
) => {
  const { client } = useMedusaAdmin()
  if (!options?.onSuccess) {
    const queryClient = useQueryClient()
    options.onSuccess = async () => {
      await queryClient.invalidateQueries('discount')
    }
  }
  return useMutation<Awaited<ReturnType<typeof client.discount.create>>, unknown, AdminPostDiscountsReq>(
    ['discount', 'create', requestBody,queryParams],
    () => client.discount.create(requestBody,queryParams),
    options
  );
};

export const useDiscountRetrieveByCode = (
  code: string,
  queryParams: AdminGetDiscountsDiscountCodeParams,
  options: UseQueryOptionsWrapper<Awaited<ReturnType<typeof client.discount.retrieveByCode>>> = {}
) => {
  const { client } = useMedusaAdmin()
  const { data, ...rest } = useQuery<Awaited<ReturnType<typeof client.discount.retrieveByCode>>>(
    ['discount', 'retrieveByCode', code,queryParams],
    () => client.discount.retrieveByCode(code,queryParams),
    options
  );
  return { ...data, ...rest } as const
};

export const useDiscountUpdateCondition = (
  discountId: string,
  conditionId: string,
  requestBody: AdminPostDiscountsDiscountConditionsCondition,
  queryParams: AdminPostDiscountsDiscountConditionsConditionParams,
  options: UseMutationOptionsWrapper<Awaited<ReturnType<typeof client.discount.updateCondition>>, unknown, AdminPostDiscountsDiscountConditionsCondition> = {}
) => {
  const { client } = useMedusaAdmin()
  if (!options?.onSuccess) {
    const queryClient = useQueryClient()
    options.onSuccess = async () => {
      await queryClient.invalidateQueries('discount')
    }
  }
  return useMutation<Awaited<ReturnType<typeof client.discount.updateCondition>>, unknown, AdminPostDiscountsDiscountConditionsCondition>(
    ['discount', 'updateCondition', discountId,conditionId,requestBody,queryParams],
    () => client.discount.updateCondition(discountId,conditionId,requestBody,queryParams),
    options
  );
};

export const useDiscountRetrieve = (
  id: string,
  queryParams: AdminGetDiscountParams,
  options: UseQueryOptionsWrapper<Awaited<ReturnType<typeof client.discount.retrieve>>> = {}
) => {
  const { client } = useMedusaAdmin()
  const { data, ...rest } = useQuery<Awaited<ReturnType<typeof client.discount.retrieve>>>(
    ['discount', 'retrieve', id,queryParams],
    () => client.discount.retrieve(id,queryParams),
    options
  );
  return { ...data, ...rest } as const
};

export const useDiscountUpdate = (
  id: string,
  requestBody: AdminPostDiscountsDiscountReq,
  queryParams: AdminPostDiscountsDiscountParams,
  options: UseMutationOptionsWrapper<Awaited<ReturnType<typeof client.discount.update>>, unknown, AdminPostDiscountsDiscountReq> = {}
) => {
  const { client } = useMedusaAdmin()
  if (!options?.onSuccess) {
    const queryClient = useQueryClient()
    options.onSuccess = async () => {
      await queryClient.invalidateQueries('discount')
    }
  }
  return useMutation<Awaited<ReturnType<typeof client.discount.update>>, unknown, AdminPostDiscountsDiscountReq>(
    ['discount', 'update', id,requestBody,queryParams],
    () => client.discount.update(id,requestBody,queryParams),
    options
  );
};

export const useDiscountDelete = (
  id: string,
  options: UseMutationOptionsWrapper<Awaited<ReturnType<typeof client.discount.delete>>, unknown, void> = {}
) => {
  const { client } = useMedusaAdmin()
  if (!options?.onSuccess) {
    const queryClient = useQueryClient()
    options.onSuccess = async () => {
      await queryClient.invalidateQueries('discount')
    }
  }
  return useMutation<Awaited<ReturnType<typeof client.discount.delete>>, unknown, void>(
    ['discount', 'delete', id],
    () => client.discount.delete(id),
    options
  );
};

export const useDiscountCreateDynamicCode = (
  id: string,
  requestBody: AdminPostDiscountsDiscountDynamicCodesReq,
  options: UseMutationOptionsWrapper<Awaited<ReturnType<typeof client.discount.createDynamicCode>>, unknown, AdminPostDiscountsDiscountDynamicCodesReq> = {}
) => {
  const { client } = useMedusaAdmin()
  if (!options?.onSuccess) {
    const queryClient = useQueryClient()
    options.onSuccess = async () => {
      await queryClient.invalidateQueries('discount')
    }
  }
  return useMutation<Awaited<ReturnType<typeof client.discount.createDynamicCode>>, unknown, AdminPostDiscountsDiscountDynamicCodesReq>(
    ['discount', 'createDynamicCode', id,requestBody],
    () => client.discount.createDynamicCode(id,requestBody),
    options
  );
};

export const useDiscountDeleteDynamicCode = (
  id: string,
  code: string,
  options: UseMutationOptionsWrapper<Awaited<ReturnType<typeof client.discount.deleteDynamicCode>>, unknown, void> = {}
) => {
  const { client } = useMedusaAdmin()
  if (!options?.onSuccess) {
    const queryClient = useQueryClient()
    options.onSuccess = async () => {
      await queryClient.invalidateQueries('discount')
    }
  }
  return useMutation<Awaited<ReturnType<typeof client.discount.deleteDynamicCode>>, unknown, void>(
    ['discount', 'deleteDynamicCode', id,code],
    () => client.discount.deleteDynamicCode(id,code),
    options
  );
};

export const useDiscountAddRegion = (
  id: string,
  regionId: string,
  options: UseMutationOptionsWrapper<Awaited<ReturnType<typeof client.discount.addRegion>>, unknown, void> = {}
) => {
  const { client } = useMedusaAdmin()
  if (!options?.onSuccess) {
    const queryClient = useQueryClient()
    options.onSuccess = async () => {
      await queryClient.invalidateQueries('discount')
    }
  }
  return useMutation<Awaited<ReturnType<typeof client.discount.addRegion>>, unknown, void>(
    ['discount', 'addRegion', id,regionId],
    () => client.discount.addRegion(id,regionId),
    options
  );
};

export const useDiscountRemoveRegion = (
  id: string,
  regionId: string,
  options: UseMutationOptionsWrapper<Awaited<ReturnType<typeof client.discount.removeRegion>>, unknown, void> = {}
) => {
  const { client } = useMedusaAdmin()
  if (!options?.onSuccess) {
    const queryClient = useQueryClient()
    options.onSuccess = async () => {
      await queryClient.invalidateQueries('discount')
    }
  }
  return useMutation<Awaited<ReturnType<typeof client.discount.removeRegion>>, unknown, void>(
    ['discount', 'removeRegion', id,regionId],
    () => client.discount.removeRegion(id,regionId),
    options
  );
};


