/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { UseQueryOptionsWrapper, UseMutationOptionsWrapper} from '../core/HookUtils';
import { useMedusaAdmin } from '../useMedusaAdmin';
import type { AdminPostReturnReasonsReasonReq } from '@medusajs/client-types';
import type { AdminPostReturnReasonsReq } from '@medusajs/client-types';
import type { AdminReturnReasonsDeleteRes } from '@medusajs/client-types';
import type { AdminReturnReasonsListRes } from '@medusajs/client-types';
import type { AdminReturnReasonsRes } from '@medusajs/client-types';

const { client } = useMedusaAdmin()

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

export const useReturnReasonsCreate = (
  requestBody: AdminPostReturnReasonsReq,
  options: UseMutationOptionsWrapper<Awaited<ReturnType<typeof client.returnReasons.create>>, unknown, AdminPostReturnReasonsReq> = {}
) => {
  if (!options?.onSuccess) {
    const queryClient = useQueryClient()
    options.onSuccess = async () => {
      await queryClient.invalidateQueries('returnReasons')
    }
  }
  return useMutation<Awaited<ReturnType<typeof client.returnReasons.create>>, unknown, AdminPostReturnReasonsReq>(
    ['returnReasons', 'create', requestBody],
    () => client.returnReasons.create(requestBody),
    options
  );
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

export const useReturnReasonsUpdate = (
  id: string,
  requestBody: AdminPostReturnReasonsReasonReq,
  options: UseMutationOptionsWrapper<Awaited<ReturnType<typeof client.returnReasons.update>>, unknown, AdminPostReturnReasonsReasonReq> = {}
) => {
  if (!options?.onSuccess) {
    const queryClient = useQueryClient()
    options.onSuccess = async () => {
      await queryClient.invalidateQueries('returnReasons')
    }
  }
  return useMutation<Awaited<ReturnType<typeof client.returnReasons.update>>, unknown, AdminPostReturnReasonsReasonReq>(
    ['returnReasons', 'update', id,requestBody],
    () => client.returnReasons.update(id,requestBody),
    options
  );
};

export const useReturnReasonsDelete = (
  id: string,
  options: UseMutationOptionsWrapper<Awaited<ReturnType<typeof client.returnReasons.delete>>, unknown, void> = {}
) => {
  if (!options?.onSuccess) {
    const queryClient = useQueryClient()
    options.onSuccess = async () => {
      await queryClient.invalidateQueries('returnReasons')
    }
  }
  return useMutation<Awaited<ReturnType<typeof client.returnReasons.delete>>, unknown, void>(
    ['returnReasons', 'delete', id],
    () => client.returnReasons.delete(id),
    options
  );
};


