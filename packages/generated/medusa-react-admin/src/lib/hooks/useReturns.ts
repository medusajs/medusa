/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { UseQueryOptionsWrapper, UseMutationOptionsWrapper} from '../core/HookUtils';
import { useMedusaAdmin } from '../useMedusaAdmin';
import type { AdminGetReturnsParams } from '@medusajs/client-types';
import type { AdminPostReturnsReturnReceiveReq } from '@medusajs/client-types';
import type { AdminReturnsCancelRes } from '@medusajs/client-types';
import type { AdminReturnsListRes } from '@medusajs/client-types';
import type { AdminReturnsRes } from '@medusajs/client-types';

const { client } = useMedusaAdmin()

export const useReturnsList = (
  queryParams: AdminGetReturnsParams,
  options: UseQueryOptionsWrapper<Awaited<ReturnType<typeof client.returns.list>>> = {}
) => {
  const { data, ...rest } = useQuery<Awaited<ReturnType<typeof client.returns.list>>>(
    ['returns', 'list', queryParams],
    () => client.returns.list(queryParams),
    options
  );
  return { ...data, ...rest } as const
};

export const useReturnsCancel = (
  id: string,
  options: UseMutationOptionsWrapper<Awaited<ReturnType<typeof client.returns.cancel>>, unknown, void> = {}
) => {
  if (!options?.onSuccess) {
    const queryClient = useQueryClient()
    options.onSuccess = async () => {
      await queryClient.invalidateQueries('returns')
    }
  }
  return useMutation<Awaited<ReturnType<typeof client.returns.cancel>>, unknown, void>(
    ['returns', 'cancel', id],
    () => client.returns.cancel(id),
    options
  );
};

export const useReturnsReceive = (
  id: string,
  requestBody: AdminPostReturnsReturnReceiveReq,
  options: UseMutationOptionsWrapper<Awaited<ReturnType<typeof client.returns.receive>>, unknown, AdminPostReturnsReturnReceiveReq> = {}
) => {
  if (!options?.onSuccess) {
    const queryClient = useQueryClient()
    options.onSuccess = async () => {
      await queryClient.invalidateQueries('returns')
    }
  }
  return useMutation<Awaited<ReturnType<typeof client.returns.receive>>, unknown, AdminPostReturnsReturnReceiveReq>(
    ['returns', 'receive', id,requestBody],
    () => client.returns.receive(id,requestBody),
    options
  );
};


