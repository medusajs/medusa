/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { UseQueryOptionsWrapper, UseMutationOptionsWrapper} from '../core/HookUtils';
import { useMedusaAdmin } from '../useMedusaAdmin';
import type { AdminGetSwapsParams } from '@medusajs/client-types';
import type { AdminSwapsListRes } from '@medusajs/client-types';
import type { AdminSwapsRes } from '@medusajs/client-types';

const { client } = useMedusaAdmin()

export const useSwapsList = (
  queryParams: AdminGetSwapsParams,
  options: UseQueryOptionsWrapper<Awaited<ReturnType<typeof client.swaps.list>>> = {}
) => {
  const { data, ...rest } = useQuery<Awaited<ReturnType<typeof client.swaps.list>>>(
    ['swaps', 'list', queryParams],
    () => client.swaps.list(queryParams),
    options
  );
  return { ...data, ...rest } as const
};

export const useSwapsRetrieve = (
  id: string,
  options: UseQueryOptionsWrapper<Awaited<ReturnType<typeof client.swaps.retrieve>>> = {}
) => {
  const { data, ...rest } = useQuery<Awaited<ReturnType<typeof client.swaps.retrieve>>>(
    ['swaps', 'retrieve', id],
    () => client.swaps.retrieve(id),
    options
  );
  return { ...data, ...rest } as const
};


