/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { UseQueryOptionsWrapper, UseMutationOptionsWrapper} from '../core/HookUtils';
import { useMedusaAdmin } from '../useMedusaAdmin';
import type { AdminCustomerGroupsDeleteRes } from '../models/AdminCustomerGroupsDeleteRes';
import type { AdminCustomerGroupsListRes } from '../models/AdminCustomerGroupsListRes';
import type { AdminCustomerGroupsRes } from '../models/AdminCustomerGroupsRes';
import type { AdminCustomersListRes } from '../models/AdminCustomersListRes';
import type { AdminDeleteCustomerGroupsGroupCustomerBatchReq } from '../models/AdminDeleteCustomerGroupsGroupCustomerBatchReq';
import type { AdminGetCustomerGroupsParams } from '../models/AdminGetCustomerGroupsParams';
import type { AdminPostCustomerGroupsGroupCustomersBatchReq } from '../models/AdminPostCustomerGroupsGroupCustomersBatchReq';
import type { AdminPostCustomerGroupsGroupReq } from '../models/AdminPostCustomerGroupsGroupReq';

export const useCustomerGroupAdminGetCustomerGroupsParams = (
  queryParams: {
    /**
     * Query used for searching customer group names.
     */
    q?: string,
    /**
     * How many groups to skip in the result.
     */
    offset?: number,
    /**
     * the field used to order the customer groups.
     */
    order?: string,
    /**
     * The discount condition id on which to filter the customer groups.
     */
    discountConditionId?: string,
    /**
     * Filter by the customer group ID
     */
    id?: (string | Array<string> | {
      /**
       * filter by IDs less than this ID
       */
      lt?: string;
      /**
       * filter by IDs greater than this ID
       */
      gt?: string;
      /**
       * filter by IDs less than or equal to this ID
       */
      lte?: string;
      /**
       * filter by IDs greater than or equal to this ID
       */
      gte?: string;
    }),
    /**
     * Filter by the customer group name
     */
    name?: Array<string>,
    /**
     * Date comparison for when resulting customer groups were created.
     */
    createdAt?: {
      /**
       * filter by dates less than this date
       */
      lt?: string;
      /**
       * filter by dates greater than this date
       */
      gt?: string;
      /**
       * filter by dates less than or equal to this date
       */
      lte?: string;
      /**
       * filter by dates greater than or equal to this date
       */
      gte?: string;
    },
    /**
     * Date comparison for when resulting customer groups were updated.
     */
    updatedAt?: {
      /**
       * filter by dates less than this date
       */
      lt?: string;
      /**
       * filter by dates greater than this date
       */
      gt?: string;
      /**
       * filter by dates less than or equal to this date
       */
      lte?: string;
      /**
       * filter by dates greater than or equal to this date
       */
      gte?: string;
    },
    /**
     * Limit the number of customer groups returned.
     */
    limit?: number,
    /**
     * (Comma separated) Which fields should be expanded in each customer groups of the result.
     */
    expand?: string,
  },
  options: UseQueryOptionsWrapper<Awaited<ReturnType<typeof client.customerGroup.AdminGetCustomerGroupsParams>>> = {}
) => {
  const { client } = useMedusaAdmin()
  const { data, ...rest } = useQuery<Awaited<ReturnType<typeof client.customerGroup.AdminGetCustomerGroupsParams>>>(
    ['customerGroup', 'adminGetCustomerGroupsParams', queryParams],
    () => client.customerGroup.AdminGetCustomerGroupsParams(queryParams),
    options
  );
  return { ...data, ...rest } as const
};

export const useCustomerGroupCreate = (
  requestBody: {
    /**
     * Name of the customer group
     */
    name: string;
    /**
     * Metadata for the customer.
     */
    metadata?: Record<string, any>;
  },
  options: UseMutationOptionsWrapper<Awaited<ReturnType<typeof client.customerGroup.create>>, unknown, any> = {}
) => {
  const { client } = useMedusaAdmin()
  if (!options?.onSuccess) {
    const queryClient = useQueryClient()
    options.onSuccess = async () => {
      await queryClient.invalidateQueries('customerGroup')
    }
  }
  return useMutation<Awaited<ReturnType<typeof client.customerGroup.create>>, unknown, any>(
    ['customerGroup', 'create', requestBody],
    () => client.customerGroup.create(requestBody),
    options
  );
};

