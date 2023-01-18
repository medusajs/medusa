/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { UseQueryOptionsWrapper, UseMutationOptionsWrapper} from '../core/HookUtils';
import { useMedusaStore } from '../useMedusaStore';
import type { ProductCategory } from '../models/ProductCategory';
import type { StoreGetProductCategoriesParams } from '../models/StoreGetProductCategoriesParams';
import type { StoreGetProductCategoryParams } from '../models/StoreGetProductCategoryParams';
import type { StoreGetProductCategoryRes } from '../models/StoreGetProductCategoryRes';

export const useProductCategoryList = (
  queryParams: StoreGetProductCategoriesParams,
  options: UseQueryOptionsWrapper<Awaited<ReturnType<typeof client.productCategory.list>>> = {}
) => {
  const { client } = useMedusaStore()
  const { data, ...rest } = useQuery<Awaited<ReturnType<typeof client.productCategory.list>>>(
    ['productCategory', 'list', queryParams],
    () => client.productCategory.list(queryParams),
    options
  );
  return { ...data, ...rest } as const
};

export const useProductCategoryRetrieve = (
  id: string,
  queryParams: StoreGetProductCategoryParams,
  options: UseQueryOptionsWrapper<Awaited<ReturnType<typeof client.productCategory.retrieve>>> = {}
) => {
  const { client } = useMedusaStore()
  const { data, ...rest } = useQuery<Awaited<ReturnType<typeof client.productCategory.retrieve>>>(
    ['productCategory', 'retrieve', id,queryParams],
    () => client.productCategory.retrieve(id,queryParams),
    options
  );
  return { ...data, ...rest } as const
};


