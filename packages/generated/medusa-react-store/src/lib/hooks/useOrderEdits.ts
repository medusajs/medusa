/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { UseQueryOptionsWrapper, UseMutationOptionsWrapper} from '../core/HookUtils';
import { useMedusaStore } from '../useMedusaStore';
import type { StoreOrderEditsRes } from '@medusajs/client-types';
import type { StorePostOrderEditsOrderEditDecline } from '@medusajs/client-types';

const { client } = useMedusaStore()

export const useOrderEditsRetrieve = (
  id: string,
  options: UseQueryOptionsWrapper<Awaited<ReturnType<typeof client.orderEdits.retrieve>>> = {}
) => {
  const { data, ...rest } = useQuery<Awaited<ReturnType<typeof client.orderEdits.retrieve>>>(
    ['orderEdits', 'retrieve', id],
    () => client.orderEdits.retrieve(id),
    options
  );
  return { ...data, ...rest } as const
};

export const useOrderEditsComplete = (
  id: string,
  options: UseMutationOptionsWrapper<Awaited<ReturnType<typeof client.orderEdits.complete>>, unknown, void> = {}
) => {
  if (!options?.onSuccess) {
    const queryClient = useQueryClient()
    options.onSuccess = async () => {
      await queryClient.invalidateQueries('orderEdits')
    }
  }
  return useMutation<Awaited<ReturnType<typeof client.orderEdits.complete>>, unknown, void>(
    ['orderEdits', 'complete', id],
    () => client.orderEdits.complete(id),
    options
  );
};

export const useOrderEditsDecline = (
  id: string,
  requestBody: StorePostOrderEditsOrderEditDecline,
  options: UseMutationOptionsWrapper<Awaited<ReturnType<typeof client.orderEdits.decline>>, unknown, StorePostOrderEditsOrderEditDecline> = {}
) => {
  if (!options?.onSuccess) {
    const queryClient = useQueryClient()
    options.onSuccess = async () => {
      await queryClient.invalidateQueries('orderEdits')
    }
  }
  return useMutation<Awaited<ReturnType<typeof client.orderEdits.decline>>, unknown, StorePostOrderEditsOrderEditDecline>(
    ['orderEdits', 'decline', id,requestBody],
    () => client.orderEdits.decline(id,requestBody),
    options
  );
};


