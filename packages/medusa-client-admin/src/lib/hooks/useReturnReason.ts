/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { UseQueryOptionsWrapper, UseMutationOptionsWrapper} from '../core/HookUtils';
import { useMedusaAdmin } from '../useMedusaAdmin';
import type { AdminPostReturnReasonsReasonReq } from '../models/AdminPostReturnReasonsReasonReq';
import type { AdminPostReturnReasonsReq } from '../models/AdminPostReturnReasonsReq';
import type { AdminReturnReasonsDeleteRes } from '../models/AdminReturnReasonsDeleteRes';
import type { AdminReturnReasonsListRes } from '../models/AdminReturnReasonsListRes';
import type { AdminReturnReasonsRes } from '../models/AdminReturnReasonsRes';

const { client } = useMedusaAdmin()

export const useReturnReasonList = (
  options: UseQueryOptionsWrapper<Awaited<ReturnType<typeof client.returnReason.list>>> = {}
) => {
  const { data, ...rest } = useQuery<Awaited<ReturnType<typeof client.returnReason.list>>>(
    ['returnReason', 'list'],
    () => client.returnReason.list(),
    options
  );
  return { ...data, ...rest } as const
};

export const useReturnReasonCreate = (
  requestBody: AdminPostReturnReasonsReq,
  options: UseMutationOptionsWrapper<Awaited<ReturnType<typeof client.returnReason.create>>, unknown, AdminPostReturnReasonsReq> = {}
) => {
  if (!options?.onSuccess) {
    const queryClient = useQueryClient()
    options.onSuccess = async () => {
      await queryClient.invalidateQueries('returnReason')
    }
  }
  return useMutation<Awaited<ReturnType<typeof client.returnReason.create>>, unknown, AdminPostReturnReasonsReq>(
    ['returnReason', 'create', requestBody],
    () => client.returnReason.create(requestBody),
    options
  );
};

export const useReturnReasonRetrieve = (
  id: string,
  options: UseQueryOptionsWrapper<Awaited<ReturnType<typeof client.returnReason.retrieve>>> = {}
) => {
  const { data, ...rest } = useQuery<Awaited<ReturnType<typeof client.returnReason.retrieve>>>(
    ['returnReason', 'retrieve', id],
    () => client.returnReason.retrieve(id),
    options
  );
  return { ...data, ...rest } as const
};

export const useReturnReasonUpdate = (
  id: string,
  requestBody: AdminPostReturnReasonsReasonReq,
  options: UseMutationOptionsWrapper<Awaited<ReturnType<typeof client.returnReason.update>>, unknown, AdminPostReturnReasonsReasonReq> = {}
) => {
  if (!options?.onSuccess) {
    const queryClient = useQueryClient()
    options.onSuccess = async () => {
      await queryClient.invalidateQueries('returnReason')
    }
  }
  return useMutation<Awaited<ReturnType<typeof client.returnReason.update>>, unknown, AdminPostReturnReasonsReasonReq>(
    ['returnReason', 'update', id,requestBody],
    () => client.returnReason.update(id,requestBody),
    options
  );
};

export const useReturnReasonDelete = (
  id: string,
  options: UseMutationOptionsWrapper<Awaited<ReturnType<typeof client.returnReason.delete>>, unknown, void> = {}
) => {
  if (!options?.onSuccess) {
    const queryClient = useQueryClient()
    options.onSuccess = async () => {
      await queryClient.invalidateQueries('returnReason')
    }
  }
  return useMutation<Awaited<ReturnType<typeof client.returnReason.delete>>, unknown, void>(
    ['returnReason', 'delete', id],
    () => client.returnReason.delete(id),
    options
  );
};


