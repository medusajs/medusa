/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { UseQueryOptionsWrapper, UseMutationOptionsWrapper} from '../core/HookUtils';
import { useMedusaStore } from '../useMedusaStore';
import type { StorePostSwapsReq } from '@medusajs/client-types';
import type { StoreSwapsRes } from '@medusajs/client-types';

const { client } = useMedusaStore()

export const useSwapsCreate = (
  requestBody: StorePostSwapsReq,
  options: UseMutationOptionsWrapper<Awaited<ReturnType<typeof client.swaps.create>>, unknown, StorePostSwapsReq> = {}
) => {
  if (!options?.onSuccess) {
    const queryClient = useQueryClient()
    options.onSuccess = async () => {
      await queryClient.invalidateQueries('swaps')
    }
  }
  return useMutation<Awaited<ReturnType<typeof client.swaps.create>>, unknown, StorePostSwapsReq>(
    ['swaps', 'create', requestBody],
    () => client.swaps.create(requestBody),
    options
  );
};

export const useSwapsRetrieveByCartId = (
  cartId: string,
  options: UseQueryOptionsWrapper<Awaited<ReturnType<typeof client.swaps.retrieveByCartId>>> = {}
) => {
  const { data, ...rest } = useQuery<Awaited<ReturnType<typeof client.swaps.retrieveByCartId>>>(
    ['swaps', 'retrieveByCartId', cartId],
    () => client.swaps.retrieveByCartId(cartId),
    options
  );
  return { ...data, ...rest } as const
};


