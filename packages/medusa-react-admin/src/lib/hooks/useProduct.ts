/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { UseQueryOptionsWrapper, UseMutationOptionsWrapper} from '../core/HookUtils';
import { useMedusaAdmin } from '../useMedusaAdmin';
import type { AdminGetProductsParams } from '../models/AdminGetProductsParams';
import type { AdminGetProductsVariantsParams } from '../models/AdminGetProductsVariantsParams';
import type { AdminPostProductsProductMetadataReq } from '../models/AdminPostProductsProductMetadataReq';
import type { AdminPostProductsProductOptionsOption } from '../models/AdminPostProductsProductOptionsOption';
import type { AdminPostProductsProductOptionsReq } from '../models/AdminPostProductsProductOptionsReq';
import type { AdminPostProductsProductReq } from '../models/AdminPostProductsProductReq';
import type { AdminPostProductsProductVariantsReq } from '../models/AdminPostProductsProductVariantsReq';
import type { AdminPostProductsProductVariantsVariantReq } from '../models/AdminPostProductsProductVariantsVariantReq';
import type { AdminPostProductsReq } from '../models/AdminPostProductsReq';
import type { AdminProductsDeleteOptionRes } from '../models/AdminProductsDeleteOptionRes';
import type { AdminProductsDeleteRes } from '../models/AdminProductsDeleteRes';
import type { AdminProductsDeleteVariantRes } from '../models/AdminProductsDeleteVariantRes';
import type { AdminProductsListRes } from '../models/AdminProductsListRes';
import type { AdminProductsListTypesRes } from '../models/AdminProductsListTypesRes';
import type { AdminProductsListVariantsRes } from '../models/AdminProductsListVariantsRes';
import type { AdminProductsRes } from '../models/AdminProductsRes';

const { client } = useMedusaAdmin()

export const useProductList = (
  queryParams: AdminGetProductsParams,
  options: UseQueryOptionsWrapper<Awaited<ReturnType<typeof client.product.list>>> = {}
) => {
  const { data, ...rest } = useQuery<Awaited<ReturnType<typeof client.product.list>>>(
    ['product', 'list', queryParams],
    () => client.product.list(queryParams),
    options
  );
  return { ...data, ...rest } as const
};

export const useProductCreate = (
  requestBody: AdminPostProductsReq,
  options: UseMutationOptionsWrapper<Awaited<ReturnType<typeof client.product.create>>, unknown, AdminPostProductsReq> = {}
) => {
  if (!options?.onSuccess) {
    const queryClient = useQueryClient()
    options.onSuccess = async () => {
      await queryClient.invalidateQueries('product')
    }
  }
  return useMutation<Awaited<ReturnType<typeof client.product.create>>, unknown, AdminPostProductsReq>(
    ['product', 'create', requestBody],
    () => client.product.create(requestBody),
    options
  );
};

export const useProductListTypes = (
  options: UseQueryOptionsWrapper<Awaited<ReturnType<typeof client.product.listTypes>>> = {}
) => {
  const { data, ...rest } = useQuery<Awaited<ReturnType<typeof client.product.listTypes>>>(
    ['product', 'listTypes'],
    () => client.product.listTypes(),
    options
  );
  return { ...data, ...rest } as const
};

export const useProductRetrieve = (
  id: string,
  options: UseQueryOptionsWrapper<Awaited<ReturnType<typeof client.product.retrieve>>> = {}
) => {
  const { data, ...rest } = useQuery<Awaited<ReturnType<typeof client.product.retrieve>>>(
    ['product', 'retrieve', id],
    () => client.product.retrieve(id),
    options
  );
  return { ...data, ...rest } as const
};

export const useProductUpdate = (
  id: string,
  requestBody: AdminPostProductsProductReq,
  options: UseMutationOptionsWrapper<Awaited<ReturnType<typeof client.product.update>>, unknown, AdminPostProductsProductReq> = {}
) => {
  if (!options?.onSuccess) {
    const queryClient = useQueryClient()
    options.onSuccess = async () => {
      await queryClient.invalidateQueries('product')
    }
  }
  return useMutation<Awaited<ReturnType<typeof client.product.update>>, unknown, AdminPostProductsProductReq>(
    ['product', 'update', id,requestBody],
    () => client.product.update(id,requestBody),
    options
  );
};

export const useProductDelete = (
  id: string,
  options: UseMutationOptionsWrapper<Awaited<ReturnType<typeof client.product.delete>>, unknown, void> = {}
) => {
  if (!options?.onSuccess) {
    const queryClient = useQueryClient()
    options.onSuccess = async () => {
      await queryClient.invalidateQueries('product')
    }
  }
  return useMutation<Awaited<ReturnType<typeof client.product.delete>>, unknown, void>(
    ['product', 'delete', id],
    () => client.product.delete(id),
    options
  );
};

