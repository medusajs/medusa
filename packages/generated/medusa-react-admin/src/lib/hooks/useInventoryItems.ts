/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { UseQueryOptionsWrapper, UseMutationOptionsWrapper} from '../core/HookUtils';
import { useMedusaAdmin } from '../useMedusaAdmin';
import type { AdminGetInventoryItemsItemLocationLevelsParams } from '@medusajs/client-types';
import type { AdminGetInventoryItemsItemParams } from '@medusajs/client-types';
import type { AdminGetInventoryItemsParams } from '@medusajs/client-types';
import type { AdminInventoryItemsDeleteRes } from '@medusajs/client-types';
import type { AdminInventoryItemsListWithVariantsAndLocationLevelsRes } from '@medusajs/client-types';
import type { AdminInventoryItemsLocationLevelsRes } from '@medusajs/client-types';
import type { AdminInventoryItemsRes } from '@medusajs/client-types';
import type { AdminPostInventoryItemsInventoryItemParams } from '@medusajs/client-types';
import type { AdminPostInventoryItemsInventoryItemReq } from '@medusajs/client-types';
import type { AdminPostInventoryItemsItemLocationLevelsLevelParams } from '@medusajs/client-types';
import type { AdminPostInventoryItemsItemLocationLevelsLevelReq } from '@medusajs/client-types';
import type { AdminPostInventoryItemsItemLocationLevelsParams } from '@medusajs/client-types';
import type { AdminPostInventoryItemsItemLocationLevelsReq } from '@medusajs/client-types';
import type { AdminPostInventoryItemsParams } from '@medusajs/client-types';
import type { AdminPostInventoryItemsReq } from '@medusajs/client-types';

const { client } = useMedusaAdmin()

export const useInventoryItemsList = (
  queryParams: AdminGetInventoryItemsParams,
  options: UseQueryOptionsWrapper<Awaited<ReturnType<typeof client.inventoryItems.list>>> = {}
) => {
  const { data, ...rest } = useQuery<Awaited<ReturnType<typeof client.inventoryItems.list>>>(
    ['inventoryItems', 'list', queryParams],
    () => client.inventoryItems.list(queryParams),
    options
  );
  return { ...data, ...rest } as const
};

export const useInventoryItemsCreate = (
  requestBody: AdminPostInventoryItemsReq,
  queryParams: AdminPostInventoryItemsParams,
  options: UseMutationOptionsWrapper<Awaited<ReturnType<typeof client.inventoryItems.create>>, unknown, AdminPostInventoryItemsReq> = {}
) => {
  if (!options?.onSuccess) {
    const queryClient = useQueryClient()
    options.onSuccess = async () => {
      await queryClient.invalidateQueries('inventoryItems')
    }
  }
  return useMutation<Awaited<ReturnType<typeof client.inventoryItems.create>>, unknown, AdminPostInventoryItemsReq>(
    ['inventoryItems', 'create', requestBody,queryParams],
    () => client.inventoryItems.create(requestBody,queryParams),
    options
  );
};

export const useInventoryItemsRetrieve = (
  id: string,
  queryParams: AdminGetInventoryItemsItemParams,
  options: UseQueryOptionsWrapper<Awaited<ReturnType<typeof client.inventoryItems.retrieve>>> = {}
) => {
  const { data, ...rest } = useQuery<Awaited<ReturnType<typeof client.inventoryItems.retrieve>>>(
    ['inventoryItems', 'retrieve', id,queryParams],
    () => client.inventoryItems.retrieve(id,queryParams),
    options
  );
  return { ...data, ...rest } as const
};

export const useInventoryItemsUpdate = (
  id: string,
  requestBody: AdminPostInventoryItemsInventoryItemReq,
  queryParams: AdminPostInventoryItemsInventoryItemParams,
  options: UseMutationOptionsWrapper<Awaited<ReturnType<typeof client.inventoryItems.update>>, unknown, AdminPostInventoryItemsInventoryItemReq> = {}
) => {
  if (!options?.onSuccess) {
    const queryClient = useQueryClient()
    options.onSuccess = async () => {
      await queryClient.invalidateQueries('inventoryItems')
    }
  }
  return useMutation<Awaited<ReturnType<typeof client.inventoryItems.update>>, unknown, AdminPostInventoryItemsInventoryItemReq>(
    ['inventoryItems', 'update', id,requestBody,queryParams],
    () => client.inventoryItems.update(id,requestBody,queryParams),
    options
  );
};

