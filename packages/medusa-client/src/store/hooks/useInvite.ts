/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { UseQueryOptionsWrapper, UseMutationOptionsWrapper} from '../core/HookUtils';
import { useMedusaStore } from '../useMedusaStore';
import type { StorePostCustomersCustomerOrderClaimReq } from '../models/StorePostCustomersCustomerOrderClaimReq';

export const useInviteRequestCustomerOrders = (
  requestBody: StorePostCustomersCustomerOrderClaimReq,
  options: UseMutationOptionsWrapper<Awaited<ReturnType<typeof client.invite.requestCustomerOrders>>, unknown, StorePostCustomersCustomerOrderClaimReq> = {}
) => {
  const { client } = useMedusaStore()
  if (!options?.onSuccess) {
    const queryClient = useQueryClient()
    options.onSuccess = async () => {
      await queryClient.invalidateQueries('invite')
    }
  }
  return useMutation<Awaited<ReturnType<typeof client.invite.requestCustomerOrders>>, unknown, StorePostCustomersCustomerOrderClaimReq>(
    ['invite', 'requestCustomerOrders', requestBody],
    () => client.invite.requestCustomerOrders(requestBody),
    options
  );
};


