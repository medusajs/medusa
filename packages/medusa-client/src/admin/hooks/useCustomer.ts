/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { UseQueryOptionsWrapper, UseMutationOptionsWrapper} from '../core/HookUtils';
import { useMedusaAdmin } from '../useMedusaAdmin';
import type { AdminCustomersListRes } from '../models/AdminCustomersListRes';
import type { AdminCustomersRes } from '../models/AdminCustomersRes';
import type { AdminGetCustomersParams } from '../models/AdminGetCustomersParams';
import type { AdminPostCustomersCustomerReq } from '../models/AdminPostCustomersCustomerReq';
import type { AdminPostCustomersReq } from '../models/AdminPostCustomersReq';

export const useCustomerList = (
  queryParams: AdminGetCustomersParams,
  options: UseQueryOptionsWrapper<Awaited<ReturnType<typeof client.customer.list>>> = {}
) => {
  const { client } = useMedusaAdmin()
  const { data, ...rest } = useQuery<Awaited<ReturnType<typeof client.customer.list>>>(
    ['customer', 'list', queryParams],
    () => client.customer.list(queryParams),
    options
  );
  return { ...data, ...rest } as const
};

export const useCustomerCreate = (
  requestBody: AdminPostCustomersReq,
  options: UseMutationOptionsWrapper<Awaited<ReturnType<typeof client.customer.create>>, unknown, AdminPostCustomersReq> = {}
) => {
  const { client } = useMedusaAdmin()
  if (!options?.onSuccess) {
    const queryClient = useQueryClient()
    options.onSuccess = async () => {
      await queryClient.invalidateQueries('customer')
    }
  }
  return useMutation<Awaited<ReturnType<typeof client.customer.create>>, unknown, AdminPostCustomersReq>(
    ['customer', 'create', requestBody],
    () => client.customer.create(requestBody),
    options
  );
};

export const useCustomerRetrieve = (
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
  options: UseQueryOptionsWrapper<Awaited<ReturnType<typeof client.customer.retrieve>>> = {}
) => {
  const { client } = useMedusaAdmin()
  const { data, ...rest } = useQuery<Awaited<ReturnType<typeof client.customer.retrieve>>>(
    ['customer', 'retrieve', id,queryParams],
    () => client.customer.retrieve(id,queryParams),
    options
  );
  return { ...data, ...rest } as const
};

export const useCustomerUpdate = (
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
  options: UseMutationOptionsWrapper<Awaited<ReturnType<typeof client.customer.update>>, unknown, AdminPostCustomersCustomerReq> = {}
) => {
  const { client } = useMedusaAdmin()
  if (!options?.onSuccess) {
    const queryClient = useQueryClient()
    options.onSuccess = async () => {
      await queryClient.invalidateQueries('customer')
    }
  }
  return useMutation<Awaited<ReturnType<typeof client.customer.update>>, unknown, AdminPostCustomersCustomerReq>(
    ['customer', 'update', id,requestBody,queryParams],
    () => client.customer.update(id,requestBody,queryParams),
    options
  );
};


