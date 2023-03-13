/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { UseQueryOptionsWrapper, UseMutationOptionsWrapper} from '../core/HookUtils';
import { useMedusaStore } from '../useMedusaStore';
import type { StoreGetPaymentCollectionsParams } from '@medusajs/client-types';
import type { StorePaymentCollectionSessionsReq } from '@medusajs/client-types';
import type { StorePaymentCollectionsRes } from '@medusajs/client-types';
import type { StorePaymentCollectionsSessionRes } from '@medusajs/client-types';
import type { StorePostPaymentCollectionsBatchSessionsAuthorizeReq } from '@medusajs/client-types';
import type { StorePostPaymentCollectionsBatchSessionsReq } from '@medusajs/client-types';

const { client } = useMedusaStore()

export const usePaymentCollectionsRetrieve = (
  id: string,
  queryParams: StoreGetPaymentCollectionsParams,
  options: UseQueryOptionsWrapper<Awaited<ReturnType<typeof client.paymentCollections.retrieve>>> = {}
) => {
  const { data, ...rest } = useQuery<Awaited<ReturnType<typeof client.paymentCollections.retrieve>>>(
    ['paymentCollections', 'retrieve', id,queryParams],
    () => client.paymentCollections.retrieve(id,queryParams),
    options
  );
  return { ...data, ...rest } as const
};

export const usePaymentCollectionsManagePaymentSession = (
  id: string,
  requestBody: StorePaymentCollectionSessionsReq,
  options: UseMutationOptionsWrapper<Awaited<ReturnType<typeof client.paymentCollections.managePaymentSession>>, unknown, StorePaymentCollectionSessionsReq> = {}
) => {
  if (!options?.onSuccess) {
    const queryClient = useQueryClient()
    options.onSuccess = async () => {
      await queryClient.invalidateQueries('paymentCollections')
    }
  }
  return useMutation<Awaited<ReturnType<typeof client.paymentCollections.managePaymentSession>>, unknown, StorePaymentCollectionSessionsReq>(
    ['paymentCollections', 'managePaymentSession', id,requestBody],
    () => client.paymentCollections.managePaymentSession(id,requestBody),
    options
  );
};

export const usePaymentCollectionsManagePaymentSessionsBatch = (
  id: string,
  requestBody: StorePostPaymentCollectionsBatchSessionsReq,
  options: UseMutationOptionsWrapper<Awaited<ReturnType<typeof client.paymentCollections.managePaymentSessionsBatch>>, unknown, StorePostPaymentCollectionsBatchSessionsReq> = {}
) => {
  if (!options?.onSuccess) {
    const queryClient = useQueryClient()
    options.onSuccess = async () => {
      await queryClient.invalidateQueries('paymentCollections')
    }
  }
  return useMutation<Awaited<ReturnType<typeof client.paymentCollections.managePaymentSessionsBatch>>, unknown, StorePostPaymentCollectionsBatchSessionsReq>(
    ['paymentCollections', 'managePaymentSessionsBatch', id,requestBody],
    () => client.paymentCollections.managePaymentSessionsBatch(id,requestBody),
    options
  );
};

export const usePaymentCollectionsAuthorizePaymentSessionsBatch = (
  id: string,
  requestBody: StorePostPaymentCollectionsBatchSessionsAuthorizeReq,
  options: UseMutationOptionsWrapper<Awaited<ReturnType<typeof client.paymentCollections.authorizePaymentSessionsBatch>>, unknown, StorePostPaymentCollectionsBatchSessionsAuthorizeReq> = {}
) => {
  if (!options?.onSuccess) {
    const queryClient = useQueryClient()
    options.onSuccess = async () => {
      await queryClient.invalidateQueries('paymentCollections')
    }
  }
  return useMutation<Awaited<ReturnType<typeof client.paymentCollections.authorizePaymentSessionsBatch>>, unknown, StorePostPaymentCollectionsBatchSessionsAuthorizeReq>(
    ['paymentCollections', 'authorizePaymentSessionsBatch', id,requestBody],
    () => client.paymentCollections.authorizePaymentSessionsBatch(id,requestBody),
    options
  );
};

export const usePaymentCollectionsRefreshPaymentSession = (
  id: string,
  sessionId: string,
  options: UseMutationOptionsWrapper<Awaited<ReturnType<typeof client.paymentCollections.refreshPaymentSession>>, unknown, void> = {}
) => {
  if (!options?.onSuccess) {
    const queryClient = useQueryClient()
    options.onSuccess = async () => {
      await queryClient.invalidateQueries('paymentCollections')
    }
  }
  return useMutation<Awaited<ReturnType<typeof client.paymentCollections.refreshPaymentSession>>, unknown, void>(
    ['paymentCollections', 'refreshPaymentSession', id,sessionId],
    () => client.paymentCollections.refreshPaymentSession(id,sessionId),
    options
  );
};

export const usePaymentCollectionsAuthorizePaymentSession = (
  id: string,
  sessionId: string,
  options: UseMutationOptionsWrapper<Awaited<ReturnType<typeof client.paymentCollections.authorizePaymentSession>>, unknown, void> = {}
) => {
  if (!options?.onSuccess) {
    const queryClient = useQueryClient()
    options.onSuccess = async () => {
      await queryClient.invalidateQueries('paymentCollections')
    }
  }
  return useMutation<Awaited<ReturnType<typeof client.paymentCollections.authorizePaymentSession>>, unknown, void>(
    ['paymentCollections', 'authorizePaymentSession', id,sessionId],
    () => client.paymentCollections.authorizePaymentSession(id,sessionId),
    options
  );
};


