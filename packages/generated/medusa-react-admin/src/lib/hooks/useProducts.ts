/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { UseQueryOptionsWrapper, UseMutationOptionsWrapper} from '../core/HookUtils';
import { useMedusaAdmin } from '../useMedusaAdmin';
import type { AdminGetProductsParams } from '@medusajs/client-types';
import type { AdminGetProductsVariantsParams } from '@medusajs/client-types';
import type { AdminGetVariantParams } from '@medusajs/client-types';
import type { AdminPostProductsProductMetadataReq } from '@medusajs/client-types';
import type { AdminPostProductsProductOptionsOption } from '@medusajs/client-types';
import type { AdminPostProductsProductOptionsReq } from '@medusajs/client-types';
import type { AdminPostProductsProductReq } from '@medusajs/client-types';
import type { AdminPostProductsProductVariantsReq } from '@medusajs/client-types';
import type { AdminPostProductsProductVariantsVariantReq } from '@medusajs/client-types';
import type { AdminPostProductsReq } from '@medusajs/client-types';
import type { AdminProductsDeleteOptionRes } from '@medusajs/client-types';
import type { AdminProductsDeleteRes } from '@medusajs/client-types';
import type { AdminProductsDeleteVariantRes } from '@medusajs/client-types';
import type { AdminProductsListRes } from '@medusajs/client-types';
import type { AdminProductsListTagsRes } from '@medusajs/client-types';
import type { AdminProductsListTypesRes } from '@medusajs/client-types';
import type { AdminProductsListVariantsRes } from '@medusajs/client-types';
import type { AdminProductsRes } from '@medusajs/client-types';
import type { AdminVariantsRes } from '@medusajs/client-types';

const { client } = useMedusaAdmin()

export const useProductsList = (
  queryParams: AdminGetProductsParams,
  options: UseQueryOptionsWrapper<Awaited<ReturnType<typeof client.products.list>>> = {}
) => {
  const { data, ...rest } = useQuery<Awaited<ReturnType<typeof client.products.list>>>(
    ['products', 'list', queryParams],
    () => client.products.list(queryParams),
    options
  );
  return { ...data, ...rest } as const
};

export const useProductsCreate = (
  requestBody: AdminPostProductsReq,
  options: UseMutationOptionsWrapper<Awaited<ReturnType<typeof client.products.create>>, unknown, AdminPostProductsReq> = {}
) => {
  if (!options?.onSuccess) {
    const queryClient = useQueryClient()
    options.onSuccess = async () => {
      await queryClient.invalidateQueries('products')
    }
  }
  return useMutation<Awaited<ReturnType<typeof client.products.create>>, unknown, AdminPostProductsReq>(
    ['products', 'create', requestBody],
    () => client.products.create(requestBody),
    options
  );
};

export const useProductsListTags = (
  options: UseQueryOptionsWrapper<Awaited<ReturnType<typeof client.products.listTags>>> = {}
) => {
  const { data, ...rest } = useQuery<Awaited<ReturnType<typeof client.products.listTags>>>(
    ['products', 'listTags'],
    () => client.products.listTags(),
    options
  );
  return { ...data, ...rest } as const
};

export const useProductsListTypes = (
  options: UseQueryOptionsWrapper<Awaited<ReturnType<typeof client.products.listTypes>>> = {}
) => {
  const { data, ...rest } = useQuery<Awaited<ReturnType<typeof client.products.listTypes>>>(
    ['products', 'listTypes'],
    () => client.products.listTypes(),
    options
  );
  return { ...data, ...rest } as const
};

export const useProductsRetrieve = (
  id: string,
  options: UseQueryOptionsWrapper<Awaited<ReturnType<typeof client.products.retrieve>>> = {}
) => {
  const { data, ...rest } = useQuery<Awaited<ReturnType<typeof client.products.retrieve>>>(
    ['products', 'retrieve', id],
    () => client.products.retrieve(id),
    options
  );
  return { ...data, ...rest } as const
};

export const useProductsUpdate = (
  id: string,
  requestBody: AdminPostProductsProductReq,
  options: UseMutationOptionsWrapper<Awaited<ReturnType<typeof client.products.update>>, unknown, AdminPostProductsProductReq> = {}
) => {
  if (!options?.onSuccess) {
    const queryClient = useQueryClient()
    options.onSuccess = async () => {
      await queryClient.invalidateQueries('products')
    }
  }
  return useMutation<Awaited<ReturnType<typeof client.products.update>>, unknown, AdminPostProductsProductReq>(
    ['products', 'update', id,requestBody],
    () => client.products.update(id,requestBody),
    options
  );
};

export const useProductsDelete = (
  id: string,
  options: UseMutationOptionsWrapper<Awaited<ReturnType<typeof client.products.delete>>, unknown, void> = {}
) => {
  if (!options?.onSuccess) {
    const queryClient = useQueryClient()
    options.onSuccess = async () => {
      await queryClient.invalidateQueries('products')
    }
  }
  return useMutation<Awaited<ReturnType<typeof client.products.delete>>, unknown, void>(
    ['products', 'delete', id],
    () => client.products.delete(id),
    options
  );
};

export const useProductsSetMetadata = (
  id: string,
  requestBody: AdminPostProductsProductMetadataReq,
  options: UseMutationOptionsWrapper<Awaited<ReturnType<typeof client.products.setMetadata>>, unknown, AdminPostProductsProductMetadataReq> = {}
) => {
  if (!options?.onSuccess) {
    const queryClient = useQueryClient()
    options.onSuccess = async () => {
      await queryClient.invalidateQueries('products')
    }
  }
  return useMutation<Awaited<ReturnType<typeof client.products.setMetadata>>, unknown, AdminPostProductsProductMetadataReq>(
    ['products', 'setMetadata', id,requestBody],
    () => client.products.setMetadata(id,requestBody),
    options
  );
};

