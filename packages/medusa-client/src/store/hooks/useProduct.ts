/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { UseQueryOptionsWrapper, UseMutationOptionsWrapper} from '../core/HookUtils';
import { useMedusaStore } from '../useMedusaStore';
import type { StoreGetProductsParams } from '../models/StoreGetProductsParams';
import type { StorePostSearchReq } from '../models/StorePostSearchReq';
import type { StorePostSearchRes } from '../models/StorePostSearchRes';
import type { StoreProductsListRes } from '../models/StoreProductsListRes';
import type { StoreProductsRes } from '../models/StoreProductsRes';

export const useProductList = (
  queryParams: StoreGetProductsParams,
  options: UseQueryOptionsWrapper<Awaited<ReturnType<typeof client.product.list>>> = {}
) => {
  const { client } = useMedusaStore()
  const { data, ...rest } = useQuery<Awaited<ReturnType<typeof client.product.list>>>(
    ['product', 'list', queryParams],
    () => client.product.list(queryParams),
    options
  );
  return { ...data, ...rest } as const
};

export const useProductSearch = (
  queryParams: StorePostSearchReq,
  options: UseMutationOptionsWrapper<Awaited<ReturnType<typeof client.product.search>>, unknown, void> = {}
) => {
  const { client } = useMedusaStore()
  if (!options?.onSuccess) {
    const queryClient = useQueryClient()
    options.onSuccess = async () => {
      await queryClient.invalidateQueries('product')
    }
  }
  return useMutation<Awaited<ReturnType<typeof client.product.search>>, unknown, void>(
    ['product', 'search', queryParams],
    () => client.product.search(queryParams),
    options
  );
};

export const useProductRetrieve = (
  id: string,
  queryParams: {
    /**
     * The ID of the customer's cart.
     */
    cartId?: string,
    /**
     * The ID of the region the customer is using. This is helpful to ensure correct prices are retrieved for a region.
     */
    regionId?: string,
    /**
     * The 3 character ISO currency code to set prices based on. This is helpful to ensure correct prices are retrieved for a currency.
     */
    currencyCode?: string,
  },
  options: UseQueryOptionsWrapper<Awaited<ReturnType<typeof client.product.retrieve>>> = {}
) => {
  const { client } = useMedusaStore()
  const { data, ...rest } = useQuery<Awaited<ReturnType<typeof client.product.retrieve>>>(
    ['product', 'retrieve', id,queryParams],
    () => client.product.retrieve(id,queryParams),
    options
  );
  return { ...data, ...rest } as const
};


