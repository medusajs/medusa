/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { UseQueryOptionsWrapper, UseMutationOptionsWrapper} from '../core/HookUtils';
import { useMedusaStore } from '../useMedusaStore';
import type { StorePostReturnsReq } from '@medusajs/client-types';
import type { StoreReturnsRes } from '@medusajs/client-types';

const { client } = useMedusaStore()

export const useReturnsCreate = (
  requestBody: StorePostReturnsReq,
  options: UseMutationOptionsWrapper<Awaited<ReturnType<typeof client.returns.create>>, unknown, StorePostReturnsReq> = {}
) => {
  if (!options?.onSuccess) {
    const queryClient = useQueryClient()
    options.onSuccess = async () => {
      await queryClient.invalidateQueries('returns')
    }
  }
  return useMutation<Awaited<ReturnType<typeof client.returns.create>>, unknown, StorePostReturnsReq>(
    ['returns', 'create', requestBody],
    () => client.returns.create(requestBody),
    options
  );
};


