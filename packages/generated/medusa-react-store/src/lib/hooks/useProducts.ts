/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { UseQueryOptionsWrapper, UseMutationOptionsWrapper} from '../core/HookUtils';
import { useMedusaStore } from '../useMedusaStore';
import type { StoreGetProductsParams } from '@medusajs/client-types';
import type { StoreGetProductsProductParams } from '@medusajs/client-types';
import type { StorePostSearchReq } from '@medusajs/client-types';
import type { StorePostSearchRes } from '@medusajs/client-types';
import type { StoreProductsListRes } from '@medusajs/client-types';
import type { StoreProductsRes } from '@medusajs/client-types';

const { client } = useMedusaStore()

export const useProductsList = (
  queryParams: StoreGetProductsParams,
  options: UseQueryOptionsWrapper<Awaited<ReturnType<typeof client.products.list>>> = {}
) => {
  const { data, ...rest } = useQuery<Awaited<ReturnType<typeof client.products.list>>>(
    ['products', 'list', queryParams],
    () => client.products.list(queryParams),
    options
  );
  return { ...data, ...rest } as const
};

export const useProductsSearch = (
  queryParams: StorePostSearchReq,
  options: UseMutationOptionsWrapper<Awaited<ReturnType<typeof client.products.search>>, unknown, void> = {}
) => {
  if (!options?.onSuccess) {
    const queryClient = useQueryClient()
    options.onSuccess = async () => {
      await queryClient.invalidateQueries('products')
    }
  }
  return useMutation<Awaited<ReturnType<typeof client.products.search>>, unknown, void>(
    ['products', 'search', queryParams],
    () => client.products.search(queryParams),
    options
  );
};

export const useProductsRetrieve = (
  id: string,
  queryParams: StoreGetProductsProductParams,
  options: UseQueryOptionsWrapper<Awaited<ReturnType<typeof client.products.retrieve>>> = {}
) => {
  const { data, ...rest } = useQuery<Awaited<ReturnType<typeof client.products.retrieve>>>(
    ['products', 'retrieve', id,queryParams],
    () => client.products.retrieve(id,queryParams),
    options
  );
  return { ...data, ...rest } as const
};


