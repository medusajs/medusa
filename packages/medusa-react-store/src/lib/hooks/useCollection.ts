/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { UseQueryOptionsWrapper, UseMutationOptionsWrapper} from '../core/HookUtils';
import { useMedusaStore } from '../useMedusaStore';
import type { StoreCollectionsListRes } from '../models/StoreCollectionsListRes';
import type { StoreCollectionsRes } from '../models/StoreCollectionsRes';
import type { StoreGetCollectionsParams } from '../models/StoreGetCollectionsParams';

const { client } = useMedusaStore()

export const useCollectionList = (
  queryParams: StoreGetCollectionsParams,
  options: UseQueryOptionsWrapper<Awaited<ReturnType<typeof client.collection.list>>> = {}
) => {
  const { data, ...rest } = useQuery<Awaited<ReturnType<typeof client.collection.list>>>(
    ['collection', 'list', queryParams],
    () => client.collection.list(queryParams),
    options
  );
  return { ...data, ...rest } as const
};

export const useCollectionRetrieve = (
  id: string,
  options: UseQueryOptionsWrapper<Awaited<ReturnType<typeof client.collection.retrieve>>> = {}
) => {
  const { data, ...rest } = useQuery<Awaited<ReturnType<typeof client.collection.retrieve>>>(
    ['collection', 'retrieve', id],
    () => client.collection.retrieve(id),
    options
  );
  return { ...data, ...rest } as const
};