export const useProductSetMetadata = (
  id: string,
  requestBody: AdminPostProductsProductMetadataReq,
  options: UseMutationOptionsWrapper<Awaited<ReturnType<typeof client.product.setMetadata>>, unknown, AdminPostProductsProductMetadataReq> = {}
) => {
  if (!options?.onSuccess) {
    const queryClient = useQueryClient()
    options.onSuccess = async () => {
      await queryClient.invalidateQueries('product')
    }
  }
  return useMutation<Awaited<ReturnType<typeof client.product.setMetadata>>, unknown, AdminPostProductsProductMetadataReq>(
    ['product', 'setMetadata', id,requestBody],
    () => client.product.setMetadata(id,requestBody),
    options
  );
};

export const useProductAddOption = (
  id: string,
  requestBody: AdminPostProductsProductOptionsReq,
  options: UseMutationOptionsWrapper<Awaited<ReturnType<typeof client.product.addOption>>, unknown, AdminPostProductsProductOptionsReq> = {}
) => {
  if (!options?.onSuccess) {
    const queryClient = useQueryClient()
    options.onSuccess = async () => {
      await queryClient.invalidateQueries('product')
    }
  }
  return useMutation<Awaited<ReturnType<typeof client.product.addOption>>, unknown, AdminPostProductsProductOptionsReq>(
    ['product', 'addOption', id,requestBody],
    () => client.product.addOption(id,requestBody),
    options
  );
};

export const useProductUpdateOption = (
  id: string,
  optionId: string,
  requestBody: AdminPostProductsProductOptionsOption,
  options: UseMutationOptionsWrapper<Awaited<ReturnType<typeof client.product.updateOption>>, unknown, AdminPostProductsProductOptionsOption> = {}
) => {
  if (!options?.onSuccess) {
    const queryClient = useQueryClient()
    options.onSuccess = async () => {
      await queryClient.invalidateQueries('product')
    }
  }
  return useMutation<Awaited<ReturnType<typeof client.product.updateOption>>, unknown, AdminPostProductsProductOptionsOption>(
    ['product', 'updateOption', id,optionId,requestBody],
    () => client.product.updateOption(id,optionId,requestBody),
    options
  );
};

export const useProductDeleteOption = (
  id: string,
  optionId: string,
  options: UseMutationOptionsWrapper<Awaited<ReturnType<typeof client.product.deleteOption>>, unknown, void> = {}
) => {
  if (!options?.onSuccess) {
    const queryClient = useQueryClient()
    options.onSuccess = async () => {
      await queryClient.invalidateQueries('product')
    }
  }
  return useMutation<Awaited<ReturnType<typeof client.product.deleteOption>>, unknown, void>(
    ['product', 'deleteOption', id,optionId],
    () => client.product.deleteOption(id,optionId),
    options
  );
};

export const useProductListVariants = (
  id: string,
  queryParams: AdminGetProductsVariantsParams,
  options: UseQueryOptionsWrapper<Awaited<ReturnType<typeof client.product.listVariants>>> = {}
) => {
  const { data, ...rest } = useQuery<Awaited<ReturnType<typeof client.product.listVariants>>>(
    ['product', 'listVariants', id,queryParams],
    () => client.product.listVariants(id,queryParams),
    options
  );
  return { ...data, ...rest } as const
};

export const useProductCreateVariant = (
  id: string,
  requestBody: AdminPostProductsProductVariantsReq,
  options: UseMutationOptionsWrapper<Awaited<ReturnType<typeof client.product.createVariant>>, unknown, AdminPostProductsProductVariantsReq> = {}
) => {
  if (!options?.onSuccess) {
    const queryClient = useQueryClient()
    options.onSuccess = async () => {
      await queryClient.invalidateQueries('product')
    }
  }
  return useMutation<Awaited<ReturnType<typeof client.product.createVariant>>, unknown, AdminPostProductsProductVariantsReq>(
    ['product', 'createVariant', id,requestBody],
    () => client.product.createVariant(id,requestBody),
    options
  );
};

export const useProductUpdateVariant = (
  id: string,
  variantId: string,
  requestBody: AdminPostProductsProductVariantsVariantReq,
  options: UseMutationOptionsWrapper<Awaited<ReturnType<typeof client.product.updateVariant>>, unknown, AdminPostProductsProductVariantsVariantReq> = {}
) => {
  if (!options?.onSuccess) {
    const queryClient = useQueryClient()
    options.onSuccess = async () => {
      await queryClient.invalidateQueries('product')
    }
  }
  return useMutation<Awaited<ReturnType<typeof client.product.updateVariant>>, unknown, AdminPostProductsProductVariantsVariantReq>(
    ['product', 'updateVariant', id,variantId,requestBody],
    () => client.product.updateVariant(id,variantId,requestBody),
    options
  );
};

export const useProductDeleteVariant = (
  id: string,
  variantId: string,
  options: UseMutationOptionsWrapper<Awaited<ReturnType<typeof client.product.deleteVariant>>, unknown, void> = {}
) => {
  if (!options?.onSuccess) {
    const queryClient = useQueryClient()
    options.onSuccess = async () => {
      await queryClient.invalidateQueries('product')
    }
  }
  return useMutation<Awaited<ReturnType<typeof client.product.deleteVariant>>, unknown, void>(
    ['product', 'deleteVariant', id,variantId],
    () => client.product.deleteVariant(id,variantId),
    options
  );
};


