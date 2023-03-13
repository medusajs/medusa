/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { UseQueryOptionsWrapper, UseMutationOptionsWrapper} from '../core/HookUtils';
import { useMedusaAdmin } from '../useMedusaAdmin';
import type { AdminDeletePriceListPricesPricesReq } from '@medusajs/client-types';
import type { AdminGetPriceListPaginationParams } from '@medusajs/client-types';
import type { AdminGetPriceListsPriceListProductsParams } from '@medusajs/client-types';
import type { AdminPostPriceListPricesPricesReq } from '@medusajs/client-types';
import type { AdminPostPriceListsPriceListPriceListReq } from '@medusajs/client-types';
import type { AdminPostPriceListsPriceListReq } from '@medusajs/client-types';
import type { AdminPriceListDeleteBatchRes } from '@medusajs/client-types';
import type { AdminPriceListDeleteProductPricesRes } from '@medusajs/client-types';
import type { AdminPriceListDeleteRes } from '@medusajs/client-types';
import type { AdminPriceListDeleteVariantPricesRes } from '@medusajs/client-types';
import type { AdminPriceListRes } from '@medusajs/client-types';
import type { AdminPriceListsListRes } from '@medusajs/client-types';
import type { AdminPriceListsProductsListRes } from '@medusajs/client-types';

const { client } = useMedusaAdmin()

export const usePriceListsList = (
  queryParams: AdminGetPriceListPaginationParams,
  options: UseQueryOptionsWrapper<Awaited<ReturnType<typeof client.priceLists.list>>> = {}
) => {
  const { data, ...rest } = useQuery<Awaited<ReturnType<typeof client.priceLists.list>>>(
    ['priceLists', 'list', queryParams],
    () => client.priceLists.list(queryParams),
    options
  );
  return { ...data, ...rest } as const
};

export const usePriceListsCreate = (
  requestBody: AdminPostPriceListsPriceListReq,
  options: UseMutationOptionsWrapper<Awaited<ReturnType<typeof client.priceLists.create>>, unknown, AdminPostPriceListsPriceListReq> = {}
) => {
  if (!options?.onSuccess) {
    const queryClient = useQueryClient()
    options.onSuccess = async () => {
      await queryClient.invalidateQueries('priceLists')
    }
  }
  return useMutation<Awaited<ReturnType<typeof client.priceLists.create>>, unknown, AdminPostPriceListsPriceListReq>(
    ['priceLists', 'create', requestBody],
    () => client.priceLists.create(requestBody),
    options
  );
};

export const usePriceListsRetrieve = (
  id: string,
  options: UseQueryOptionsWrapper<Awaited<ReturnType<typeof client.priceLists.retrieve>>> = {}
) => {
  const { data, ...rest } = useQuery<Awaited<ReturnType<typeof client.priceLists.retrieve>>>(
    ['priceLists', 'retrieve', id],
    () => client.priceLists.retrieve(id),
    options
  );
  return { ...data, ...rest } as const
};

export const usePriceListsUpdate = (
  id: string,
  requestBody: AdminPostPriceListsPriceListPriceListReq,
  options: UseMutationOptionsWrapper<Awaited<ReturnType<typeof client.priceLists.update>>, unknown, AdminPostPriceListsPriceListPriceListReq> = {}
) => {
  if (!options?.onSuccess) {
    const queryClient = useQueryClient()
    options.onSuccess = async () => {
      await queryClient.invalidateQueries('priceLists')
    }
  }
  return useMutation<Awaited<ReturnType<typeof client.priceLists.update>>, unknown, AdminPostPriceListsPriceListPriceListReq>(
    ['priceLists', 'update', id,requestBody],
    () => client.priceLists.update(id,requestBody),
    options
  );
};

