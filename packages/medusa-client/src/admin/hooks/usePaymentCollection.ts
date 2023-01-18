/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { UseQueryOptionsWrapper, UseMutationOptionsWrapper} from '../core/HookUtils';
import { useMedusaAdmin } from '../useMedusaAdmin';
import type { AdminPaymentCollectionDeleteRes } from '../models/AdminPaymentCollectionDeleteRes';
import type { AdminPaymentCollectionsRes } from '../models/AdminPaymentCollectionsRes';
import type { AdminUpdatePaymentCollectionsReq } from '../models/AdminUpdatePaymentCollectionsReq';
import type { GetPaymentCollectionsParams } from '../models/GetPaymentCollectionsParams';

export const usePaymentCollectionRetrieve = (
  id: string,
  queryParams: GetPaymentCollectionsParams,
  options: UseQueryOptionsWrapper<Awaited<ReturnType<typeof client.paymentCollection.retrieve>>> = {}
) => {
  const { client } = useMedusaAdmin()
  const { data, ...rest } = useQuery<Awaited<ReturnType<typeof client.paymentCollection.retrieve>>>(
    ['paymentCollection', 'retrieve', id,queryParams],
    () => client.paymentCollection.retrieve(id,queryParams),
    options
  );
  return { ...data, ...rest } as const
};

export const usePaymentCollectionUpdate = (
  id: string,
  requestBody: AdminUpdatePaymentCollectionsReq,
  options: UseMutationOptionsWrapper<Awaited<ReturnType<typeof client.paymentCollection.update>>, unknown, AdminUpdatePaymentCollectionsReq> = {}
) => {
  const { client } = useMedusaAdmin()
  if (!options?.onSuccess) {
    const queryClient = useQueryClient()
    options.onSuccess = async () => {
      await queryClient.invalidateQueries('paymentCollection')
    }
  }
  return useMutation<Awaited<ReturnType<typeof client.paymentCollection.update>>, unknown, AdminUpdatePaymentCollectionsReq>(
    ['paymentCollection', 'update', id,requestBody],
    () => client.paymentCollection.update(id,requestBody),
    options
  );
};

export const usePaymentCollectionDelete = (
  id: string,
  options: UseMutationOptionsWrapper<Awaited<ReturnType<typeof client.paymentCollection.delete>>, unknown, void> = {}
) => {
  const { client } = useMedusaAdmin()
  if (!options?.onSuccess) {
    const queryClient = useQueryClient()
    options.onSuccess = async () => {
      await queryClient.invalidateQueries('paymentCollection')
    }
  }
  return useMutation<Awaited<ReturnType<typeof client.paymentCollection.delete>>, unknown, void>(
    ['paymentCollection', 'delete', id],
    () => client.paymentCollection.delete(id),
    options
  );
};

export const usePaymentCollectionMarkAsAuthorized = (
  id: string,
  options: UseMutationOptionsWrapper<Awaited<ReturnType<typeof client.paymentCollection.markAsAuthorized>>, unknown, void> = {}
) => {
  const { client } = useMedusaAdmin()
  if (!options?.onSuccess) {
    const queryClient = useQueryClient()
    options.onSuccess = async () => {
      await queryClient.invalidateQueries('paymentCollection')
    }
  }
  return useMutation<Awaited<ReturnType<typeof client.paymentCollection.markAsAuthorized>>, unknown, void>(
    ['paymentCollection', 'markAsAuthorized', id],
    () => client.paymentCollection.markAsAuthorized(id),
    options
  );
};


