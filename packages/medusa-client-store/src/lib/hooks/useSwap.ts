/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { UseQueryOptionsWrapper, UseMutationOptionsWrapper} from '../core/HookUtils';
import { useMedusaStore } from '../useMedusaStore';
import type { StorePostSwapsReq } from '../models/StorePostSwapsReq';
import type { StoreSwapsRes } from '../models/StoreSwapsRes';

const { client } = useMedusaStore()

export const useSwapCreate = (
  requestBody: StorePostSwapsReq,
  options: UseMutationOptionsWrapper<Awaited<ReturnType<typeof client.swap.create>>, unknown, StorePostSwapsReq> = {}
) => {
  if (!options?.onSuccess) {
    const queryClient = useQueryClient()
    options.onSuccess = async () => {
      await queryClient.invalidateQueries('swap')
    }
  }
  return useMutation<Awaited<ReturnType<typeof client.swap.create>>, unknown, StorePostSwapsReq>(
    ['swap', 'create', requestBody],
    () => client.swap.create(requestBody),
    options
  );
};

export const useSwapRetrieveByCartId = (
  cartId: string,
  options: UseQueryOptionsWrapper<Awaited<ReturnType<typeof client.swap.retrieveByCartId>>> = {}
) => {
  const { data, ...rest } = useQuery<Awaited<ReturnType<typeof client.swap.retrieveByCartId>>>(
    ['swap', 'retrieveByCartId', cartId],
    () => client.swap.retrieveByCartId(cartId),
    options
  );
  return { ...data, ...rest } as const
};


