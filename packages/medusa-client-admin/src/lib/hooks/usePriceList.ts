/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { UseQueryOptionsWrapper, UseMutationOptionsWrapper} from '../core/HookUtils';
import { useMedusaAdmin } from '../useMedusaAdmin';
import type { AdminDeletePriceListPricesPricesReq } from '../models/AdminDeletePriceListPricesPricesReq';
import type { AdminGetPriceListPaginationParams } from '../models/AdminGetPriceListPaginationParams';
import type { AdminGetPriceListsPriceListProductsParams } from '../models/AdminGetPriceListsPriceListProductsParams';
import type { AdminPostPriceListPricesPricesReq } from '../models/AdminPostPriceListPricesPricesReq';
import type { AdminPostPriceListsPriceListPriceListReq } from '../models/AdminPostPriceListsPriceListPriceListReq';
import type { AdminPostPriceListsPriceListReq } from '../models/AdminPostPriceListsPriceListReq';
import type { AdminPriceListDeleteBatchRes } from '../models/AdminPriceListDeleteBatchRes';
import type { AdminPriceListDeleteProductPricesRes } from '../models/AdminPriceListDeleteProductPricesRes';
import type { AdminPriceListDeleteRes } from '../models/AdminPriceListDeleteRes';
import type { AdminPriceListDeleteVariantPricesRes } from '../models/AdminPriceListDeleteVariantPricesRes';
import type { AdminPriceListRes } from '../models/AdminPriceListRes';
import type { AdminPriceListsListRes } from '../models/AdminPriceListsListRes';
import type { AdminPriceListsProductsListRes } from '../models/AdminPriceListsProductsListRes';

const { client } = useMedusaAdmin()

export const usePriceListList = (
  queryParams: AdminGetPriceListPaginationParams,
  options: UseQueryOptionsWrapper<Awaited<ReturnType<typeof client.priceList.list>>> = {}
) => {
  const { data, ...rest } = useQuery<Awaited<ReturnType<typeof client.priceList.list>>>(
    ['priceList', 'list', queryParams],
    () => client.priceList.list(queryParams),
    options
  );
  return { ...data, ...rest } as const
};

export const usePriceListCreate = (
  requestBody: AdminPostPriceListsPriceListReq,
  options: UseMutationOptionsWrapper<Awaited<ReturnType<typeof client.priceList.create>>, unknown, AdminPostPriceListsPriceListReq> = {}
) => {
  if (!options?.onSuccess) {
    const queryClient = useQueryClient()
    options.onSuccess = async () => {
      await queryClient.invalidateQueries('priceList')
    }
  }
  return useMutation<Awaited<ReturnType<typeof client.priceList.create>>, unknown, AdminPostPriceListsPriceListReq>(
    ['priceList', 'create', requestBody],
    () => client.priceList.create(requestBody),
    options
  );
};

export const usePriceListRetrieve = (
  id: string,
  options: UseQueryOptionsWrapper<Awaited<ReturnType<typeof client.priceList.retrieve>>> = {}
) => {
  const { data, ...rest } = useQuery<Awaited<ReturnType<typeof client.priceList.retrieve>>>(
    ['priceList', 'retrieve', id],
    () => client.priceList.retrieve(id),
    options
  );
  return { ...data, ...rest } as const
};

export const usePriceListUpdate = (
  id: string,
  requestBody: AdminPostPriceListsPriceListPriceListReq,
  options: UseMutationOptionsWrapper<Awaited<ReturnType<typeof client.priceList.update>>, unknown, AdminPostPriceListsPriceListPriceListReq> = {}
) => {
  if (!options?.onSuccess) {
    const queryClient = useQueryClient()
    options.onSuccess = async () => {
      await queryClient.invalidateQueries('priceList')
    }
  }
  return useMutation<Awaited<ReturnType<typeof client.priceList.update>>, unknown, AdminPostPriceListsPriceListPriceListReq>(
    ['priceList', 'update', id,requestBody],
    () => client.priceList.update(id,requestBody),
    options
  );
};

