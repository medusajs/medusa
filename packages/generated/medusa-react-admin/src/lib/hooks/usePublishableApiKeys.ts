/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { UseQueryOptionsWrapper, UseMutationOptionsWrapper} from '../core/HookUtils';
import { useMedusaAdmin } from '../useMedusaAdmin';
import type { AdminDeletePublishableApiKeySalesChannelsBatchReq } from '@medusajs/client-types';
import type { AdminPostPublishableApiKeySalesChannelsBatchReq } from '@medusajs/client-types';
import type { AdminPostPublishableApiKeysPublishableApiKeyReq } from '@medusajs/client-types';
import type { AdminPostPublishableApiKeysReq } from '@medusajs/client-types';
import type { AdminPublishableApiKeyDeleteRes } from '@medusajs/client-types';
import type { AdminPublishableApiKeysListRes } from '@medusajs/client-types';
import type { AdminPublishableApiKeysListSalesChannelsRes } from '@medusajs/client-types';
import type { AdminPublishableApiKeysRes } from '@medusajs/client-types';
import type { GetPublishableApiKeySalesChannelsParams } from '@medusajs/client-types';
import type { GetPublishableApiKeysParams } from '@medusajs/client-types';

const { client } = useMedusaAdmin()

export const usePublishableApiKeysUpdate = (
  id: string,
  requestBody: AdminPostPublishableApiKeysPublishableApiKeyReq,
  options: UseMutationOptionsWrapper<Awaited<ReturnType<typeof client.publishableApiKeys.update>>, unknown, AdminPostPublishableApiKeysPublishableApiKeyReq> = {}
) => {
  if (!options?.onSuccess) {
    const queryClient = useQueryClient()
    options.onSuccess = async () => {
      await queryClient.invalidateQueries('publishableApiKeys')
    }
  }
  return useMutation<Awaited<ReturnType<typeof client.publishableApiKeys.update>>, unknown, AdminPostPublishableApiKeysPublishableApiKeyReq>(
    ['publishableApiKeys', 'update', id,requestBody],
    () => client.publishableApiKeys.update(id,requestBody),
    options
  );
};

export const usePublishableApiKeysList = (
  queryParams: GetPublishableApiKeysParams,
  options: UseQueryOptionsWrapper<Awaited<ReturnType<typeof client.publishableApiKeys.list>>> = {}
) => {
  const { data, ...rest } = useQuery<Awaited<ReturnType<typeof client.publishableApiKeys.list>>>(
    ['publishableApiKeys', 'list', queryParams],
    () => client.publishableApiKeys.list(queryParams),
    options
  );
  return { ...data, ...rest } as const
};

export const usePublishableApiKeysCreate = (
  requestBody: AdminPostPublishableApiKeysReq,
  options: UseMutationOptionsWrapper<Awaited<ReturnType<typeof client.publishableApiKeys.create>>, unknown, AdminPostPublishableApiKeysReq> = {}
) => {
  if (!options?.onSuccess) {
    const queryClient = useQueryClient()
    options.onSuccess = async () => {
      await queryClient.invalidateQueries('publishableApiKeys')
    }
  }
  return useMutation<Awaited<ReturnType<typeof client.publishableApiKeys.create>>, unknown, AdminPostPublishableApiKeysReq>(
    ['publishableApiKeys', 'create', requestBody],
    () => client.publishableApiKeys.create(requestBody),
    options
  );
};

export const usePublishableApiKeysRetrieve = (
  id: string,
  options: UseQueryOptionsWrapper<Awaited<ReturnType<typeof client.publishableApiKeys.retrieve>>> = {}
) => {
  const { data, ...rest } = useQuery<Awaited<ReturnType<typeof client.publishableApiKeys.retrieve>>>(
    ['publishableApiKeys', 'retrieve', id],
    () => client.publishableApiKeys.retrieve(id),
    options
  );
  return { ...data, ...rest } as const
};

