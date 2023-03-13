/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { UseQueryOptionsWrapper, UseMutationOptionsWrapper} from '../core/HookUtils';
import { useMedusaAdmin } from '../useMedusaAdmin';
import type { AdminCollectionsDeleteRes } from '@medusajs/client-types';
import type { AdminCollectionsListRes } from '@medusajs/client-types';
import type { AdminCollectionsRes } from '@medusajs/client-types';
import type { AdminDeleteProductsFromCollectionReq } from '@medusajs/client-types';
import type { AdminDeleteProductsFromCollectionRes } from '@medusajs/client-types';
import type { AdminGetCollectionsParams } from '@medusajs/client-types';
import type { AdminPostCollectionsCollectionReq } from '@medusajs/client-types';
import type { AdminPostCollectionsReq } from '@medusajs/client-types';
import type { AdminPostProductsToCollectionReq } from '@medusajs/client-types';

const { client } = useMedusaAdmin()

export const useCollectionsList = (
  queryParams: AdminGetCollectionsParams,
  options: UseQueryOptionsWrapper<Awaited<ReturnType<typeof client.collections.list>>> = {}
) => {
  const { data, ...rest } = useQuery<Awaited<ReturnType<typeof client.collections.list>>>(
    ['collections', 'list', queryParams],
    () => client.collections.list(queryParams),
    options
  );
  return { ...data, ...rest } as const
};

export const useCollectionsCreate = (
  requestBody: AdminPostCollectionsReq,
  options: UseMutationOptionsWrapper<Awaited<ReturnType<typeof client.collections.create>>, unknown, AdminPostCollectionsReq> = {}
) => {
  if (!options?.onSuccess) {
    const queryClient = useQueryClient()
    options.onSuccess = async () => {
      await queryClient.invalidateQueries('collections')
    }
  }
  return useMutation<Awaited<ReturnType<typeof client.collections.create>>, unknown, AdminPostCollectionsReq>(
    ['collections', 'create', requestBody],
    () => client.collections.create(requestBody),
    options
  );
};

export const useCollectionsRetrieve = (
  id: string,
  options: UseQueryOptionsWrapper<Awaited<ReturnType<typeof client.collections.retrieve>>> = {}
) => {
  const { data, ...rest } = useQuery<Awaited<ReturnType<typeof client.collections.retrieve>>>(
    ['collections', 'retrieve', id],
    () => client.collections.retrieve(id),
    options
  );
  return { ...data, ...rest } as const
};

export const useCollectionsUpdate = (
  id: string,
  requestBody: AdminPostCollectionsCollectionReq,
  options: UseMutationOptionsWrapper<Awaited<ReturnType<typeof client.collections.update>>, unknown, AdminPostCollectionsCollectionReq> = {}
) => {
  if (!options?.onSuccess) {
    const queryClient = useQueryClient()
    options.onSuccess = async () => {
      await queryClient.invalidateQueries('collections')
    }
  }
  return useMutation<Awaited<ReturnType<typeof client.collections.update>>, unknown, AdminPostCollectionsCollectionReq>(
    ['collections', 'update', id,requestBody],
    () => client.collections.update(id,requestBody),
    options
  );
};

export const useCollectionsDelete = (
  id: string,
  options: UseMutationOptionsWrapper<Awaited<ReturnType<typeof client.collections.delete>>, unknown, void> = {}
) => {
  if (!options?.onSuccess) {
    const queryClient = useQueryClient()
    options.onSuccess = async () => {
      await queryClient.invalidateQueries('collections')
    }
  }
  return useMutation<Awaited<ReturnType<typeof client.collections.delete>>, unknown, void>(
    ['collections', 'delete', id],
    () => client.collections.delete(id),
    options
  );
};

export const useCollectionsAddProducts = (
  id: string,
  requestBody: AdminPostProductsToCollectionReq,
  options: UseMutationOptionsWrapper<Awaited<ReturnType<typeof client.collections.addProducts>>, unknown, AdminPostProductsToCollectionReq> = {}
) => {
  if (!options?.onSuccess) {
    const queryClient = useQueryClient()
    options.onSuccess = async () => {
      await queryClient.invalidateQueries('collections')
    }
  }
  return useMutation<Awaited<ReturnType<typeof client.collections.addProducts>>, unknown, AdminPostProductsToCollectionReq>(
    ['collections', 'addProducts', id,requestBody],
    () => client.collections.addProducts(id,requestBody),
    options
  );
};

export const useCollectionsRemoveProducts = (
  id: string,
  requestBody: AdminDeleteProductsFromCollectionReq,
  options: UseMutationOptionsWrapper<Awaited<ReturnType<typeof client.collections.removeProducts>>, unknown, AdminDeleteProductsFromCollectionReq> = {}
) => {
  if (!options?.onSuccess) {
    const queryClient = useQueryClient()
    options.onSuccess = async () => {
      await queryClient.invalidateQueries('collections')
    }
  }
  return useMutation<Awaited<ReturnType<typeof client.collections.removeProducts>>, unknown, AdminDeleteProductsFromCollectionReq>(
    ['collections', 'removeProducts', id,requestBody],
    () => client.collections.removeProducts(id,requestBody),
    options
  );
};


