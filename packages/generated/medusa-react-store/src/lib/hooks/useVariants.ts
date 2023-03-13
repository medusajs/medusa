/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { UseQueryOptionsWrapper, UseMutationOptionsWrapper} from '../core/HookUtils';
import { useMedusaStore } from '../useMedusaStore';
import type { StoreGetVariantsParams } from '@medusajs/client-types';
import type { StoreGetVariantsVariantParams } from '@medusajs/client-types';
import type { StoreVariantsListRes } from '@medusajs/client-types';
import type { StoreVariantsRes } from '@medusajs/client-types';

const { client } = useMedusaStore()

export const useVariantsList = (
  queryParams: StoreGetVariantsParams,
  options: UseQueryOptionsWrapper<Awaited<ReturnType<typeof client.variants.list>>> = {}
) => {
  const { data, ...rest } = useQuery<Awaited<ReturnType<typeof client.variants.list>>>(
    ['variants', 'list', queryParams],
    () => client.variants.list(queryParams),
    options
  );
  return { ...data, ...rest } as const
};

export const useVariantsRetrieve = (
  variantId: string,
  queryParams: StoreGetVariantsVariantParams,
  options: UseQueryOptionsWrapper<Awaited<ReturnType<typeof client.variants.retrieve>>> = {}
) => {
  const { data, ...rest } = useQuery<Awaited<ReturnType<typeof client.variants.retrieve>>>(
    ['variants', 'retrieve', variantId,queryParams],
    () => client.variants.retrieve(variantId,queryParams),
    options
  );
  return { ...data, ...rest } as const
};


