/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { UseQueryOptionsWrapper, UseMutationOptionsWrapper} from '../core/HookUtils';
import { useMedusaAdmin } from '../useMedusaAdmin';
import type { AdminCustomersListRes } from '@medusajs/client-types';
import type { AdminCustomersRes } from '@medusajs/client-types';
import type { AdminGetCustomersParams } from '@medusajs/client-types';
import type { AdminPostCustomersCustomerReq } from '@medusajs/client-types';
import type { AdminPostCustomersReq } from '@medusajs/client-types';

const { client } = useMedusaAdmin()

export const useCustomersList = (
  queryParams: AdminGetCustomersParams,
  options: UseQueryOptionsWrapper<Awaited<ReturnType<typeof client.customers.list>>> = {}
) => {
  const { data, ...rest } = useQuery<Awaited<ReturnType<typeof client.customers.list>>>(
    ['customers', 'list', queryParams],
    () => client.customers.list(queryParams),
    options
  );
  return { ...data, ...rest } as const
};

export const useCustomersCreate = (
  requestBody: AdminPostCustomersReq,
  options: UseMutationOptionsWrapper<Awaited<ReturnType<typeof client.customers.create>>, unknown, AdminPostCustomersReq> = {}
) => {
  if (!options?.onSuccess) {
    const queryClient = useQueryClient()
    options.onSuccess = async () => {
      await queryClient.invalidateQueries('customers')
    }
  }
  return useMutation<Awaited<ReturnType<typeof client.customers.create>>, unknown, AdminPostCustomersReq>(
    ['customers', 'create', requestBody],
    () => client.customers.create(requestBody),
    options
  );
};

export const useCustomersRetrieve = (
  id: string,
  queryParams: {
    /**
     * (Comma separated) Which fields should be expanded in the customer.
     */
    expand?: string,
    /**
     * (Comma separated) Which fields should be included in the customer.
     */
    fields?: string,
  },
  options: UseQueryOptionsWrapper<Awaited<ReturnType<typeof client.customers.retrieve>>> = {}
) => {
  const { data, ...rest } = useQuery<Awaited<ReturnType<typeof client.customers.retrieve>>>(
    ['customers', 'retrieve', id,queryParams],
    () => client.customers.retrieve(id,queryParams),
    options
  );
  return { ...data, ...rest } as const
};

export const useCustomersUpdate = (
  id: string,
  requestBody: AdminPostCustomersCustomerReq,
  queryParams: {
    /**
     * (Comma separated) Which fields should be expanded in each customer.
     */
    expand?: string,
    /**
     * (Comma separated) Which fields should be retrieved in each customer.
     */
    fields?: string,
  },
  options: UseMutationOptionsWrapper<Awaited<ReturnType<typeof client.customers.update>>, unknown, AdminPostCustomersCustomerReq> = {}
) => {
  if (!options?.onSuccess) {
    const queryClient = useQueryClient()
    options.onSuccess = async () => {
      await queryClient.invalidateQueries('customers')
    }
  }
  return useMutation<Awaited<ReturnType<typeof client.customers.update>>, unknown, AdminPostCustomersCustomerReq>(
    ['customers', 'update', id,requestBody,queryParams],
    () => client.customers.update(id,requestBody,queryParams),
    options
  );
};


