/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { UseQueryOptionsWrapper, UseMutationOptionsWrapper} from '../core/HookUtils';
import { useMedusaAdmin } from '../useMedusaAdmin';
import type { AdminDeletePublishableApiKeySalesChannelsBatchReq } from '../models/AdminDeletePublishableApiKeySalesChannelsBatchReq';
import type { AdminPostPublishableApiKeySalesChannelsBatchReq } from '../models/AdminPostPublishableApiKeySalesChannelsBatchReq';
import type { AdminPostPublishableApiKeysPublishableApiKeyReq } from '../models/AdminPostPublishableApiKeysPublishableApiKeyReq';
import type { AdminPostPublishableApiKeysReq } from '../models/AdminPostPublishableApiKeysReq';
import type { AdminPublishableApiKeyDeleteRes } from '../models/AdminPublishableApiKeyDeleteRes';
import type { AdminPublishableApiKeysListRes } from '../models/AdminPublishableApiKeysListRes';
import type { AdminPublishableApiKeysListSalesChannelsRes } from '../models/AdminPublishableApiKeysListSalesChannelsRes';
import type { AdminPublishableApiKeysRes } from '../models/AdminPublishableApiKeysRes';
import type { GetPublishableApiKeySalesChannelsParams } from '../models/GetPublishableApiKeySalesChannelsParams';
import type { GetPublishableApiKeysParams } from '../models/GetPublishableApiKeysParams';

export const usePublishableApiKeyUpdate = (
  id: string,
  requestBody: AdminPostPublishableApiKeysPublishableApiKeyReq,
  options: UseMutationOptionsWrapper<Awaited<ReturnType<typeof client.publishableApiKey.update>>, unknown, AdminPostPublishableApiKeysPublishableApiKeyReq> = {}
) => {
  const { client } = useMedusaAdmin()
  if (!options?.onSuccess) {
    const queryClient = useQueryClient()
    options.onSuccess = async () => {
      await queryClient.invalidateQueries('publishableApiKey')
    }
  }
  return useMutation<Awaited<ReturnType<typeof client.publishableApiKey.update>>, unknown, AdminPostPublishableApiKeysPublishableApiKeyReq>(
    ['publishableApiKey', 'update', id,requestBody],
    () => client.publishableApiKey.update(id,requestBody),
    options
  );
};

export const usePublishableApiKeyList = (
  queryParams: GetPublishableApiKeysParams,
  options: UseQueryOptionsWrapper<Awaited<ReturnType<typeof client.publishableApiKey.list>>> = {}
) => {
  const { client } = useMedusaAdmin()
  const { data, ...rest } = useQuery<Awaited<ReturnType<typeof client.publishableApiKey.list>>>(
    ['publishableApiKey', 'list', queryParams],
    () => client.publishableApiKey.list(queryParams),
    options
  );
  return { ...data, ...rest } as const
};

export const usePublishableApiKeyCreate = (
  requestBody: AdminPostPublishableApiKeysReq,
  options: UseMutationOptionsWrapper<Awaited<ReturnType<typeof client.publishableApiKey.create>>, unknown, AdminPostPublishableApiKeysReq> = {}
) => {
  const { client } = useMedusaAdmin()
  if (!options?.onSuccess) {
    const queryClient = useQueryClient()
    options.onSuccess = async () => {
      await queryClient.invalidateQueries('publishableApiKey')
    }
  }
  return useMutation<Awaited<ReturnType<typeof client.publishableApiKey.create>>, unknown, AdminPostPublishableApiKeysReq>(
    ['publishableApiKey', 'create', requestBody],
    () => client.publishableApiKey.create(requestBody),
    options
  );
};

export const usePublishableApiKeyRetrieve = (
  id: string,
  options: UseQueryOptionsWrapper<Awaited<ReturnType<typeof client.publishableApiKey.retrieve>>> = {}
) => {
  const { client } = useMedusaAdmin()
  const { data, ...rest } = useQuery<Awaited<ReturnType<typeof client.publishableApiKey.retrieve>>>(
    ['publishableApiKey', 'retrieve', id],
    () => client.publishableApiKey.retrieve(id),
    options
  );
  return { ...data, ...rest } as const
};

