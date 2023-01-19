/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { UseQueryOptionsWrapper, UseMutationOptionsWrapper} from '../core/HookUtils';
import { useMedusaAdmin } from '../useMedusaAdmin';
import type { AdminGetProductCategoriesParams } from '../models/AdminGetProductCategoriesParams';
import type { AdminGetProductCategoryParams } from '../models/AdminGetProductCategoryParams';
import type { AdminPostProductCategoriesCategoryParams } from '../models/AdminPostProductCategoriesCategoryParams';
import type { AdminPostProductCategoriesCategoryReq } from '../models/AdminPostProductCategoriesCategoryReq';
import type { AdminPostProductCategoriesReq } from '../models/AdminPostProductCategoriesReq';
import type { ProductCategory } from '../models/ProductCategory';

const { client } = useMedusaAdmin()

export const useProductCategoryList = (
  queryParams: AdminGetProductCategoriesParams,
  options: UseQueryOptionsWrapper<Awaited<ReturnType<typeof client.productCategory.list>>> = {}
) => {
  const { data, ...rest } = useQuery<Awaited<ReturnType<typeof client.productCategory.list>>>(
    ['productCategory', 'list', queryParams],
    () => client.productCategory.list(queryParams),
    options
  );
  return { ...data, ...rest } as const
};

export const useProductCategoryCreate = (
  requestBody: AdminPostProductCategoriesReq,
  queryParams: {
    /**
     * (Comma separated) Which fields should be expanded in the results.
     */
    expand?: string,
    /**
     * (Comma separated) Which fields should be retrieved in the results.
     */
    fields?: string,
  },
  options: UseMutationOptionsWrapper<Awaited<ReturnType<typeof client.productCategory.create>>, unknown, AdminPostProductCategoriesReq> = {}
) => {
  if (!options?.onSuccess) {
    const queryClient = useQueryClient()
    options.onSuccess = async () => {
      await queryClient.invalidateQueries('productCategory')
    }
  }
  return useMutation<Awaited<ReturnType<typeof client.productCategory.create>>, unknown, AdminPostProductCategoriesReq>(
    ['productCategory', 'create', requestBody,queryParams],
    () => client.productCategory.create(requestBody,queryParams),
    options
  );
};

export const useProductCategoryRetrieve = (
  id: string,
  queryParams: AdminGetProductCategoryParams,
  options: UseQueryOptionsWrapper<Awaited<ReturnType<typeof client.productCategory.retrieve>>> = {}
) => {
  const { data, ...rest } = useQuery<Awaited<ReturnType<typeof client.productCategory.retrieve>>>(
    ['productCategory', 'retrieve', id,queryParams],
    () => client.productCategory.retrieve(id,queryParams),
    options
  );
  return { ...data, ...rest } as const
};

export const useProductCategoryUpdate = (
  id: string,
  requestBody: AdminPostProductCategoriesCategoryReq,
  queryParams: AdminPostProductCategoriesCategoryParams,
  options: UseMutationOptionsWrapper<Awaited<ReturnType<typeof client.productCategory.update>>, unknown, AdminPostProductCategoriesCategoryReq> = {}
) => {
  if (!options?.onSuccess) {
    const queryClient = useQueryClient()
    options.onSuccess = async () => {
      await queryClient.invalidateQueries('productCategory')
    }
  }
  return useMutation<Awaited<ReturnType<typeof client.productCategory.update>>, unknown, AdminPostProductCategoriesCategoryReq>(
    ['productCategory', 'update', id,requestBody,queryParams],
    () => client.productCategory.update(id,requestBody,queryParams),
    options
  );
};

export const useProductCategoryDelete = (
  id: string,
  options: UseMutationOptionsWrapper<Awaited<ReturnType<typeof client.productCategory.delete>>, unknown, void> = {}
) => {
  if (!options?.onSuccess) {
    const queryClient = useQueryClient()
    options.onSuccess = async () => {
      await queryClient.invalidateQueries('productCategory')
    }
  }
  return useMutation<Awaited<ReturnType<typeof client.productCategory.delete>>, unknown, void>(
    ['productCategory', 'delete', id],
    () => client.productCategory.delete(id),
    options
  );
};