export const useCustomerGroupList = (
  id: string,
  queryParams: AdminGetCustomerGroupsParams,
  options: UseQueryOptionsWrapper<Awaited<ReturnType<typeof client.customerGroup.list>>> = {}
) => {
  const { client } = useMedusaAdmin()
  const { data, ...rest } = useQuery<Awaited<ReturnType<typeof client.customerGroup.list>>>(
    ['customerGroup', 'list', id,queryParams],
    () => client.customerGroup.list(id,queryParams),
    options
  );
  return { ...data, ...rest } as const
};

export const useCustomerGroupUpdate = (
  id: string,
  requestBody: AdminPostCustomerGroupsGroupReq,
  options: UseMutationOptionsWrapper<Awaited<ReturnType<typeof client.customerGroup.update>>, unknown, AdminPostCustomerGroupsGroupReq> = {}
) => {
  const { client } = useMedusaAdmin()
  if (!options?.onSuccess) {
    const queryClient = useQueryClient()
    options.onSuccess = async () => {
      await queryClient.invalidateQueries('customerGroup')
    }
  }
  return useMutation<Awaited<ReturnType<typeof client.customerGroup.update>>, unknown, AdminPostCustomerGroupsGroupReq>(
    ['customerGroup', 'update', id,requestBody],
    () => client.customerGroup.update(id,requestBody),
    options
  );
};

export const useCustomerGroupDelete = (
  id: string,
  options: UseMutationOptionsWrapper<Awaited<ReturnType<typeof client.customerGroup.delete>>, unknown, void> = {}
) => {
  const { client } = useMedusaAdmin()
  if (!options?.onSuccess) {
    const queryClient = useQueryClient()
    options.onSuccess = async () => {
      await queryClient.invalidateQueries('customerGroup')
    }
  }
  return useMutation<Awaited<ReturnType<typeof client.customerGroup.delete>>, unknown, void>(
    ['customerGroup', 'delete', id],
    () => client.customerGroup.delete(id),
    options
  );
};

export const useCustomerGroupListCustomers = (
  id: string,
  options: UseQueryOptionsWrapper<Awaited<ReturnType<typeof client.customerGroup.listCustomers>>> = {}
) => {
  const { client } = useMedusaAdmin()
  const { data, ...rest } = useQuery<Awaited<ReturnType<typeof client.customerGroup.listCustomers>>>(
    ['customerGroup', 'listCustomers', id],
    () => client.customerGroup.listCustomers(id),
    options
  );
  return { ...data, ...rest } as const
};

export const useCustomerGroupAddCustomers = (
  id: string,
  requestBody: AdminPostCustomerGroupsGroupCustomersBatchReq,
  options: UseMutationOptionsWrapper<Awaited<ReturnType<typeof client.customerGroup.addCustomers>>, unknown, AdminPostCustomerGroupsGroupCustomersBatchReq> = {}
) => {
  const { client } = useMedusaAdmin()
  if (!options?.onSuccess) {
    const queryClient = useQueryClient()
    options.onSuccess = async () => {
      await queryClient.invalidateQueries('customerGroup')
    }
  }
  return useMutation<Awaited<ReturnType<typeof client.customerGroup.addCustomers>>, unknown, AdminPostCustomerGroupsGroupCustomersBatchReq>(
    ['customerGroup', 'addCustomers', id,requestBody],
    () => client.customerGroup.addCustomers(id,requestBody),
    options
  );
};

export const useCustomerGroupRemoveCustomers = (
  id: string,
  requestBody: AdminDeleteCustomerGroupsGroupCustomerBatchReq,
  options: UseMutationOptionsWrapper<Awaited<ReturnType<typeof client.customerGroup.removeCustomers>>, unknown, AdminDeleteCustomerGroupsGroupCustomerBatchReq> = {}
) => {
  const { client } = useMedusaAdmin()
  if (!options?.onSuccess) {
    const queryClient = useQueryClient()
    options.onSuccess = async () => {
      await queryClient.invalidateQueries('customerGroup')
    }
  }
  return useMutation<Awaited<ReturnType<typeof client.customerGroup.removeCustomers>>, unknown, AdminDeleteCustomerGroupsGroupCustomerBatchReq>(
    ['customerGroup', 'removeCustomers', id,requestBody],
    () => client.customerGroup.removeCustomers(id,requestBody),
    options
  );
};


