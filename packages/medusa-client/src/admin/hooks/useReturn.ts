/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { UseQueryOptionsWrapper, UseMutationOptionsWrapper} from '../core/HookUtils';
import { useMedusaAdmin } from '../useMedusaAdmin';
import type { AdminGetReturnsParams } from '../models/AdminGetReturnsParams';
import type { AdminOrdersRes } from '../models/AdminOrdersRes';
import type { AdminPostOrdersOrderReturnsReq } from '../models/AdminPostOrdersOrderReturnsReq';
import type { AdminPostReturnsReturnReceiveReq } from '../models/AdminPostReturnsReturnReceiveReq';
import type { AdminReturnsCancelRes } from '../models/AdminReturnsCancelRes';
import type { AdminReturnsListRes } from '../models/AdminReturnsListRes';
import type { AdminReturnsRes } from '../models/AdminReturnsRes';

export const useReturnRequestReturn = (
  id: string,
  requestBody: AdminPostOrdersOrderReturnsReq,
  options: UseMutationOptionsWrapper<Awaited<ReturnType<typeof client.return.requestReturn>>, unknown, AdminPostOrdersOrderReturnsReq> = {}
) => {
  const { client } = useMedusaAdmin()
  if (!options?.onSuccess) {
    const queryClient = useQueryClient()
    options.onSuccess = async () => {
      await queryClient.invalidateQueries('return')
    }
  }
  return useMutation<Awaited<ReturnType<typeof client.return.requestReturn>>, unknown, AdminPostOrdersOrderReturnsReq>(
    ['return', 'requestReturn', id,requestBody],
    () => client.return.requestReturn(id,requestBody),
    options
  );
};

export const useReturnList = (
  queryParams: AdminGetReturnsParams,
  options: UseQueryOptionsWrapper<Awaited<ReturnType<typeof client.return.list>>> = {}
) => {
  const { client } = useMedusaAdmin()
  const { data, ...rest } = useQuery<Awaited<ReturnType<typeof client.return.list>>>(
    ['return', 'list', queryParams],
    () => client.return.list(queryParams),
    options
  );
  return { ...data, ...rest } as const
};

export const useReturnCancel = (
  id: string,
  options: UseMutationOptionsWrapper<Awaited<ReturnType<typeof client.return.cancel>>, unknown, void> = {}
) => {
  const { client } = useMedusaAdmin()
  if (!options?.onSuccess) {
    const queryClient = useQueryClient()
    options.onSuccess = async () => {
      await queryClient.invalidateQueries('return')
    }
  }
  return useMutation<Awaited<ReturnType<typeof client.return.cancel>>, unknown, void>(
    ['return', 'cancel', id],
    () => client.return.cancel(id),
    options
  );
};

export const useReturnReceive = (
  id: string,
  requestBody: AdminPostReturnsReturnReceiveReq,
  options: UseMutationOptionsWrapper<Awaited<ReturnType<typeof client.return.receive>>, unknown, AdminPostReturnsReturnReceiveReq> = {}
) => {
  const { client } = useMedusaAdmin()
  if (!options?.onSuccess) {
    const queryClient = useQueryClient()
    options.onSuccess = async () => {
      await queryClient.invalidateQueries('return')
    }
  }
  return useMutation<Awaited<ReturnType<typeof client.return.receive>>, unknown, AdminPostReturnsReturnReceiveReq>(
    ['return', 'receive', id,requestBody],
    () => client.return.receive(id,requestBody),
    options
  );
};


