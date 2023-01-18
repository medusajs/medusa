/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { UseQueryOptionsWrapper, UseMutationOptionsWrapper} from '../core/HookUtils';
import { useMedusaStore } from '../useMedusaStore';
import type { StoreOrderEditsRes } from '../models/StoreOrderEditsRes';
import type { StorePostOrderEditsOrderEditDecline } from '../models/StorePostOrderEditsOrderEditDecline';

export const useOrderEditRetrieve = (
  id: string,
  options: UseQueryOptionsWrapper<Awaited<ReturnType<typeof client.orderEdit.retrieve>>> = {}
) => {
  const { client } = useMedusaStore()
  const { data, ...rest } = useQuery<Awaited<ReturnType<typeof client.orderEdit.retrieve>>>(
    ['orderEdit', 'retrieve', id],
    () => client.orderEdit.retrieve(id),
    options
  );
  return { ...data, ...rest } as const
};

export const useOrderEditComplete = (
  id: string,
  options: UseMutationOptionsWrapper<Awaited<ReturnType<typeof client.orderEdit.complete>>, unknown, void> = {}
) => {
  const { client } = useMedusaStore()
  if (!options?.onSuccess) {
    const queryClient = useQueryClient()
    options.onSuccess = async () => {
      await queryClient.invalidateQueries('orderEdit')
    }
  }
  return useMutation<Awaited<ReturnType<typeof client.orderEdit.complete>>, unknown, void>(
    ['orderEdit', 'complete', id],
    () => client.orderEdit.complete(id),
    options
  );
};

export const useOrderEditDecline = (
  id: string,
  requestBody: StorePostOrderEditsOrderEditDecline,
  options: UseMutationOptionsWrapper<Awaited<ReturnType<typeof client.orderEdit.decline>>, unknown, StorePostOrderEditsOrderEditDecline> = {}
) => {
  const { client } = useMedusaStore()
  if (!options?.onSuccess) {
    const queryClient = useQueryClient()
    options.onSuccess = async () => {
      await queryClient.invalidateQueries('orderEdit')
    }
  }
  return useMutation<Awaited<ReturnType<typeof client.orderEdit.decline>>, unknown, StorePostOrderEditsOrderEditDecline>(
    ['orderEdit', 'decline', id,requestBody],
    () => client.orderEdit.decline(id,requestBody),
    options
  );
};


