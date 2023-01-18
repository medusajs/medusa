/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { UseQueryOptionsWrapper, UseMutationOptionsWrapper} from '../core/HookUtils';
import { useMedusaStore } from '../useMedusaStore';
import type { StoreOrdersRes } from '../models/StoreOrdersRes';
import type { StorePostCustomersCustomerAcceptClaimReq } from '../models/StorePostCustomersCustomerAcceptClaimReq';

export const useOrderLookupOrder = (
  queryParams: {
    /**
     * The display id given to the Order.
     */
    displayId: number,
    /**
     * The email associated with this order.
     */
    email: string,
    /**
     * The shipping address associated with this order.
     */
    shippingAddress?: {
      /**
       * The postal code of the shipping address
       */
      postal_code?: string;
    },
  },
  options: UseQueryOptionsWrapper<Awaited<ReturnType<typeof client.order.lookupOrder>>> = {}
) => {
  const { client } = useMedusaStore()
  const { data, ...rest } = useQuery<Awaited<ReturnType<typeof client.order.lookupOrder>>>(
    ['order', 'lookupOrder', queryParams],
    () => client.order.lookupOrder(queryParams),
    options
  );
  return { ...data, ...rest } as const
};

export const useOrderRetrieveByCartId = (
  cartId: string,
  options: UseQueryOptionsWrapper<Awaited<ReturnType<typeof client.order.retrieveByCartId>>> = {}
) => {
  const { client } = useMedusaStore()
  const { data, ...rest } = useQuery<Awaited<ReturnType<typeof client.order.retrieveByCartId>>>(
    ['order', 'retrieveByCartId', cartId],
    () => client.order.retrieveByCartId(cartId),
    options
  );
  return { ...data, ...rest } as const
};

export const useOrderConfirmRequest = (
  requestBody: StorePostCustomersCustomerAcceptClaimReq,
  options: UseMutationOptionsWrapper<Awaited<ReturnType<typeof client.order.confirmRequest>>, unknown, StorePostCustomersCustomerAcceptClaimReq> = {}
) => {
  const { client } = useMedusaStore()
  if (!options?.onSuccess) {
    const queryClient = useQueryClient()
    options.onSuccess = async () => {
      await queryClient.invalidateQueries('order')
    }
  }
  return useMutation<Awaited<ReturnType<typeof client.order.confirmRequest>>, unknown, StorePostCustomersCustomerAcceptClaimReq>(
    ['order', 'confirmRequest', requestBody],
    () => client.order.confirmRequest(requestBody),
    options
  );
};

export const useOrderRetrieve = (
  id: string,
  options: UseQueryOptionsWrapper<Awaited<ReturnType<typeof client.order.retrieve>>> = {}
) => {
  const { client } = useMedusaStore()
  const { data, ...rest } = useQuery<Awaited<ReturnType<typeof client.order.retrieve>>>(
    ['order', 'retrieve', id],
    () => client.order.retrieve(id),
    options
  );
  return { ...data, ...rest } as const
};


