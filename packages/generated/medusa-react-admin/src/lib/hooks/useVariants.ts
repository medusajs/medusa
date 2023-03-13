/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { UseQueryOptionsWrapper, UseMutationOptionsWrapper} from '../core/HookUtils';
import { useMedusaAdmin } from '../useMedusaAdmin';
import type { AdminGetVariantsParams } from '@medusajs/client-types';
import type { AdminGetVariantsVariantInventoryRes } from '@medusajs/client-types';
import type { AdminVariantsListRes } from '@medusajs/client-types';

const { client } = useMedusaAdmin()

export const useVariantsList = (
  queryParams: AdminGetVariantsParams,
  options: UseQueryOptionsWrapper<Awaited<ReturnType<typeof client.variants.list>>> = {}
) => {
  const { data, ...rest } = useQuery<Awaited<ReturnType<typeof client.variants.list>>>(
    ['variants', 'list', queryParams],
    () => client.variants.list(queryParams),
    options
  );
  return { ...data, ...rest } as const
};

export const useVariantsGetInventory = (
  id: string,
  options: UseQueryOptionsWrapper<Awaited<ReturnType<typeof client.variants.getInventory>>> = {}
) => {
  const { data, ...rest } = useQuery<Awaited<ReturnType<typeof client.variants.getInventory>>>(
    ['variants', 'getInventory', id],
    () => client.variants.getInventory(id),
    options
  );
  return { ...data, ...rest } as const
};


