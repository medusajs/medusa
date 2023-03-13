/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { UseQueryOptionsWrapper, UseMutationOptionsWrapper} from '../core/HookUtils';
import { useMedusaAdmin } from '../useMedusaAdmin';
import type { AdminDeleteProductCategoriesCategoryProductsBatchParams } from '@medusajs/client-types';
import type { AdminDeleteProductCategoriesCategoryProductsBatchReq } from '@medusajs/client-types';
import type { AdminGetProductCategoriesParams } from '@medusajs/client-types';
import type { AdminGetProductCategoryParams } from '@medusajs/client-types';
import type { AdminPostProductCategoriesCategoryParams } from '@medusajs/client-types';
import type { AdminPostProductCategoriesCategoryProductsBatchParams } from '@medusajs/client-types';
import type { AdminPostProductCategoriesCategoryProductsBatchReq } from '@medusajs/client-types';
import type { AdminPostProductCategoriesCategoryReq } from '@medusajs/client-types';
import type { AdminPostProductCategoriesParams } from '@medusajs/client-types';
import type { AdminPostProductCategoriesReq } from '@medusajs/client-types';
import type { AdminProductCategoriesCategoryDeleteRes } from '@medusajs/client-types';
import type { AdminProductCategoriesCategoryRes } from '@medusajs/client-types';
import type { AdminProductCategoriesListRes } from '@medusajs/client-types';

const { client } = useMedusaAdmin()

export const useProductCategoriesList = (
  queryParams: AdminGetProductCategoriesParams,
  options: UseQueryOptionsWrapper<Awaited<ReturnType<typeof client.productCategories.list>>> = {}
) => {
  const { data, ...rest } = useQuery<Awaited<ReturnType<typeof client.productCategories.list>>>(
    ['productCategories', 'list', queryParams],
    () => client.productCategories.list(queryParams),
    options
  );
  return { ...data, ...rest } as const
};

export const useProductCategoriesCreate = (
  requestBody: AdminPostProductCategoriesReq,
  queryParams: AdminPostProductCategoriesParams,
  options: UseMutationOptionsWrapper<Awaited<ReturnType<typeof client.productCategories.create>>, unknown, AdminPostProductCategoriesReq> = {}
) => {
  if (!options?.onSuccess) {
    const queryClient = useQueryClient()
    options.onSuccess = async () => {
      await queryClient.invalidateQueries('productCategories')
    }
  }
  return useMutation<Awaited<ReturnType<typeof client.productCategories.create>>, unknown, AdminPostProductCategoriesReq>(
    ['productCategories', 'create', requestBody,queryParams],
    () => client.productCategories.create(requestBody,queryParams),
    options
  );
};

export const useProductCategoriesRetrieve = (
  id: string,
  queryParams: AdminGetProductCategoryParams,
  options: UseQueryOptionsWrapper<Awaited<ReturnType<typeof client.productCategories.retrieve>>> = {}
) => {
  const { data, ...rest } = useQuery<Awaited<ReturnType<typeof client.productCategories.retrieve>>>(
    ['productCategories', 'retrieve', id,queryParams],
    () => client.productCategories.retrieve(id,queryParams),
    options
  );
  return { ...data, ...rest } as const
};

export const useProductCategoriesUpdate = (
  id: string,
  requestBody: AdminPostProductCategoriesCategoryReq,
  queryParams: AdminPostProductCategoriesCategoryParams,
  options: UseMutationOptionsWrapper<Awaited<ReturnType<typeof client.productCategories.update>>, unknown, AdminPostProductCategoriesCategoryReq> = {}
) => {
  if (!options?.onSuccess) {
    const queryClient = useQueryClient()
    options.onSuccess = async () => {
      await queryClient.invalidateQueries('productCategories')
    }
  }
  return useMutation<Awaited<ReturnType<typeof client.productCategories.update>>, unknown, AdminPostProductCategoriesCategoryReq>(
    ['productCategories', 'update', id,requestBody,queryParams],
    () => client.productCategories.update(id,requestBody,queryParams),
    options
  );
};

export const useProductCategoriesDelete = (
  id: string,
  options: UseMutationOptionsWrapper<Awaited<ReturnType<typeof client.productCategories.delete>>, unknown, void> = {}
) => {
  if (!options?.onSuccess) {
    const queryClient = useQueryClient()
    options.onSuccess = async () => {
      await queryClient.invalidateQueries('productCategories')
    }
  }
  return useMutation<Awaited<ReturnType<typeof client.productCategories.delete>>, unknown, void>(
    ['productCategories', 'delete', id],
    () => client.productCategories.delete(id),
    options
  );
};

export const useProductCategoriesAddProducts = (
  id: string,
  requestBody: AdminPostProductCategoriesCategoryProductsBatchReq,
  queryParams: AdminPostProductCategoriesCategoryProductsBatchParams,
  options: UseMutationOptionsWrapper<Awaited<ReturnType<typeof client.productCategories.addProducts>>, unknown, AdminPostProductCategoriesCategoryProductsBatchReq> = {}
) => {
  if (!options?.onSuccess) {
    const queryClient = useQueryClient()
    options.onSuccess = async () => {
      await queryClient.invalidateQueries('productCategories')
    }
  }
  return useMutation<Awaited<ReturnType<typeof client.productCategories.addProducts>>, unknown, AdminPostProductCategoriesCategoryProductsBatchReq>(
    ['productCategories', 'addProducts', id,requestBody,queryParams],
    () => client.productCategories.addProducts(id,requestBody,queryParams),
    options
  );
};

export const useProductCategoriesRemoveProducts = (
  id: string,
  requestBody: AdminDeleteProductCategoriesCategoryProductsBatchReq,
  queryParams: AdminDeleteProductCategoriesCategoryProductsBatchParams,
  options: UseMutationOptionsWrapper<Awaited<ReturnType<typeof client.productCategories.removeProducts>>, unknown, AdminDeleteProductCategoriesCategoryProductsBatchReq> = {}
) => {
  if (!options?.onSuccess) {
    const queryClient = useQueryClient()
    options.onSuccess = async () => {
      await queryClient.invalidateQueries('productCategories')
    }
  }
  return useMutation<Awaited<ReturnType<typeof client.productCategories.removeProducts>>, unknown, AdminDeleteProductCategoriesCategoryProductsBatchReq>(
    ['productCategories', 'removeProducts', id,requestBody,queryParams],
    () => client.productCategories.removeProducts(id,requestBody,queryParams),
    options
  );
};


