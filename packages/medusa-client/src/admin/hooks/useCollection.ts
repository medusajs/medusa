/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { UseQueryOptionsWrapper, UseMutationOptionsWrapper} from '../core/HookUtils';
import { useMedusaAdmin } from '../useMedusaAdmin';
import type { AdminCollectionsDeleteRes } from '../models/AdminCollectionsDeleteRes';
import type { AdminCollectionsListRes } from '../models/AdminCollectionsListRes';
import type { AdminCollectionsRes } from '../models/AdminCollectionsRes';
import type { AdminDeleteProductsFromCollectionReq } from '../models/AdminDeleteProductsFromCollectionReq';
import type { AdminDeleteProductsFromCollectionRes } from '../models/AdminDeleteProductsFromCollectionRes';
import type { AdminGetCollectionsParams } from '../models/AdminGetCollectionsParams';
import type { AdminPostCollectionsCollectionReq } from '../models/AdminPostCollectionsCollectionReq';
import type { AdminPostCollectionsReq } from '../models/AdminPostCollectionsReq';
import type { AdminPostProductsToCollectionReq } from '../models/AdminPostProductsToCollectionReq';

export const useCollectionList = (
  queryParams: AdminGetCollectionsParams,
  options: UseQueryOptionsWrapper<Awaited<ReturnType<typeof client.collection.list>>> = {}
) => {
  const { client } = useMedusaAdmin()
  const { data, ...rest } = useQuery<Awaited<ReturnType<typeof client.collection.list>>>(
    ['collection', 'list', queryParams],
    () => client.collection.list(queryParams),
    options
  );
  return { ...data, ...rest } as const
};

export const useCollectionCreate = (
  requestBody: AdminPostCollectionsReq,
  options: UseMutationOptionsWrapper<Awaited<ReturnType<typeof client.collection.create>>, unknown, AdminPostCollectionsReq> = {}
) => {
  const { client } = useMedusaAdmin()
  if (!options?.onSuccess) {
    const queryClient = useQueryClient()
    options.onSuccess = async () => {
      await queryClient.invalidateQueries('collection')
    }
  }
  return useMutation<Awaited<ReturnType<typeof client.collection.create>>, unknown, AdminPostCollectionsReq>(
    ['collection', 'create', requestBody],
    () => client.collection.create(requestBody),
    options
  );
};

export const useCollectionRetrieve = (
  id: string,
  options: UseQueryOptionsWrapper<Awaited<ReturnType<typeof client.collection.retrieve>>> = {}
) => {
  const { client } = useMedusaAdmin()
  const { data, ...rest } = useQuery<Awaited<ReturnType<typeof client.collection.retrieve>>>(
    ['collection', 'retrieve', id],
    () => client.collection.retrieve(id),
    options
  );
  return { ...data, ...rest } as const
};

export const useCollectionUpdate = (
  id: string,
  requestBody: AdminPostCollectionsCollectionReq,
  options: UseMutationOptionsWrapper<Awaited<ReturnType<typeof client.collection.update>>, unknown, AdminPostCollectionsCollectionReq> = {}
) => {
  const { client } = useMedusaAdmin()
  if (!options?.onSuccess) {
    const queryClient = useQueryClient()
    options.onSuccess = async () => {
      await queryClient.invalidateQueries('collection')
    }
  }
  return useMutation<Awaited<ReturnType<typeof client.collection.update>>, unknown, AdminPostCollectionsCollectionReq>(
    ['collection', 'update', id,requestBody],
    () => client.collection.update(id,requestBody),
    options
  );
};

export const useCollectionDelete = (
  id: string,
  options: UseMutationOptionsWrapper<Awaited<ReturnType<typeof client.collection.delete>>, unknown, void> = {}
) => {
  const { client } = useMedusaAdmin()
  if (!options?.onSuccess) {
    const queryClient = useQueryClient()
    options.onSuccess = async () => {
      await queryClient.invalidateQueries('collection')
    }
  }
  return useMutation<Awaited<ReturnType<typeof client.collection.delete>>, unknown, void>(
    ['collection', 'delete', id],
    () => client.collection.delete(id),
    options
  );
};

export const useCollectionAddProducts = (
  id: string,
  requestBody: AdminPostProductsToCollectionReq,
  options: UseMutationOptionsWrapper<Awaited<ReturnType<typeof client.collection.addProducts>>, unknown, AdminPostProductsToCollectionReq> = {}
) => {
  const { client } = useMedusaAdmin()
  if (!options?.onSuccess) {
    const queryClient = useQueryClient()
    options.onSuccess = async () => {
      await queryClient.invalidateQueries('collection')
    }
  }
  return useMutation<Awaited<ReturnType<typeof client.collection.addProducts>>, unknown, AdminPostProductsToCollectionReq>(
    ['collection', 'addProducts', id,requestBody],
    () => client.collection.addProducts(id,requestBody),
    options
  );
};

export const useCollectionRemoveProducts = (
  id: string,
  requestBody: AdminDeleteProductsFromCollectionReq,
  options: UseMutationOptionsWrapper<Awaited<ReturnType<typeof client.collection.removeProducts>>, unknown, AdminDeleteProductsFromCollectionReq> = {}
) => {
  const { client } = useMedusaAdmin()
  if (!options?.onSuccess) {
    const queryClient = useQueryClient()
    options.onSuccess = async () => {
      await queryClient.invalidateQueries('collection')
    }
  }
  return useMutation<Awaited<ReturnType<typeof client.collection.removeProducts>>, unknown, AdminDeleteProductsFromCollectionReq>(
    ['collection', 'removeProducts', id,requestBody],
    () => client.collection.removeProducts(id,requestBody),
    options
  );
};