export const usePublishableApiKeysDelete = (
  id: string,
  options: UseMutationOptionsWrapper<Awaited<ReturnType<typeof client.publishableApiKeys.delete>>, unknown, void> = {}
) => {
  if (!options?.onSuccess) {
    const queryClient = useQueryClient()
    options.onSuccess = async () => {
      await queryClient.invalidateQueries('publishableApiKeys')
    }
  }
  return useMutation<Awaited<ReturnType<typeof client.publishableApiKeys.delete>>, unknown, void>(
    ['publishableApiKeys', 'delete', id],
    () => client.publishableApiKeys.delete(id),
    options
  );
};

export const usePublishableApiKeysRevoke = (
  id: string,
  options: UseMutationOptionsWrapper<Awaited<ReturnType<typeof client.publishableApiKeys.revoke>>, unknown, void> = {}
) => {
  if (!options?.onSuccess) {
    const queryClient = useQueryClient()
    options.onSuccess = async () => {
      await queryClient.invalidateQueries('publishableApiKeys')
    }
  }
  return useMutation<Awaited<ReturnType<typeof client.publishableApiKeys.revoke>>, unknown, void>(
    ['publishableApiKeys', 'revoke', id],
    () => client.publishableApiKeys.revoke(id),
    options
  );
};

export const usePublishableApiKeysListSalesChannels = (
  id: string,
  queryParams: GetPublishableApiKeySalesChannelsParams,
  options: UseQueryOptionsWrapper<Awaited<ReturnType<typeof client.publishableApiKeys.listSalesChannels>>> = {}
) => {
  const { data, ...rest } = useQuery<Awaited<ReturnType<typeof client.publishableApiKeys.listSalesChannels>>>(
    ['publishableApiKeys', 'listSalesChannels', id,queryParams],
    () => client.publishableApiKeys.listSalesChannels(id,queryParams),
    options
  );
  return { ...data, ...rest } as const
};

export const usePublishableApiKeysAddSalesChannelsBatch = (
  id: string,
  requestBody: AdminPostPublishableApiKeySalesChannelsBatchReq,
  options: UseMutationOptionsWrapper<Awaited<ReturnType<typeof client.publishableApiKeys.addSalesChannelsBatch>>, unknown, AdminPostPublishableApiKeySalesChannelsBatchReq> = {}
) => {
  if (!options?.onSuccess) {
    const queryClient = useQueryClient()
    options.onSuccess = async () => {
      await queryClient.invalidateQueries('publishableApiKeys')
    }
  }
  return useMutation<Awaited<ReturnType<typeof client.publishableApiKeys.addSalesChannelsBatch>>, unknown, AdminPostPublishableApiKeySalesChannelsBatchReq>(
    ['publishableApiKeys', 'addSalesChannelsBatch', id,requestBody],
    () => client.publishableApiKeys.addSalesChannelsBatch(id,requestBody),
    options
  );
};

export const usePublishableApiKeysDeleteSalesChannelsBatch = (
  id: string,
  requestBody: AdminDeletePublishableApiKeySalesChannelsBatchReq,
  options: UseMutationOptionsWrapper<Awaited<ReturnType<typeof client.publishableApiKeys.deleteSalesChannelsBatch>>, unknown, AdminDeletePublishableApiKeySalesChannelsBatchReq> = {}
) => {
  if (!options?.onSuccess) {
    const queryClient = useQueryClient()
    options.onSuccess = async () => {
      await queryClient.invalidateQueries('publishableApiKeys')
    }
  }
  return useMutation<Awaited<ReturnType<typeof client.publishableApiKeys.deleteSalesChannelsBatch>>, unknown, AdminDeletePublishableApiKeySalesChannelsBatchReq>(
    ['publishableApiKeys', 'deleteSalesChannelsBatch', id,requestBody],
    () => client.publishableApiKeys.deleteSalesChannelsBatch(id,requestBody),
    options
  );
};


