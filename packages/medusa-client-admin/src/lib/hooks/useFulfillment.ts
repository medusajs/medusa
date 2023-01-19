/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { UseQueryOptionsWrapper, UseMutationOptionsWrapper} from '../core/HookUtils';
import { useMedusaAdmin } from '../useMedusaAdmin';
import type { AdminOrdersRes } from '../models/AdminOrdersRes';
import type { AdminPostOrdersOrderClaimsClaimFulfillmentsReq } from '../models/AdminPostOrdersOrderClaimsClaimFulfillmentsReq';
import type { AdminPostOrdersOrderFulfillmentsReq } from '../models/AdminPostOrdersOrderFulfillmentsReq';
import type { AdminPostOrdersOrderSwapsSwapFulfillmentsReq } from '../models/AdminPostOrdersOrderSwapsSwapFulfillmentsReq';

const { client } = useMedusaAdmin()

export const useFulfillmentFulfillClaim = (
  id: string,
  claimId: string,
  requestBody: AdminPostOrdersOrderClaimsClaimFulfillmentsReq,
  options: UseMutationOptionsWrapper<Awaited<ReturnType<typeof client.fulfillment.fulfillClaim>>, unknown, AdminPostOrdersOrderClaimsClaimFulfillmentsReq> = {}
) => {
  if (!options?.onSuccess) {
    const queryClient = useQueryClient()
    options.onSuccess = async () => {
      await queryClient.invalidateQueries('fulfillment')
    }
  }
  return useMutation<Awaited<ReturnType<typeof client.fulfillment.fulfillClaim>>, unknown, AdminPostOrdersOrderClaimsClaimFulfillmentsReq>(
    ['fulfillment', 'fulfillClaim', id,claimId,requestBody],
    () => client.fulfillment.fulfillClaim(id,claimId,requestBody),
    options
  );
};

export const useFulfillmentCancelClaimFulfillment = (
  id: string,
  claimId: string,
  fulfillmentId: string,
  options: UseMutationOptionsWrapper<Awaited<ReturnType<typeof client.fulfillment.cancelClaimFulfillment>>, unknown, void> = {}
) => {
  if (!options?.onSuccess) {
    const queryClient = useQueryClient()
    options.onSuccess = async () => {
      await queryClient.invalidateQueries('fulfillment')
    }
  }
  return useMutation<Awaited<ReturnType<typeof client.fulfillment.cancelClaimFulfillment>>, unknown, void>(
    ['fulfillment', 'cancelClaimFulfillment', id,claimId,fulfillmentId],
    () => client.fulfillment.cancelClaimFulfillment(id,claimId,fulfillmentId),
    options
  );
};

export const useFulfillmentCreateFulfillment = (
  id: string,
  requestBody: AdminPostOrdersOrderFulfillmentsReq,
  options: UseMutationOptionsWrapper<Awaited<ReturnType<typeof client.fulfillment.createFulfillment>>, unknown, AdminPostOrdersOrderFulfillmentsReq> = {}
) => {
  if (!options?.onSuccess) {
    const queryClient = useQueryClient()
    options.onSuccess = async () => {
      await queryClient.invalidateQueries('fulfillment')
    }
  }
  return useMutation<Awaited<ReturnType<typeof client.fulfillment.createFulfillment>>, unknown, AdminPostOrdersOrderFulfillmentsReq>(
    ['fulfillment', 'createFulfillment', id,requestBody],
    () => client.fulfillment.createFulfillment(id,requestBody),
    options
  );
};

export const useFulfillmentCancelFulfillment = (
  id: string,
  fulfillmentId: string,
  options: UseMutationOptionsWrapper<Awaited<ReturnType<typeof client.fulfillment.cancelFulfillment>>, unknown, void> = {}
) => {
  if (!options?.onSuccess) {
    const queryClient = useQueryClient()
    options.onSuccess = async () => {
      await queryClient.invalidateQueries('fulfillment')
    }
  }
  return useMutation<Awaited<ReturnType<typeof client.fulfillment.cancelFulfillment>>, unknown, void>(
    ['fulfillment', 'cancelFulfillment', id,fulfillmentId],
    () => client.fulfillment.cancelFulfillment(id,fulfillmentId),
    options
  );
};

export const useFulfillmentFulfillSwap = (
  id: string,
  swapId: string,
  requestBody: AdminPostOrdersOrderSwapsSwapFulfillmentsReq,
  options: UseMutationOptionsWrapper<Awaited<ReturnType<typeof client.fulfillment.fulfillSwap>>, unknown, AdminPostOrdersOrderSwapsSwapFulfillmentsReq> = {}
) => {
  if (!options?.onSuccess) {
    const queryClient = useQueryClient()
    options.onSuccess = async () => {
      await queryClient.invalidateQueries('fulfillment')
    }
  }
  return useMutation<Awaited<ReturnType<typeof client.fulfillment.fulfillSwap>>, unknown, AdminPostOrdersOrderSwapsSwapFulfillmentsReq>(
    ['fulfillment', 'fulfillSwap', id,swapId,requestBody],
    () => client.fulfillment.fulfillSwap(id,swapId,requestBody),
    options
  );
};

export const useFulfillmentCancelSwapFulfillment = (
  id: string,
  swapId: string,
  fulfillmentId: string,
  options: UseMutationOptionsWrapper<Awaited<ReturnType<typeof client.fulfillment.cancelSwapFulfillment>>, unknown, void> = {}
) => {
  if (!options?.onSuccess) {
    const queryClient = useQueryClient()
    options.onSuccess = async () => {
      await queryClient.invalidateQueries('fulfillment')
    }
  }
  return useMutation<Awaited<ReturnType<typeof client.fulfillment.cancelSwapFulfillment>>, unknown, void>(
    ['fulfillment', 'cancelSwapFulfillment', id,swapId,fulfillmentId],
    () => client.fulfillment.cancelSwapFulfillment(id,swapId,fulfillmentId),
    options
  );
};


