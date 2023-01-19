/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { UseQueryOptionsWrapper, UseMutationOptionsWrapper} from '../core/HookUtils';
import { useMedusaStore } from '../useMedusaStore';
import type { GetPaymentCollectionsParams } from '../models/GetPaymentCollectionsParams';
import type { StorePaymentCollectionSessionsReq } from '../models/StorePaymentCollectionSessionsReq';
import type { StorePaymentCollectionsRes } from '../models/StorePaymentCollectionsRes';
import type { StorePaymentCollectionsSessionRes } from '../models/StorePaymentCollectionsSessionRes';
import type { StorePostPaymentCollectionsBatchSessionsAuthorizeReq } from '../models/StorePostPaymentCollectionsBatchSessionsAuthorizeReq';
import type { StorePostPaymentCollectionsBatchSessionsReq } from '../models/StorePostPaymentCollectionsBatchSessionsReq';

const { client } = useMedusaStore()

export const usePaymentCollectionRetrieve = (
  id: string,
  queryParams: GetPaymentCollectionsParams,
  options: UseQueryOptionsWrapper<Awaited<ReturnType<typeof client.paymentCollection.retrieve>>> = {}
) => {
  const { data, ...rest } = useQuery<Awaited<ReturnType<typeof client.paymentCollection.retrieve>>>(
    ['paymentCollection', 'retrieve', id,queryParams],
    () => client.paymentCollection.retrieve(id,queryParams),
    options
  );
  return { ...data, ...rest } as const
};

export const usePaymentCollectionManagePaymentSession = (
  id: string,
  requestBody: StorePaymentCollectionSessionsReq,
  options: UseMutationOptionsWrapper<Awaited<ReturnType<typeof client.paymentCollection.managePaymentSession>>, unknown, StorePaymentCollectionSessionsReq> = {}
) => {
  if (!options?.onSuccess) {
    const queryClient = useQueryClient()
    options.onSuccess = async () => {
      await queryClient.invalidateQueries('paymentCollection')
    }
  }
  return useMutation<Awaited<ReturnType<typeof client.paymentCollection.managePaymentSession>>, unknown, StorePaymentCollectionSessionsReq>(
    ['paymentCollection', 'managePaymentSession', id,requestBody],
    () => client.paymentCollection.managePaymentSession(id,requestBody),
    options
  );
};

export const usePaymentCollectionManagePaymentSessionsBatch = (
  id: string,
  requestBody: StorePostPaymentCollectionsBatchSessionsReq,
  options: UseMutationOptionsWrapper<Awaited<ReturnType<typeof client.paymentCollection.managePaymentSessionsBatch>>, unknown, StorePostPaymentCollectionsBatchSessionsReq> = {}
) => {
  if (!options?.onSuccess) {
    const queryClient = useQueryClient()
    options.onSuccess = async () => {
      await queryClient.invalidateQueries('paymentCollection')
    }
  }
  return useMutation<Awaited<ReturnType<typeof client.paymentCollection.managePaymentSessionsBatch>>, unknown, StorePostPaymentCollectionsBatchSessionsReq>(
    ['paymentCollection', 'managePaymentSessionsBatch', id,requestBody],
    () => client.paymentCollection.managePaymentSessionsBatch(id,requestBody),
    options
  );
};

export const usePaymentCollectionAuthorizePaymentSessionsBatch = (
  id: string,
  requestBody: StorePostPaymentCollectionsBatchSessionsAuthorizeReq,
  options: UseMutationOptionsWrapper<Awaited<ReturnType<typeof client.paymentCollection.authorizePaymentSessionsBatch>>, unknown, StorePostPaymentCollectionsBatchSessionsAuthorizeReq> = {}
) => {
  if (!options?.onSuccess) {
    const queryClient = useQueryClient()
    options.onSuccess = async () => {
      await queryClient.invalidateQueries('paymentCollection')
    }
  }
  return useMutation<Awaited<ReturnType<typeof client.paymentCollection.authorizePaymentSessionsBatch>>, unknown, StorePostPaymentCollectionsBatchSessionsAuthorizeReq>(
    ['paymentCollection', 'authorizePaymentSessionsBatch', id,requestBody],
    () => client.paymentCollection.authorizePaymentSessionsBatch(id,requestBody),
    options
  );
};

export const usePaymentCollectionRefreshPaymentSession = (
  id: string,
  sessionId: string,
  options: UseMutationOptionsWrapper<Awaited<ReturnType<typeof client.paymentCollection.refreshPaymentSession>>, unknown, void> = {}
) => {
  if (!options?.onSuccess) {
    const queryClient = useQueryClient()
    options.onSuccess = async () => {
      await queryClient.invalidateQueries('paymentCollection')
    }
  }
  return useMutation<Awaited<ReturnType<typeof client.paymentCollection.refreshPaymentSession>>, unknown, void>(
    ['paymentCollection', 'refreshPaymentSession', id,sessionId],
    () => client.paymentCollection.refreshPaymentSession(id,sessionId),
    options
  );
};

export const usePaymentCollectionAuthorizePaymentSession = (
  id: string,
  sessionId: string,
  options: UseMutationOptionsWrapper<Awaited<ReturnType<typeof client.paymentCollection.authorizePaymentSession>>, unknown, void> = {}
) => {
  if (!options?.onSuccess) {
    const queryClient = useQueryClient()
    options.onSuccess = async () => {
      await queryClient.invalidateQueries('paymentCollection')
    }
  }
  return useMutation<Awaited<ReturnType<typeof client.paymentCollection.authorizePaymentSession>>, unknown, void>(
    ['paymentCollection', 'authorizePaymentSession', id,sessionId],
    () => client.paymentCollection.authorizePaymentSession(id,sessionId),
    options
  );
};