export const usePriceListDelete = (
  id: string,
  options: UseMutationOptionsWrapper<Awaited<ReturnType<typeof client.priceList.delete>>, unknown, void> = {}
) => {
  if (!options?.onSuccess) {
    const queryClient = useQueryClient()
    options.onSuccess = async () => {
      await queryClient.invalidateQueries('priceList')
    }
  }
  return useMutation<Awaited<ReturnType<typeof client.priceList.delete>>, unknown, void>(
    ['priceList', 'delete', id],
    () => client.priceList.delete(id),
    options
  );
};

export const usePriceListAddPrices = (
  id: string,
  requestBody: AdminPostPriceListPricesPricesReq,
  options: UseMutationOptionsWrapper<Awaited<ReturnType<typeof client.priceList.addPrices>>, unknown, AdminPostPriceListPricesPricesReq> = {}
) => {
  if (!options?.onSuccess) {
    const queryClient = useQueryClient()
    options.onSuccess = async () => {
      await queryClient.invalidateQueries('priceList')
    }
  }
  return useMutation<Awaited<ReturnType<typeof client.priceList.addPrices>>, unknown, AdminPostPriceListPricesPricesReq>(
    ['priceList', 'addPrices', id,requestBody],
    () => client.priceList.addPrices(id,requestBody),
    options
  );
};

export const usePriceListDeletePrices = (
  id: string,
  requestBody: AdminDeletePriceListPricesPricesReq,
  options: UseMutationOptionsWrapper<Awaited<ReturnType<typeof client.priceList.deletePrices>>, unknown, AdminDeletePriceListPricesPricesReq> = {}
) => {
  if (!options?.onSuccess) {
    const queryClient = useQueryClient()
    options.onSuccess = async () => {
      await queryClient.invalidateQueries('priceList')
    }
  }
  return useMutation<Awaited<ReturnType<typeof client.priceList.deletePrices>>, unknown, AdminDeletePriceListPricesPricesReq>(
    ['priceList', 'deletePrices', id,requestBody],
    () => client.priceList.deletePrices(id,requestBody),
    options
  );
};

export const usePriceListDeleteProductPrices = (
  id: string,
  productId: string,
  options: UseMutationOptionsWrapper<Awaited<ReturnType<typeof client.priceList.deleteProductPrices>>, unknown, void> = {}
) => {
  if (!options?.onSuccess) {
    const queryClient = useQueryClient()
    options.onSuccess = async () => {
      await queryClient.invalidateQueries('priceList')
    }
  }
  return useMutation<Awaited<ReturnType<typeof client.priceList.deleteProductPrices>>, unknown, void>(
    ['priceList', 'deleteProductPrices', id,productId],
    () => client.priceList.deleteProductPrices(id,productId),
    options
  );
};

export const usePriceListDeleteVariantPrices = (
  id: string,
  variantId: string,
  options: UseMutationOptionsWrapper<Awaited<ReturnType<typeof client.priceList.deleteVariantPrices>>, unknown, void> = {}
) => {
  if (!options?.onSuccess) {
    const queryClient = useQueryClient()
    options.onSuccess = async () => {
      await queryClient.invalidateQueries('priceList')
    }
  }
  return useMutation<Awaited<ReturnType<typeof client.priceList.deleteVariantPrices>>, unknown, void>(
    ['priceList', 'deleteVariantPrices', id,variantId],
    () => client.priceList.deleteVariantPrices(id,variantId),
    options
  );
};

export const usePriceListListProducts = (
  pid: string,
  queryParams: AdminGetPriceListsPriceListProductsParams,
  options: UseQueryOptionsWrapper<Awaited<ReturnType<typeof client.priceList.listProducts>>> = {}
) => {
  const { data, ...rest } = useQuery<Awaited<ReturnType<typeof client.priceList.listProducts>>>(
    ['priceList', 'listProducts', pid,queryParams],
    () => client.priceList.listProducts(pid,queryParams),
    options
  );
  return { ...data, ...rest } as const
};


