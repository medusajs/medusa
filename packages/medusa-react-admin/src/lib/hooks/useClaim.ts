/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { UseQueryOptionsWrapper, UseMutationOptionsWrapper} from '../core/HookUtils';
import { useMedusaAdmin } from '../useMedusaAdmin';
import type { AdminOrdersRes } from '../models/AdminOrdersRes';
import type { AdminPostOrdersOrderClaimsClaimReq } from '../models/AdminPostOrdersOrderClaimsClaimReq';
import type { AdminPostOrdersOrderClaimsClaimShipmentsReq } from '../models/AdminPostOrdersOrderClaimsClaimShipmentsReq';
import type { AdminPostOrdersOrderClaimsReq } from '../models/AdminPostOrdersOrderClaimsReq';

const { client } = useMedusaAdmin()

export const useClaimCreateClaim = (
  id: string,
  requestBody: AdminPostOrdersOrderClaimsReq,
  options: UseMutationOptionsWrapper<Awaited<ReturnType<typeof client.claim.createClaim>>, unknown, AdminPostOrdersOrderClaimsReq> = {}
) => {
  if (!options?.onSuccess) {
    const queryClient = useQueryClient()
    options.onSuccess = async () => {
      await queryClient.invalidateQueries('claim')
    }
  }
  return useMutation<Awaited<ReturnType<typeof client.claim.createClaim>>, unknown, AdminPostOrdersOrderClaimsReq>(
    ['claim', 'createClaim', id,requestBody],
    () => client.claim.createClaim(id,requestBody),
    options
  );
};

export const useClaimUpdateClaim = (
  id: string,
  claimId: string,
  requestBody: AdminPostOrdersOrderClaimsClaimReq,
  options: UseMutationOptionsWrapper<Awaited<ReturnType<typeof client.claim.updateClaim>>, unknown, AdminPostOrdersOrderClaimsClaimReq> = {}
) => {
  if (!options?.onSuccess) {
    const queryClient = useQueryClient()
    options.onSuccess = async () => {
      await queryClient.invalidateQueries('claim')
    }
  }
  return useMutation<Awaited<ReturnType<typeof client.claim.updateClaim>>, unknown, AdminPostOrdersOrderClaimsClaimReq>(
    ['claim', 'updateClaim', id,claimId,requestBody],
    () => client.claim.updateClaim(id,claimId,requestBody),
    options
  );
};

export const useClaimCancelClaim = (
  id: string,
  claimId: string,
  options: UseMutationOptionsWrapper<Awaited<ReturnType<typeof client.claim.cancelClaim>>, unknown, void> = {}
) => {
  if (!options?.onSuccess) {
    const queryClient = useQueryClient()
    options.onSuccess = async () => {
      await queryClient.invalidateQueries('claim')
    }
  }
  return useMutation<Awaited<ReturnType<typeof client.claim.cancelClaim>>, unknown, void>(
    ['claim', 'cancelClaim', id,claimId],
    () => client.claim.cancelClaim(id,claimId),
    options
  );
};

export const useClaimCreateClaimShipment = (
  id: string,
  claimId: string,
  requestBody: AdminPostOrdersOrderClaimsClaimShipmentsReq,
  options: UseMutationOptionsWrapper<Awaited<ReturnType<typeof client.claim.createClaimShipment>>, unknown, AdminPostOrdersOrderClaimsClaimShipmentsReq> = {}
) => {
  if (!options?.onSuccess) {
    const queryClient = useQueryClient()
    options.onSuccess = async () => {
      await queryClient.invalidateQueries('claim')
    }
  }
  return useMutation<Awaited<ReturnType<typeof client.claim.createClaimShipment>>, unknown, AdminPostOrdersOrderClaimsClaimShipmentsReq>(
    ['claim', 'createClaimShipment', id,claimId,requestBody],
    () => client.claim.createClaimShipment(id,claimId,requestBody),
    options
  );
};


