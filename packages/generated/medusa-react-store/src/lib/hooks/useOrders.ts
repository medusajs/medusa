/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { UseQueryOptionsWrapper, UseMutationOptionsWrapper} from '../core/HookUtils';
import { useMedusaStore } from '../useMedusaStore';
import type { StoreGetOrdersParams } from '@medusajs/client-types';
import type { StoreOrdersRes } from '@medusajs/client-types';
import type { StorePostCustomersCustomerAcceptClaimReq } from '@medusajs/client-types';
import type { StorePostCustomersCustomerOrderClaimReq } from '@medusajs/client-types';

const { client } = useMedusaStore()

export const useOrdersLookupOrder = (
  queryParams: StoreGetOrdersParams,
  options: UseQueryOptionsWrapper<Awaited<ReturnType<typeof client.orders.lookupOrder>>> = {}
) => {
  const { data, ...rest } = useQuery<Awaited<ReturnType<typeof client.orders.lookupOrder>>>(
    ['orders', 'lookupOrder', queryParams],
    () => client.orders.lookupOrder(queryParams),
    options
  );
  return { ...data, ...rest } as const
};

export const useOrdersRequestCustomerOrders = (
  requestBody: StorePostCustomersCustomerOrderClaimReq,
  options: UseMutationOptionsWrapper<Awaited<ReturnType<typeof client.orders.requestCustomerOrders>>, unknown, StorePostCustomersCustomerOrderClaimReq> = {}
) => {
  if (!options?.onSuccess) {
    const queryClient = useQueryClient()
    options.onSuccess = async () => {
      await queryClient.invalidateQueries('orders')
    }
  }
  return useMutation<Awaited<ReturnType<typeof client.orders.requestCustomerOrders>>, unknown, StorePostCustomersCustomerOrderClaimReq>(
    ['orders', 'requestCustomerOrders', requestBody],
    () => client.orders.requestCustomerOrders(requestBody),
    options
  );
};

export const useOrdersRetrieveByCartId = (
  cartId: string,
  options: UseQueryOptionsWrapper<Awaited<ReturnType<typeof client.orders.retrieveByCartId>>> = {}
) => {
  const { data, ...rest } = useQuery<Awaited<ReturnType<typeof client.orders.retrieveByCartId>>>(
    ['orders', 'retrieveByCartId', cartId],
    () => client.orders.retrieveByCartId(cartId),
    options
  );
  return { ...data, ...rest } as const
};

export const useOrdersConfirmRequest = (
  requestBody: StorePostCustomersCustomerAcceptClaimReq,
  options: UseMutationOptionsWrapper<Awaited<ReturnType<typeof client.orders.confirmRequest>>, unknown, StorePostCustomersCustomerAcceptClaimReq> = {}
) => {
  if (!options?.onSuccess) {
    const queryClient = useQueryClient()
    options.onSuccess = async () => {
      await queryClient.invalidateQueries('orders')
    }
  }
  return useMutation<Awaited<ReturnType<typeof client.orders.confirmRequest>>, unknown, StorePostCustomersCustomerAcceptClaimReq>(
    ['orders', 'confirmRequest', requestBody],
    () => client.orders.confirmRequest(requestBody),
    options
  );
};

export const useOrdersRetrieve = (
  id: string,
  queryParams: {
    /**
     * (Comma separated) Which fields should be included in the result.
     */
    fields?: string,
    /**
     * (Comma separated) Which fields should be expanded in the result.
     */
    expand?: string,
  },
  options: UseQueryOptionsWrapper<Awaited<ReturnType<typeof client.orders.retrieve>>> = {}
) => {
  const { data, ...rest } = useQuery<Awaited<ReturnType<typeof client.orders.retrieve>>>(
    ['orders', 'retrieve', id,queryParams],
    () => client.orders.retrieve(id,queryParams),
    options
  );
  return { ...data, ...rest } as const
};