export const usePriceListsDelete = (
  id: string,
  options: UseMutationOptionsWrapper<Awaited<ReturnType<typeof client.priceLists.delete>>, unknown, void> = {}
) => {
  if (!options?.onSuccess) {
    const queryClient = useQueryClient()
    options.onSuccess = async () => {
      await queryClient.invalidateQueries('priceLists')
    }
  }
  return useMutation<Awaited<ReturnType<typeof client.priceLists.delete>>, unknown, void>(
    ['priceLists', 'delete', id],
    () => client.priceLists.delete(id),
    options
  );
};

export const usePriceListsAddPrices = (
  id: string,
  requestBody: AdminPostPriceListPricesPricesReq,
  options: UseMutationOptionsWrapper<Awaited<ReturnType<typeof client.priceLists.addPrices>>, unknown, AdminPostPriceListPricesPricesReq> = {}
) => {
  if (!options?.onSuccess) {
    const queryClient = useQueryClient()
    options.onSuccess = async () => {
      await queryClient.invalidateQueries('priceLists')
    }
  }
  return useMutation<Awaited<ReturnType<typeof client.priceLists.addPrices>>, unknown, AdminPostPriceListPricesPricesReq>(
    ['priceLists', 'addPrices', id,requestBody],
    () => client.priceLists.addPrices(id,requestBody),
    options
  );
};

export const usePriceListsDeletePrices = (
  id: string,
  requestBody: AdminDeletePriceListPricesPricesReq,
  options: UseMutationOptionsWrapper<Awaited<ReturnType<typeof client.priceLists.deletePrices>>, unknown, AdminDeletePriceListPricesPricesReq> = {}
) => {
  if (!options?.onSuccess) {
    const queryClient = useQueryClient()
    options.onSuccess = async () => {
      await queryClient.invalidateQueries('priceLists')
    }
  }
  return useMutation<Awaited<ReturnType<typeof client.priceLists.deletePrices>>, unknown, AdminDeletePriceListPricesPricesReq>(
    ['priceLists', 'deletePrices', id,requestBody],
    () => client.priceLists.deletePrices(id,requestBody),
    options
  );
};

export const usePriceListsListProducts = (
  id: string,
  queryParams: AdminGetPriceListsPriceListProductsParams,
  options: UseQueryOptionsWrapper<Awaited<ReturnType<typeof client.priceLists.listProducts>>> = {}
) => {
  const { data, ...rest } = useQuery<Awaited<ReturnType<typeof client.priceLists.listProducts>>>(
    ['priceLists', 'listProducts', id,queryParams],
    () => client.priceLists.listProducts(id,queryParams),
    options
  );
  return { ...data, ...rest } as const
};

export const usePriceListsDeleteProductPrices = (
  id: string,
  productId: string,
  options: UseMutationOptionsWrapper<Awaited<ReturnType<typeof client.priceLists.deleteProductPrices>>, unknown, void> = {}
) => {
  if (!options?.onSuccess) {
    const queryClient = useQueryClient()
    options.onSuccess = async () => {
      await queryClient.invalidateQueries('priceLists')
    }
  }
  return useMutation<Awaited<ReturnType<typeof client.priceLists.deleteProductPrices>>, unknown, void>(
    ['priceLists', 'deleteProductPrices', id,productId],
    () => client.priceLists.deleteProductPrices(id,productId),
    options
  );
};

export const usePriceListsDeleteVariantPrices = (
  id: string,
  variantId: string,
  options: UseMutationOptionsWrapper<Awaited<ReturnType<typeof client.priceLists.deleteVariantPrices>>, unknown, void> = {}
) => {
  if (!options?.onSuccess) {
    const queryClient = useQueryClient()
    options.onSuccess = async () => {
      await queryClient.invalidateQueries('priceLists')
    }
  }
  return useMutation<Awaited<ReturnType<typeof client.priceLists.deleteVariantPrices>>, unknown, void>(
    ['priceLists', 'deleteVariantPrices', id,variantId],
    () => client.priceLists.deleteVariantPrices(id,variantId),
    options
  );
};


