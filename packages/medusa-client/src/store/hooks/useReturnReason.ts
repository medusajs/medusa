/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { UseQueryOptionsWrapper, UseMutationOptionsWrapper} from '../core/HookUtils';
import { useMedusaStore } from '../useMedusaStore';
import type { StoreReturnReasonsListRes } from '../models/StoreReturnReasonsListRes';
import type { StoreReturnReasonsRes } from '../models/StoreReturnReasonsRes';

export const useReturnReasonList = (
  options: UseQueryOptionsWrapper<Awaited<ReturnType<typeof client.returnReason.list>>> = {}
) => {
  const { client } = useMedusaStore()
  const { data, ...rest } = useQuery<Awaited<ReturnType<typeof client.returnReason.list>>>(
    ['returnReason', 'list'],
    () => client.returnReason.list(),
    options
  );
  return { ...data, ...rest } as const
};

export const useReturnReasonRetrieve = (
  id: string,
  options: UseQueryOptionsWrapper<Awaited<ReturnType<typeof client.returnReason.retrieve>>> = {}
) => {
  const { client } = useMedusaStore()
  const { data, ...rest } = useQuery<Awaited<ReturnType<typeof client.returnReason.retrieve>>>(
    ['returnReason', 'retrieve', id],
    () => client.returnReason.retrieve(id),
    options
  );
  return { ...data, ...rest } as const
};