export const useInventoryItemsDelete = (
  id: string,
  options: UseMutationOptionsWrapper<Awaited<ReturnType<typeof client.inventoryItems.delete>>, unknown, void> = {}
) => {
  if (!options?.onSuccess) {
    const queryClient = useQueryClient()
    options.onSuccess = async () => {
      await queryClient.invalidateQueries('inventoryItems')
    }
  }
  return useMutation<Awaited<ReturnType<typeof client.inventoryItems.delete>>, unknown, void>(
    ['inventoryItems', 'delete', id],
    () => client.inventoryItems.delete(id),
    options
  );
};

export const useInventoryItemsListLocationLevels = (
  id: string,
  queryParams: AdminGetInventoryItemsItemLocationLevelsParams,
  options: UseQueryOptionsWrapper<Awaited<ReturnType<typeof client.inventoryItems.listLocationLevels>>> = {}
) => {
  const { data, ...rest } = useQuery<Awaited<ReturnType<typeof client.inventoryItems.listLocationLevels>>>(
    ['inventoryItems', 'listLocationLevels', id,queryParams],
    () => client.inventoryItems.listLocationLevels(id,queryParams),
    options
  );
  return { ...data, ...rest } as const
};

export const useInventoryItemsCreateLocationLevel = (
  id: string,
  requestBody: AdminPostInventoryItemsItemLocationLevelsReq,
  queryParams: AdminPostInventoryItemsItemLocationLevelsParams,
  options: UseMutationOptionsWrapper<Awaited<ReturnType<typeof client.inventoryItems.createLocationLevel>>, unknown, AdminPostInventoryItemsItemLocationLevelsReq> = {}
) => {
  if (!options?.onSuccess) {
    const queryClient = useQueryClient()
    options.onSuccess = async () => {
      await queryClient.invalidateQueries('inventoryItems')
    }
  }
  return useMutation<Awaited<ReturnType<typeof client.inventoryItems.createLocationLevel>>, unknown, AdminPostInventoryItemsItemLocationLevelsReq>(
    ['inventoryItems', 'createLocationLevel', id,requestBody,queryParams],
    () => client.inventoryItems.createLocationLevel(id,requestBody,queryParams),
    options
  );
};

export const useInventoryItemsUpdateLocationLevel = (
  id: string,
  locationId: string,
  requestBody: AdminPostInventoryItemsItemLocationLevelsLevelReq,
  queryParams: AdminPostInventoryItemsItemLocationLevelsLevelParams,
  options: UseMutationOptionsWrapper<Awaited<ReturnType<typeof client.inventoryItems.updateLocationLevel>>, unknown, AdminPostInventoryItemsItemLocationLevelsLevelReq> = {}
) => {
  if (!options?.onSuccess) {
    const queryClient = useQueryClient()
    options.onSuccess = async () => {
      await queryClient.invalidateQueries('inventoryItems')
    }
  }
  return useMutation<Awaited<ReturnType<typeof client.inventoryItems.updateLocationLevel>>, unknown, AdminPostInventoryItemsItemLocationLevelsLevelReq>(
    ['inventoryItems', 'updateLocationLevel', id,locationId,requestBody,queryParams],
    () => client.inventoryItems.updateLocationLevel(id,locationId,requestBody,queryParams),
    options
  );
};

export const useInventoryItemsDeleteLocationLevel = (
  id: string,
  locationId: string,
  options: UseMutationOptionsWrapper<Awaited<ReturnType<typeof client.inventoryItems.deleteLocationLevel>>, unknown, void> = {}
) => {
  if (!options?.onSuccess) {
    const queryClient = useQueryClient()
    options.onSuccess = async () => {
      await queryClient.invalidateQueries('inventoryItems')
    }
  }
  return useMutation<Awaited<ReturnType<typeof client.inventoryItems.deleteLocationLevel>>, unknown, void>(
    ['inventoryItems', 'deleteLocationLevel', id,locationId],
    () => client.inventoryItems.deleteLocationLevel(id,locationId),
    options
  );
};


