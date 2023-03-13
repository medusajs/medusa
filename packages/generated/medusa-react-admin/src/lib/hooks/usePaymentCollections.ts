/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { UseQueryOptionsWrapper, UseMutationOptionsWrapper} from '../core/HookUtils';
import { useMedusaAdmin } from '../useMedusaAdmin';
import type { AdminGetPaymentCollectionsParams } from '@medusajs/client-types';
import type { AdminPaymentCollectionDeleteRes } from '@medusajs/client-types';
import type { AdminPaymentCollectionsRes } from '@medusajs/client-types';
import type { AdminUpdatePaymentCollectionsReq } from '@medusajs/client-types';

const { client } = useMedusaAdmin()

export const usePaymentCollectionsRetrieve = (
  id: string,
  queryParams: AdminGetPaymentCollectionsParams,
  options: UseQueryOptionsWrapper<Awaited<ReturnType<typeof client.paymentCollections.retrieve>>> = {}
) => {
  const { data, ...rest } = useQuery<Awaited<ReturnType<typeof client.paymentCollections.retrieve>>>(
    ['paymentCollections', 'retrieve', id,queryParams],
    () => client.paymentCollections.retrieve(id,queryParams),
    options
  );
  return { ...data, ...rest } as const
};

export const usePaymentCollectionsUpdate = (
  id: string,
  requestBody: AdminUpdatePaymentCollectionsReq,
  options: UseMutationOptionsWrapper<Awaited<ReturnType<typeof client.paymentCollections.update>>, unknown, AdminUpdatePaymentCollectionsReq> = {}
) => {
  if (!options?.onSuccess) {
    const queryClient = useQueryClient()
    options.onSuccess = async () => {
      await queryClient.invalidateQueries('paymentCollections')
    }
  }
  return useMutation<Awaited<ReturnType<typeof client.paymentCollections.update>>, unknown, AdminUpdatePaymentCollectionsReq>(
    ['paymentCollections', 'update', id,requestBody],
    () => client.paymentCollections.update(id,requestBody),
    options
  );
};

export const usePaymentCollectionsDelete = (
  id: string,
  options: UseMutationOptionsWrapper<Awaited<ReturnType<typeof client.paymentCollections.delete>>, unknown, void> = {}
) => {
  if (!options?.onSuccess) {
    const queryClient = useQueryClient()
    options.onSuccess = async () => {
      await queryClient.invalidateQueries('paymentCollections')
    }
  }
  return useMutation<Awaited<ReturnType<typeof client.paymentCollections.delete>>, unknown, void>(
    ['paymentCollections', 'delete', id],
    () => client.paymentCollections.delete(id),
    options
  );
};

export const usePaymentCollectionsMarkAsAuthorized = (
  id: string,
  options: UseMutationOptionsWrapper<Awaited<ReturnType<typeof client.paymentCollections.markAsAuthorized>>, unknown, void> = {}
) => {
  if (!options?.onSuccess) {
    const queryClient = useQueryClient()
    options.onSuccess = async () => {
      await queryClient.invalidateQueries('paymentCollections')
    }
  }
  return useMutation<Awaited<ReturnType<typeof client.paymentCollections.markAsAuthorized>>, unknown, void>(
    ['paymentCollections', 'markAsAuthorized', id],
    () => client.paymentCollections.markAsAuthorized(id),
    options
  );
};


