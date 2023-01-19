/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { UseQueryOptionsWrapper, UseMutationOptionsWrapper} from '../core/HookUtils';
import { useMedusaAdmin } from '../useMedusaAdmin';
import type { AdminDeleteSalesChannelsChannelProductsBatchReq } from '../models/AdminDeleteSalesChannelsChannelProductsBatchReq';
import type { AdminDeleteSalesChannelsChannelStockLocationsReq } from '../models/AdminDeleteSalesChannelsChannelStockLocationsReq';
import type { AdminGetSalesChannelsParams } from '../models/AdminGetSalesChannelsParams';
import type { AdminGetStockLocationsParams } from '../models/AdminGetStockLocationsParams';
import type { AdminPostSalesChannelsChannelProductsBatchReq } from '../models/AdminPostSalesChannelsChannelProductsBatchReq';
import type { AdminPostSalesChannelsChannelStockLocationsReq } from '../models/AdminPostSalesChannelsChannelStockLocationsReq';
import type { AdminPostSalesChannelsReq } from '../models/AdminPostSalesChannelsReq';
import type { AdminPostSalesChannelsSalesChannelReq } from '../models/AdminPostSalesChannelsSalesChannelReq';
import type { AdminSalesChannelsDeleteLocationRes } from '../models/AdminSalesChannelsDeleteLocationRes';
import type { AdminSalesChannelsDeleteRes } from '../models/AdminSalesChannelsDeleteRes';
import type { AdminSalesChannelsListRes } from '../models/AdminSalesChannelsListRes';
import type { AdminSalesChannelsRes } from '../models/AdminSalesChannelsRes';
import type { AdminStockLocationsListRes } from '../models/AdminStockLocationsListRes';

const { client } = useMedusaAdmin()

export const useSalesChannelList = (
  queryParams: AdminGetSalesChannelsParams,
  options: UseQueryOptionsWrapper<Awaited<ReturnType<typeof client.salesChannel.list>>> = {}
) => {
  const { data, ...rest } = useQuery<Awaited<ReturnType<typeof client.salesChannel.list>>>(
    ['salesChannel', 'list', queryParams],
    () => client.salesChannel.list(queryParams),
    options
  );
  return { ...data, ...rest } as const
};

export const useSalesChannelCreate = (
  requestBody: AdminPostSalesChannelsReq,
  options: UseMutationOptionsWrapper<Awaited<ReturnType<typeof client.salesChannel.create>>, unknown, AdminPostSalesChannelsReq> = {}
) => {
  if (!options?.onSuccess) {
    const queryClient = useQueryClient()
    options.onSuccess = async () => {
      await queryClient.invalidateQueries('salesChannel')
    }
  }
  return useMutation<Awaited<ReturnType<typeof client.salesChannel.create>>, unknown, AdminPostSalesChannelsReq>(
    ['salesChannel', 'create', requestBody],
    () => client.salesChannel.create(requestBody),
    options
  );
};

export const useSalesChannelRetrieve = (
  id: string,
  options: UseQueryOptionsWrapper<Awaited<ReturnType<typeof client.salesChannel.retrieve>>> = {}
) => {
  const { data, ...rest } = useQuery<Awaited<ReturnType<typeof client.salesChannel.retrieve>>>(
    ['salesChannel', 'retrieve', id],
    () => client.salesChannel.retrieve(id),
    options
  );
  return { ...data, ...rest } as const
};

export const useSalesChannelUpdate = (
  id: string,
  requestBody: AdminPostSalesChannelsSalesChannelReq,
  options: UseMutationOptionsWrapper<Awaited<ReturnType<typeof client.salesChannel.update>>, unknown, AdminPostSalesChannelsSalesChannelReq> = {}
) => {
  if (!options?.onSuccess) {
    const queryClient = useQueryClient()
    options.onSuccess = async () => {
      await queryClient.invalidateQueries('salesChannel')
    }
  }
  return useMutation<Awaited<ReturnType<typeof client.salesChannel.update>>, unknown, AdminPostSalesChannelsSalesChannelReq>(
    ['salesChannel', 'update', id,requestBody],
    () => client.salesChannel.update(id,requestBody),
    options
  );
};

