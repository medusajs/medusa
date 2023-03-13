/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { UseQueryOptionsWrapper, UseMutationOptionsWrapper} from '../core/HookUtils';
import { useMedusaStore } from '../useMedusaStore';
import type { StoreGetRegionsParams } from '@medusajs/client-types';
import type { StoreRegionsListRes } from '@medusajs/client-types';
import type { StoreRegionsRes } from '@medusajs/client-types';

const { client } = useMedusaStore()

export const useRegionsList = (
  queryParams: StoreGetRegionsParams,
  options: UseQueryOptionsWrapper<Awaited<ReturnType<typeof client.regions.list>>> = {}
) => {
  const { data, ...rest } = useQuery<Awaited<ReturnType<typeof client.regions.list>>>(
    ['regions', 'list', queryParams],
    () => client.regions.list(queryParams),
    options
  );
  return { ...data, ...rest } as const
};

export const useRegionsRetrieve = (
  id: string,
  options: UseQueryOptionsWrapper<Awaited<ReturnType<typeof client.regions.retrieve>>> = {}
) => {
  const { data, ...rest } = useQuery<Awaited<ReturnType<typeof client.regions.retrieve>>>(
    ['regions', 'retrieve', id],
    () => client.regions.retrieve(id),
    options
  );
  return { ...data, ...rest } as const
};


