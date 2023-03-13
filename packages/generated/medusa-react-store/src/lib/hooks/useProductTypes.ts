/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { UseQueryOptionsWrapper, UseMutationOptionsWrapper} from '../core/HookUtils';
import { useMedusaStore } from '../useMedusaStore';
import type { StoreGetProductTypesParams } from '@medusajs/client-types';
import type { StoreProductTypesListRes } from '@medusajs/client-types';

const { client } = useMedusaStore()

export const useProductTypesList = (
  queryParams: StoreGetProductTypesParams,
  options: UseQueryOptionsWrapper<Awaited<ReturnType<typeof client.productTypes.list>>> = {}
) => {
  const { data, ...rest } = useQuery<Awaited<ReturnType<typeof client.productTypes.list>>>(
    ['productTypes', 'list', queryParams],
    () => client.productTypes.list(queryParams),
    options
  );
  return { ...data, ...rest } as const
};