export const useSalesChannelDelete = (
  id: string,
  options: UseMutationOptionsWrapper<Awaited<ReturnType<typeof client.salesChannel.delete>>, unknown, void> = {}
) => {
  if (!options?.onSuccess) {
    const queryClient = useQueryClient()
    options.onSuccess = async () => {
      await queryClient.invalidateQueries('salesChannel')
    }
  }
  return useMutation<Awaited<ReturnType<typeof client.salesChannel.delete>>, unknown, void>(
    ['salesChannel', 'delete', id],
    () => client.salesChannel.delete(id),
    options
  );
};

export const useSalesChannelAddProducts = (
  id: string,
  requestBody: AdminPostSalesChannelsChannelProductsBatchReq,
  options: UseMutationOptionsWrapper<Awaited<ReturnType<typeof client.salesChannel.addProducts>>, unknown, AdminPostSalesChannelsChannelProductsBatchReq> = {}
) => {
  if (!options?.onSuccess) {
    const queryClient = useQueryClient()
    options.onSuccess = async () => {
      await queryClient.invalidateQueries('salesChannel')
    }
  }
  return useMutation<Awaited<ReturnType<typeof client.salesChannel.addProducts>>, unknown, AdminPostSalesChannelsChannelProductsBatchReq>(
    ['salesChannel', 'addProducts', id,requestBody],
    () => client.salesChannel.addProducts(id,requestBody),
    options
  );
};

export const useSalesChannelRemoveProducts = (
  id: string,
  requestBody: AdminDeleteSalesChannelsChannelProductsBatchReq,
  options: UseMutationOptionsWrapper<Awaited<ReturnType<typeof client.salesChannel.removeProducts>>, unknown, AdminDeleteSalesChannelsChannelProductsBatchReq> = {}
) => {
  if (!options?.onSuccess) {
    const queryClient = useQueryClient()
    options.onSuccess = async () => {
      await queryClient.invalidateQueries('salesChannel')
    }
  }
  return useMutation<Awaited<ReturnType<typeof client.salesChannel.removeProducts>>, unknown, AdminDeleteSalesChannelsChannelProductsBatchReq>(
    ['salesChannel', 'removeProducts', id,requestBody],
    () => client.salesChannel.removeProducts(id,requestBody),
    options
  );
};

export const useSalesChannelAddLocation = (
  id: string,
  requestBody: AdminPostSalesChannelsChannelStockLocationsReq,
  options: UseMutationOptionsWrapper<Awaited<ReturnType<typeof client.salesChannel.addLocation>>, unknown, AdminPostSalesChannelsChannelStockLocationsReq> = {}
) => {
  if (!options?.onSuccess) {
    const queryClient = useQueryClient()
    options.onSuccess = async () => {
      await queryClient.invalidateQueries('salesChannel')
    }
  }
  return useMutation<Awaited<ReturnType<typeof client.salesChannel.addLocation>>, unknown, AdminPostSalesChannelsChannelStockLocationsReq>(
    ['salesChannel', 'addLocation', id,requestBody],
    () => client.salesChannel.addLocation(id,requestBody),
    options
  );
};

export const useSalesChannelRemoveLocation = (
  id: string,
  requestBody: AdminDeleteSalesChannelsChannelStockLocationsReq,
  options: UseMutationOptionsWrapper<Awaited<ReturnType<typeof client.salesChannel.removeLocation>>, unknown, AdminDeleteSalesChannelsChannelStockLocationsReq> = {}
) => {
  if (!options?.onSuccess) {
    const queryClient = useQueryClient()
    options.onSuccess = async () => {
      await queryClient.invalidateQueries('salesChannel')
    }
  }
  return useMutation<Awaited<ReturnType<typeof client.salesChannel.removeLocation>>, unknown, AdminDeleteSalesChannelsChannelStockLocationsReq>(
    ['salesChannel', 'removeLocation', id,requestBody],
    () => client.salesChannel.removeLocation(id,requestBody),
    options
  );
};

export const useSalesChannelList1 = (
  queryParams: AdminGetStockLocationsParams,
  options: UseQueryOptionsWrapper<Awaited<ReturnType<typeof client.salesChannel.list1>>> = {}
) => {
  const { data, ...rest } = useQuery<Awaited<ReturnType<typeof client.salesChannel.list1>>>(
    ['salesChannel', 'list1', queryParams],
    () => client.salesChannel.list1(queryParams),
    options
  );
  return { ...data, ...rest } as const
};


