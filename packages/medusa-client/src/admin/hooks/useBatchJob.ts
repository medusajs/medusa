/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { UseQueryOptionsWrapper, UseMutationOptionsWrapper} from '../core/HookUtils';
import { useMedusaAdmin } from '../useMedusaAdmin';
import type { AdminBatchJobListRes } from '../models/AdminBatchJobListRes';
import type { AdminBatchJobRes } from '../models/AdminBatchJobRes';
import type { AdminGetBatchParams } from '../models/AdminGetBatchParams';
import type { AdminPostBatchesReq } from '../models/AdminPostBatchesReq';

export const useBatchJobList = (
  queryParams: AdminGetBatchParams,
  options: UseQueryOptionsWrapper<Awaited<ReturnType<typeof client.batchJob.list>>> = {}
) => {
  const { client } = useMedusaAdmin()
  const { data, ...rest } = useQuery<Awaited<ReturnType<typeof client.batchJob.list>>>(
    ['batchJob', 'list', queryParams],
    () => client.batchJob.list(queryParams),
    options
  );
  return { ...data, ...rest } as const
};

export const useBatchJobCreate = (
  requestBody: AdminPostBatchesReq,
  options: UseMutationOptionsWrapper<Awaited<ReturnType<typeof client.batchJob.create>>, unknown, AdminPostBatchesReq> = {}
) => {
  const { client } = useMedusaAdmin()
  if (!options?.onSuccess) {
    const queryClient = useQueryClient()
    options.onSuccess = async () => {
      await queryClient.invalidateQueries('batchJob')
    }
  }
  return useMutation<Awaited<ReturnType<typeof client.batchJob.create>>, unknown, AdminPostBatchesReq>(
    ['batchJob', 'create', requestBody],
    () => client.batchJob.create(requestBody),
    options
  );
};

export const useBatchJobRetrieve = (
  id: string,
  options: UseQueryOptionsWrapper<Awaited<ReturnType<typeof client.batchJob.retrieve>>> = {}
) => {
  const { client } = useMedusaAdmin()
  const { data, ...rest } = useQuery<Awaited<ReturnType<typeof client.batchJob.retrieve>>>(
    ['batchJob', 'retrieve', id],
    () => client.batchJob.retrieve(id),
    options
  );
  return { ...data, ...rest } as const
};

export const useBatchJobCancel = (
  id: string,
  options: UseMutationOptionsWrapper<Awaited<ReturnType<typeof client.batchJob.cancel>>, unknown, void> = {}
) => {
  const { client } = useMedusaAdmin()
  if (!options?.onSuccess) {
    const queryClient = useQueryClient()
    options.onSuccess = async () => {
      await queryClient.invalidateQueries('batchJob')
    }
  }
  return useMutation<Awaited<ReturnType<typeof client.batchJob.cancel>>, unknown, void>(
    ['batchJob', 'cancel', id],
    () => client.batchJob.cancel(id),
    options
  );
};

export const useBatchJobConfirm = (
  id: string,
  options: UseMutationOptionsWrapper<Awaited<ReturnType<typeof client.batchJob.confirm>>, unknown, void> = {}
) => {
  const { client } = useMedusaAdmin()
  if (!options?.onSuccess) {
    const queryClient = useQueryClient()
    options.onSuccess = async () => {
      await queryClient.invalidateQueries('batchJob')
    }
  }
  return useMutation<Awaited<ReturnType<typeof client.batchJob.confirm>>, unknown, void>(
    ['batchJob', 'confirm', id],
    () => client.batchJob.confirm(id),
    options
  );
};


