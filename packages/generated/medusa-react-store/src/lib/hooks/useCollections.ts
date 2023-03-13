/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { UseQueryOptionsWrapper, UseMutationOptionsWrapper} from '../core/HookUtils';
import { useMedusaStore } from '../useMedusaStore';
import type { StoreCollectionsListRes } from '@medusajs/client-types';
import type { StoreCollectionsRes } from '@medusajs/client-types';
import type { StoreGetCollectionsParams } from '@medusajs/client-types';

const { client } = useMedusaStore()

export const useCollectionsList = (
  queryParams: StoreGetCollectionsParams,
  options: UseQueryOptionsWrapper<Awaited<ReturnType<typeof client.collections.list>>> = {}
) => {
  const { data, ...rest } = useQuery<Awaited<ReturnType<typeof client.collections.list>>>(
    ['collections', 'list', queryParams],
    () => client.collections.list(queryParams),
    options
  );
  return { ...data, ...rest } as const
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


