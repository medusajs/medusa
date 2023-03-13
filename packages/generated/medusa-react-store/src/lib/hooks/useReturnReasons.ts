/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { UseQueryOptionsWrapper, UseMutationOptionsWrapper} from '../core/HookUtils';
import { useMedusaStore } from '../useMedusaStore';
import type { StoreReturnReasonsListRes } from '@medusajs/client-types';
import type { StoreReturnReasonsRes } from '@medusajs/client-types';

const { client } = useMedusaStore()

export const useReturnReasonsList = (
  options: UseQueryOptionsWrapper<Awaited<ReturnType<typeof client.returnReasons.list>>> = {}
) => {
  const { data, ...rest } = useQuery<Awaited<ReturnType<typeof client.returnReasons.list>>>(
    ['returnReasons', 'list'],
    () => client.returnReasons.list(),
    options
  );
  return { ...data, ...rest } as const
};

export const useReturnReasonsRetrieve = (
  id: string,
  options: UseQueryOptionsWrapper<Awaited<ReturnType<typeof client.returnReasons.retrieve>>> = {}
) => {
  const { data, ...rest } = useQuery<Awaited<ReturnType<typeof client.returnReasons.retrieve>>>(
    ['returnReasons', 'retrieve', id],
    () => client.returnReasons.retrieve(id),
    options
  );
  return { ...data, ...rest } as const
};