export const useProductsAddOption = (
  id: string,
  requestBody: AdminPostProductsProductOptionsReq,
  options: UseMutationOptionsWrapper<Awaited<ReturnType<typeof client.products.addOption>>, unknown, AdminPostProductsProductOptionsReq> = {}
) => {
  if (!options?.onSuccess) {
    const queryClient = useQueryClient()
    options.onSuccess = async () => {
      await queryClient.invalidateQueries('products')
    }
  }
  return useMutation<Awaited<ReturnType<typeof client.products.addOption>>, unknown, AdminPostProductsProductOptionsReq>(
    ['products', 'addOption', id,requestBody],
    () => client.products.addOption(id,requestBody),
    options
  );
};

export const useProductsUpdateOption = (
  id: string,
  optionId: string,
  requestBody: AdminPostProductsProductOptionsOption,
  options: UseMutationOptionsWrapper<Awaited<ReturnType<typeof client.products.updateOption>>, unknown, AdminPostProductsProductOptionsOption> = {}
) => {
  if (!options?.onSuccess) {
    const queryClient = useQueryClient()
    options.onSuccess = async () => {
      await queryClient.invalidateQueries('products')
    }
  }
  return useMutation<Awaited<ReturnType<typeof client.products.updateOption>>, unknown, AdminPostProductsProductOptionsOption>(
    ['products', 'updateOption', id,optionId,requestBody],
    () => client.products.updateOption(id,optionId,requestBody),
    options
  );
};

export const useProductsDeleteOption = (
  id: string,
  optionId: string,
  options: UseMutationOptionsWrapper<Awaited<ReturnType<typeof client.products.deleteOption>>, unknown, void> = {}
) => {
  if (!options?.onSuccess) {
    const queryClient = useQueryClient()
    options.onSuccess = async () => {
      await queryClient.invalidateQueries('products')
    }
  }
  return useMutation<Awaited<ReturnType<typeof client.products.deleteOption>>, unknown, void>(
    ['products', 'deleteOption', id,optionId],
    () => client.products.deleteOption(id,optionId),
    options
  );
};

export const useProductsListVariants = (
  id: string,
  queryParams: AdminGetProductsVariantsParams,
  options: UseQueryOptionsWrapper<Awaited<ReturnType<typeof client.products.listVariants>>> = {}
) => {
  const { data, ...rest } = useQuery<Awaited<ReturnType<typeof client.products.listVariants>>>(
    ['products', 'listVariants', id,queryParams],
    () => client.products.listVariants(id,queryParams),
    options
  );
  return { ...data, ...rest } as const
};

export const useProductsCreateVariant = (
  id: string,
  requestBody: AdminPostProductsProductVariantsReq,
  options: UseMutationOptionsWrapper<Awaited<ReturnType<typeof client.products.createVariant>>, unknown, AdminPostProductsProductVariantsReq> = {}
) => {
  if (!options?.onSuccess) {
    const queryClient = useQueryClient()
    options.onSuccess = async () => {
      await queryClient.invalidateQueries('products')
    }
  }
  return useMutation<Awaited<ReturnType<typeof client.products.createVariant>>, unknown, AdminPostProductsProductVariantsReq>(
    ['products', 'createVariant', id,requestBody],
    () => client.products.createVariant(id,requestBody),
    options
  );
};

export const useProductsUpdateVariant = (
  id: string,
  variantId: string,
  requestBody: AdminPostProductsProductVariantsVariantReq,
  options: UseMutationOptionsWrapper<Awaited<ReturnType<typeof client.products.updateVariant>>, unknown, AdminPostProductsProductVariantsVariantReq> = {}
) => {
  if (!options?.onSuccess) {
    const queryClient = useQueryClient()
    options.onSuccess = async () => {
      await queryClient.invalidateQueries('products')
    }
  }
  return useMutation<Awaited<ReturnType<typeof client.products.updateVariant>>, unknown, AdminPostProductsProductVariantsVariantReq>(
    ['products', 'updateVariant', id,variantId,requestBody],
    () => client.products.updateVariant(id,variantId,requestBody),
    options
  );
};

export const useProductsDeleteVariant = (
  id: string,
  variantId: string,
  options: UseMutationOptionsWrapper<Awaited<ReturnType<typeof client.products.deleteVariant>>, unknown, void> = {}
) => {
  if (!options?.onSuccess) {
    const queryClient = useQueryClient()
    options.onSuccess = async () => {
      await queryClient.invalidateQueries('products')
    }
  }
  return useMutation<Awaited<ReturnType<typeof client.products.deleteVariant>>, unknown, void>(
    ['products', 'deleteVariant', id,variantId],
    () => client.products.deleteVariant(id,variantId),
    options
  );
};

export const useProductsRetrieve1 = (
  id: string,
  queryParams: AdminGetVariantParams,
  options: UseQueryOptionsWrapper<Awaited<ReturnType<typeof client.products.retrieve1>>> = {}
) => {
  const { data, ...rest } = useQuery<Awaited<ReturnType<typeof client.products.retrieve1>>>(
    ['products', 'retrieve1', id,queryParams],
    () => client.products.retrieve1(id,queryParams),
    options
  );
  return { ...data, ...rest } as const
};