export const usePublishableApiKeyDelete = (
  id: string,
  options: UseMutationOptionsWrapper<Awaited<ReturnType<typeof client.publishableApiKey.delete>>, unknown, void> = {}
) => {
  const { client } = useMedusaAdmin()
  if (!options?.onSuccess) {
    const queryClient = useQueryClient()
    options.onSuccess = async () => {
      await queryClient.invalidateQueries('publishableApiKey')
    }
  }
  return useMutation<Awaited<ReturnType<typeof client.publishableApiKey.delete>>, unknown, void>(
    ['publishableApiKey', 'delete', id],
    () => client.publishableApiKey.delete(id),
    options
  );
};

export const usePublishableApiKeyRevoke = (
  id: string,
  options: UseMutationOptionsWrapper<Awaited<ReturnType<typeof client.publishableApiKey.revoke>>, unknown, void> = {}
) => {
  const { client } = useMedusaAdmin()
  if (!options?.onSuccess) {
    const queryClient = useQueryClient()
    options.onSuccess = async () => {
      await queryClient.invalidateQueries('publishableApiKey')
    }
  }
  return useMutation<Awaited<ReturnType<typeof client.publishableApiKey.revoke>>, unknown, void>(
    ['publishableApiKey', 'revoke', id],
    () => client.publishableApiKey.revoke(id),
    options
  );
};

export const usePublishableApiKeyListSalesChannels = (
  id: string,
  queryParams: GetPublishableApiKeySalesChannelsParams,
  options: UseQueryOptionsWrapper<Awaited<ReturnType<typeof client.publishableApiKey.listSalesChannels>>> = {}
) => {
  const { client } = useMedusaAdmin()
  const { data, ...rest } = useQuery<Awaited<ReturnType<typeof client.publishableApiKey.listSalesChannels>>>(
    ['publishableApiKey', 'listSalesChannels', id,queryParams],
    () => client.publishableApiKey.listSalesChannels(id,queryParams),
    options
  );
  return { ...data, ...rest } as const
};

export const usePublishableApiKeyAddSalesChannelsBatch = (
  id: string,
  requestBody: AdminPostPublishableApiKeySalesChannelsBatchReq,
  options: UseMutationOptionsWrapper<Awaited<ReturnType<typeof client.publishableApiKey.addSalesChannelsBatch>>, unknown, AdminPostPublishableApiKeySalesChannelsBatchReq> = {}
) => {
  const { client } = useMedusaAdmin()
  if (!options?.onSuccess) {
    const queryClient = useQueryClient()
    options.onSuccess = async () => {
      await queryClient.invalidateQueries('publishableApiKey')
    }
  }
  return useMutation<Awaited<ReturnType<typeof client.publishableApiKey.addSalesChannelsBatch>>, unknown, AdminPostPublishableApiKeySalesChannelsBatchReq>(
    ['publishableApiKey', 'addSalesChannelsBatch', id,requestBody],
    () => client.publishableApiKey.addSalesChannelsBatch(id,requestBody),
    options
  );
};

export const usePublishableApiKeyDeleteSalesChannelsBatch = (
  id: string,
  requestBody: AdminDeletePublishableApiKeySalesChannelsBatchReq,
  options: UseMutationOptionsWrapper<Awaited<ReturnType<typeof client.publishableApiKey.deleteSalesChannelsBatch>>, unknown, AdminDeletePublishableApiKeySalesChannelsBatchReq> = {}
) => {
  const { client } = useMedusaAdmin()
  if (!options?.onSuccess) {
    const queryClient = useQueryClient()
    options.onSuccess = async () => {
      await queryClient.invalidateQueries('publishableApiKey')
    }
  }
  return useMutation<Awaited<ReturnType<typeof client.publishableApiKey.deleteSalesChannelsBatch>>, unknown, AdminDeletePublishableApiKeySalesChannelsBatchReq>(
    ['publishableApiKey', 'deleteSalesChannelsBatch', id,requestBody],
    () => client.publishableApiKey.deleteSalesChannelsBatch(id,requestBody),
    options
  );
};


