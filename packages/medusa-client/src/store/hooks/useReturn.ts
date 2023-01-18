/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { UseQueryOptionsWrapper, UseMutationOptionsWrapper} from '../core/HookUtils';
import { useMedusaStore } from '../useMedusaStore';
import type { StorePostReturnsReq } from '../models/StorePostReturnsReq';
import type { StoreReturnsRes } from '../models/StoreReturnsRes';

export const useReturnCreate = (
  requestBody: StorePostReturnsReq,
  options: UseMutationOptionsWrapper<Awaited<ReturnType<typeof client.return.create>>, unknown, StorePostReturnsReq> = {}
) => {
  const { client } = useMedusaStore()
  if (!options?.onSuccess) {
    const queryClient = useQueryClient()
    options.onSuccess = async () => {
      await queryClient.invalidateQueries('return')
    }
  }
  return useMutation<Awaited<ReturnType<typeof client.return.create>>, unknown, StorePostReturnsReq>(
    ['return', 'create', requestBody],
    () => client.return.create(requestBody),
    options
  );
};


