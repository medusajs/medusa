/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { UseQueryOptionsWrapper, UseMutationOptionsWrapper} from '../core/HookUtils';
import { useMedusaAdmin } from '../useMedusaAdmin';
import type { AdminDeleteSalesChannelsChannelProductsBatchReq } from '@medusajs/client-types';
import type { AdminDeleteSalesChannelsChannelStockLocationsReq } from '@medusajs/client-types';
import type { AdminGetSalesChannelsParams } from '@medusajs/client-types';
import type { AdminPostSalesChannelsChannelProductsBatchReq } from '@medusajs/client-types';
import type { AdminPostSalesChannelsChannelStockLocationsReq } from '@medusajs/client-types';
import type { AdminPostSalesChannelsReq } from '@medusajs/client-types';
import type { AdminPostSalesChannelsSalesChannelReq } from '@medusajs/client-types';
import type { AdminSalesChannelsDeleteLocationRes } from '@medusajs/client-types';
import type { AdminSalesChannelsDeleteRes } from '@medusajs/client-types';
import type { AdminSalesChannelsListRes } from '@medusajs/client-types';
import type { AdminSalesChannelsRes } from '@medusajs/client-types';

const { client } = useMedusaAdmin()

export const useSalesChannelsList = (
  queryParams: AdminGetSalesChannelsParams,
  options: UseQueryOptionsWrapper<Awaited<ReturnType<typeof client.salesChannels.list>>> = {}
) => {
  const { data, ...rest } = useQuery<Awaited<ReturnType<typeof client.salesChannels.list>>>(
    ['salesChannels', 'list', queryParams],
    () => client.salesChannels.list(queryParams),
    options
  );
  return { ...data, ...rest } as const
};

export const useSalesChannelsCreate = (
  requestBody: AdminPostSalesChannelsReq,
  options: UseMutationOptionsWrapper<Awaited<ReturnType<typeof client.salesChannels.create>>, unknown, AdminPostSalesChannelsReq> = {}
) => {
  if (!options?.onSuccess) {
    const queryClient = useQueryClient()
    options.onSuccess = async () => {
      await queryClient.invalidateQueries('salesChannels')
    }
  }
  return useMutation<Awaited<ReturnType<typeof client.salesChannels.create>>, unknown, AdminPostSalesChannelsReq>(
    ['salesChannels', 'create', requestBody],
    () => client.salesChannels.create(requestBody),
    options
  );
};

export const useSalesChannelsRetrieve = (
  id: string,
  options: UseQueryOptionsWrapper<Awaited<ReturnType<typeof client.salesChannels.retrieve>>> = {}
) => {
  const { data, ...rest } = useQuery<Awaited<ReturnType<typeof client.salesChannels.retrieve>>>(
    ['salesChannels', 'retrieve', id],
    () => client.salesChannels.retrieve(id),
    options
  );
  return { ...data, ...rest } as const
};

export const useSalesChannelsUpdate = (
  id: string,
  requestBody: AdminPostSalesChannelsSalesChannelReq,
  options: UseMutationOptionsWrapper<Awaited<ReturnType<typeof client.salesChannels.update>>, unknown, AdminPostSalesChannelsSalesChannelReq> = {}
) => {
  if (!options?.onSuccess) {
    const queryClient = useQueryClient()
    options.onSuccess = async () => {
      await queryClient.invalidateQueries('salesChannels')
    }
  }
  return useMutation<Awaited<ReturnType<typeof client.salesChannels.update>>, unknown, AdminPostSalesChannelsSalesChannelReq>(
    ['salesChannels', 'update', id,requestBody],
    () => client.salesChannels.update(id,requestBody),
    options
  );
};

export const useSalesChannelsDelete = (
  id: string,
  options: UseMutationOptionsWrapper<Awaited<ReturnType<typeof client.salesChannels.delete>>, unknown, void> = {}
) => {
  if (!options?.onSuccess) {
    const queryClient = useQueryClient()
    options.onSuccess = async () => {
      await queryClient.invalidateQueries('salesChannels')
    }
  }
  return useMutation<Awaited<ReturnType<typeof client.salesChannels.delete>>, unknown, void>(
    ['salesChannels', 'delete', id],
    () => client.salesChannels.delete(id),
    options
  );
};

export const useSalesChannelsAddProducts = (
  id: string,
  requestBody: AdminPostSalesChannelsChannelProductsBatchReq,
  options: UseMutationOptionsWrapper<Awaited<ReturnType<typeof client.salesChannels.addProducts>>, unknown, AdminPostSalesChannelsChannelProductsBatchReq> = {}
) => {
  if (!options?.onSuccess) {
    const queryClient = useQueryClient()
    options.onSuccess = async () => {
      await queryClient.invalidateQueries('salesChannels')
    }
  }
  return useMutation<Awaited<ReturnType<typeof client.salesChannels.addProducts>>, unknown, AdminPostSalesChannelsChannelProductsBatchReq>(
    ['salesChannels', 'addProducts', id,requestBody],
    () => client.salesChannels.addProducts(id,requestBody),
    options
  );
};

export const useSalesChannelsRemoveProducts = (
  id: string,
  requestBody: AdminDeleteSalesChannelsChannelProductsBatchReq,
  options: UseMutationOptionsWrapper<Awaited<ReturnType<typeof client.salesChannels.removeProducts>>, unknown, AdminDeleteSalesChannelsChannelProductsBatchReq> = {}
) => {
  if (!options?.onSuccess) {
    const queryClient = useQueryClient()
    options.onSuccess = async () => {
      await queryClient.invalidateQueries('salesChannels')
    }
  }
  return useMutation<Awaited<ReturnType<typeof client.salesChannels.removeProducts>>, unknown, AdminDeleteSalesChannelsChannelProductsBatchReq>(
    ['salesChannels', 'removeProducts', id,requestBody],
    () => client.salesChannels.removeProducts(id,requestBody),
    options
  );
};

export const useSalesChannelsAddLocation = (
  id: string,
  requestBody: AdminPostSalesChannelsChannelStockLocationsReq,
  options: UseMutationOptionsWrapper<Awaited<ReturnType<typeof client.salesChannels.addLocation>>, unknown, AdminPostSalesChannelsChannelStockLocationsReq> = {}
) => {
  if (!options?.onSuccess) {
    const queryClient = useQueryClient()
    options.onSuccess = async () => {
      await queryClient.invalidateQueries('salesChannels')
    }
  }
  return useMutation<Awaited<ReturnType<typeof client.salesChannels.addLocation>>, unknown, AdminPostSalesChannelsChannelStockLocationsReq>(
    ['salesChannels', 'addLocation', id,requestBody],
    () => client.salesChannels.addLocation(id,requestBody),
    options
  );
};

export const useSalesChannelsRemoveLocation = (
  id: string,
  requestBody: AdminDeleteSalesChannelsChannelStockLocationsReq,
  options: UseMutationOptionsWrapper<Awaited<ReturnType<typeof client.salesChannels.removeLocation>>, unknown, AdminDeleteSalesChannelsChannelStockLocationsReq> = {}
) => {
  if (!options?.onSuccess) {
    const queryClient = useQueryClient()
    options.onSuccess = async () => {
      await queryClient.invalidateQueries('salesChannels')
    }
  }
  return useMutation<Awaited<ReturnType<typeof client.salesChannels.removeLocation>>, unknown, AdminDeleteSalesChannelsChannelStockLocationsReq>(
    ['salesChannels', 'removeLocation', id,requestBody],
    () => client.salesChannels.removeLocation(id,requestBody),
    options
  );
};


