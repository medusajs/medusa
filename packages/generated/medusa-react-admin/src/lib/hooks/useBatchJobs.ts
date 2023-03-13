/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { UseQueryOptionsWrapper, UseMutationOptionsWrapper} from '../core/HookUtils';
import { useMedusaAdmin } from '../useMedusaAdmin';
import type { AdminBatchJobListRes } from '@medusajs/client-types';
import type { AdminBatchJobRes } from '@medusajs/client-types';
import type { AdminGetBatchParams } from '@medusajs/client-types';
import type { AdminPostBatchesReq } from '@medusajs/client-types';

const { client } = useMedusaAdmin()

export const useBatchJobsList = (
  queryParams: AdminGetBatchParams,
  options: UseQueryOptionsWrapper<Awaited<ReturnType<typeof client.batchJobs.list>>> = {}
) => {
  const { data, ...rest } = useQuery<Awaited<ReturnType<typeof client.batchJobs.list>>>(
    ['batchJobs', 'list', queryParams],
    () => client.batchJobs.list(queryParams),
    options
  );
  return { ...data, ...rest } as const
};

export const useBatchJobsCreate = (
  requestBody: AdminPostBatchesReq,
  options: UseMutationOptionsWrapper<Awaited<ReturnType<typeof client.batchJobs.create>>, unknown, AdminPostBatchesReq> = {}
) => {
  if (!options?.onSuccess) {
    const queryClient = useQueryClient()
    options.onSuccess = async () => {
      await queryClient.invalidateQueries('batchJobs')
    }
  }
  return useMutation<Awaited<ReturnType<typeof client.batchJobs.create>>, unknown, AdminPostBatchesReq>(
    ['batchJobs', 'create', requestBody],
    () => client.batchJobs.create(requestBody),
    options
  );
};

export const useBatchJobsRetrieve = (
  id: string,
  options: UseQueryOptionsWrapper<Awaited<ReturnType<typeof client.batchJobs.retrieve>>> = {}
) => {
  const { data, ...rest } = useQuery<Awaited<ReturnType<typeof client.batchJobs.retrieve>>>(
    ['batchJobs', 'retrieve', id],
    () => client.batchJobs.retrieve(id),
    options
  );
  return { ...data, ...rest } as const
};

export const useBatchJobsCancel = (
  id: string,
  options: UseMutationOptionsWrapper<Awaited<ReturnType<typeof client.batchJobs.cancel>>, unknown, void> = {}
) => {
  if (!options?.onSuccess) {
    const queryClient = useQueryClient()
    options.onSuccess = async () => {
      await queryClient.invalidateQueries('batchJobs')
    }
  }
  return useMutation<Awaited<ReturnType<typeof client.batchJobs.cancel>>, unknown, void>(
    ['batchJobs', 'cancel', id],
    () => client.batchJobs.cancel(id),
    options
  );
};

export const useBatchJobsConfirm = (
  id: string,
  options: UseMutationOptionsWrapper<Awaited<ReturnType<typeof client.batchJobs.confirm>>, unknown, void> = {}
) => {
  if (!options?.onSuccess) {
    const queryClient = useQueryClient()
    options.onSuccess = async () => {
      await queryClient.invalidateQueries('batchJobs')
    }
  }
  return useMutation<Awaited<ReturnType<typeof client.batchJobs.confirm>>, unknown, void>(
    ['batchJobs', 'confirm', id],
    () => client.batchJobs.confirm(id),
    options
  );
};


