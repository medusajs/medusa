/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { UseQueryOptionsWrapper, UseMutationOptionsWrapper} from '../core/HookUtils';
import { useMedusaAdmin } from '../useMedusaAdmin';
import type { AdminCustomerGroupsDeleteRes } from '@medusajs/client-types';
import type { AdminCustomerGroupsListRes } from '@medusajs/client-types';
import type { AdminCustomerGroupsRes } from '@medusajs/client-types';
import type { AdminCustomersListRes } from '@medusajs/client-types';
import type { AdminDeleteCustomerGroupsGroupCustomerBatchReq } from '@medusajs/client-types';
import type { AdminGetCustomerGroupsGroupParams } from '@medusajs/client-types';
import type { AdminGetCustomerGroupsParams } from '@medusajs/client-types';
import type { AdminGetGroupsGroupCustomersParams } from '@medusajs/client-types';
import type { AdminPostCustomerGroupsGroupCustomersBatchReq } from '@medusajs/client-types';
import type { AdminPostCustomerGroupsGroupReq } from '@medusajs/client-types';
import type { AdminPostCustomerGroupsReq } from '@medusajs/client-types';

const { client } = useMedusaAdmin()

export const useCustomerGroupsList = (
  queryParams: AdminGetCustomerGroupsParams,
  options: UseQueryOptionsWrapper<Awaited<ReturnType<typeof client.customerGroups.list>>> = {}
) => {
  const { data, ...rest } = useQuery<Awaited<ReturnType<typeof client.customerGroups.list>>>(
    ['customerGroups', 'list', queryParams],
    () => client.customerGroups.list(queryParams),
    options
  );
  return { ...data, ...rest } as const
};

export const useCustomerGroupsCreate = (
  requestBody: AdminPostCustomerGroupsReq,
  options: UseMutationOptionsWrapper<Awaited<ReturnType<typeof client.customerGroups.create>>, unknown, AdminPostCustomerGroupsReq> = {}
) => {
  if (!options?.onSuccess) {
    const queryClient = useQueryClient()
    options.onSuccess = async () => {
      await queryClient.invalidateQueries('customerGroups')
    }
  }
  return useMutation<Awaited<ReturnType<typeof client.customerGroups.create>>, unknown, AdminPostCustomerGroupsReq>(
    ['customerGroups', 'create', requestBody],
    () => client.customerGroups.create(requestBody),
    options
  );
};

export const useCustomerGroupsRetrieve = (
  id: string,
  queryParams: AdminGetCustomerGroupsGroupParams,
  options: UseQueryOptionsWrapper<Awaited<ReturnType<typeof client.customerGroups.retrieve>>> = {}
) => {
  const { data, ...rest } = useQuery<Awaited<ReturnType<typeof client.customerGroups.retrieve>>>(
    ['customerGroups', 'retrieve', id,queryParams],
    () => client.customerGroups.retrieve(id,queryParams),
    options
  );
  return { ...data, ...rest } as const
};

export const useCustomerGroupsUpdate = (
  id: string,
  requestBody: AdminPostCustomerGroupsGroupReq,
  options: UseMutationOptionsWrapper<Awaited<ReturnType<typeof client.customerGroups.update>>, unknown, AdminPostCustomerGroupsGroupReq> = {}
) => {
  if (!options?.onSuccess) {
    const queryClient = useQueryClient()
    options.onSuccess = async () => {
      await queryClient.invalidateQueries('customerGroups')
    }
  }
  return useMutation<Awaited<ReturnType<typeof client.customerGroups.update>>, unknown, AdminPostCustomerGroupsGroupReq>(
    ['customerGroups', 'update', id,requestBody],
    () => client.customerGroups.update(id,requestBody),
    options
  );
};

export const useCustomerGroupsDelete = (
  id: string,
  options: UseMutationOptionsWrapper<Awaited<ReturnType<typeof client.customerGroups.delete>>, unknown, void> = {}
) => {
  if (!options?.onSuccess) {
    const queryClient = useQueryClient()
    options.onSuccess = async () => {
      await queryClient.invalidateQueries('customerGroups')
    }
  }
  return useMutation<Awaited<ReturnType<typeof client.customerGroups.delete>>, unknown, void>(
    ['customerGroups', 'delete', id],
    () => client.customerGroups.delete(id),
    options
  );
};

export const useCustomerGroupsListCustomers = (
  id: string,
  queryParams: AdminGetGroupsGroupCustomersParams,
  options: UseQueryOptionsWrapper<Awaited<ReturnType<typeof client.customerGroups.listCustomers>>> = {}
) => {
  const { data, ...rest } = useQuery<Awaited<ReturnType<typeof client.customerGroups.listCustomers>>>(
    ['customerGroups', 'listCustomers', id,queryParams],
    () => client.customerGroups.listCustomers(id,queryParams),
    options
  );
  return { ...data, ...rest } as const
};

export const useCustomerGroupsAddCustomers = (
  id: string,
  requestBody: AdminPostCustomerGroupsGroupCustomersBatchReq,
  options: UseMutationOptionsWrapper<Awaited<ReturnType<typeof client.customerGroups.addCustomers>>, unknown, AdminPostCustomerGroupsGroupCustomersBatchReq> = {}
) => {
  if (!options?.onSuccess) {
    const queryClient = useQueryClient()
    options.onSuccess = async () => {
      await queryClient.invalidateQueries('customerGroups')
    }
  }
  return useMutation<Awaited<ReturnType<typeof client.customerGroups.addCustomers>>, unknown, AdminPostCustomerGroupsGroupCustomersBatchReq>(
    ['customerGroups', 'addCustomers', id,requestBody],
    () => client.customerGroups.addCustomers(id,requestBody),
    options
  );
};

export const useCustomerGroupsRemoveCustomers = (
  id: string,
  requestBody: AdminDeleteCustomerGroupsGroupCustomerBatchReq,
  options: UseMutationOptionsWrapper<Awaited<ReturnType<typeof client.customerGroups.removeCustomers>>, unknown, AdminDeleteCustomerGroupsGroupCustomerBatchReq> = {}
) => {
  if (!options?.onSuccess) {
    const queryClient = useQueryClient()
    options.onSuccess = async () => {
      await queryClient.invalidateQueries('customerGroups')
    }
  }
  return useMutation<Awaited<ReturnType<typeof client.customerGroups.removeCustomers>>, unknown, AdminDeleteCustomerGroupsGroupCustomerBatchReq>(
    ['customerGroups', 'removeCustomers', id,requestBody],
    () => client.customerGroups.removeCustomers(id,requestBody),
    options
  );
};


