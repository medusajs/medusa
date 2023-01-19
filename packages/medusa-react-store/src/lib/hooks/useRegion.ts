/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { UseQueryOptionsWrapper, UseMutationOptionsWrapper} from '../core/HookUtils';
import { useMedusaStore } from '../useMedusaStore';
import type { StoreGetRegionsParams } from '../models/StoreGetRegionsParams';
import type { StoreRegionsListRes } from '../models/StoreRegionsListRes';
import type { StoreRegionsRes } from '../models/StoreRegionsRes';

const { client } = useMedusaStore()

export const useRegionList = (
  queryParams: StoreGetRegionsParams,
  options: UseQueryOptionsWrapper<Awaited<ReturnType<typeof client.region.list>>> = {}
) => {
  const { data, ...rest } = useQuery<Awaited<ReturnType<typeof client.region.list>>>(
    ['region', 'list', queryParams],
    () => client.region.list(queryParams),
    options
  );
  return { ...data, ...rest } as const
};

export const useRegionRetrieve = (
  id: string,
  options: UseQueryOptionsWrapper<Awaited<ReturnType<typeof client.region.retrieve>>> = {}
) => {
  const { data, ...rest } = useQuery<Awaited<ReturnType<typeof client.region.retrieve>>>(
    ['region', 'retrieve', id],
    () => client.region.retrieve(id),
    options
  );
  return { ...data, ...rest } as const
};


