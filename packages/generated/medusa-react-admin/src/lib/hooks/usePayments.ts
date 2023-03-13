/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { UseQueryOptionsWrapper, UseMutationOptionsWrapper} from '../core/HookUtils';
import { useMedusaAdmin } from '../useMedusaAdmin';
import type { AdminPaymentRes } from '@medusajs/client-types';
import type { AdminPostPaymentRefundsReq } from '@medusajs/client-types';
import type { AdminRefundRes } from '@medusajs/client-types';
import type { GetPaymentsParams } from '@medusajs/client-types';

const { client } = useMedusaAdmin()

export const usePaymentsRetrieve = (
  id: string,
  options: UseQueryOptionsWrapper<Awaited<ReturnType<typeof client.payments.retrieve>>> = {}
) => {
  const { data, ...rest } = useQuery<Awaited<ReturnType<typeof client.payments.retrieve>>>(
    ['payments', 'retrieve', id],
    () => client.payments.retrieve(id),
    options
  );
  return { ...data, ...rest } as const
};

export const usePaymentsCapturePayment = (
  id: string,
  options: UseMutationOptionsWrapper<Awaited<ReturnType<typeof client.payments.capturePayment>>, unknown, void> = {}
) => {
  if (!options?.onSuccess) {
    const queryClient = useQueryClient()
    options.onSuccess = async () => {
      await queryClient.invalidateQueries('payments')
    }
  }
  return useMutation<Awaited<ReturnType<typeof client.payments.capturePayment>>, unknown, void>(
    ['payments', 'capturePayment', id],
    () => client.payments.capturePayment(id),
    options
  );
};

export const usePaymentsRefundPayment = (
  id: string,
  requestBody: AdminPostPaymentRefundsReq,
  options: UseMutationOptionsWrapper<Awaited<ReturnType<typeof client.payments.refundPayment>>, unknown, AdminPostPaymentRefundsReq> = {}
) => {
  if (!options?.onSuccess) {
    const queryClient = useQueryClient()
    options.onSuccess = async () => {
      await queryClient.invalidateQueries('payments')
    }
  }
  return useMutation<Awaited<ReturnType<typeof client.payments.refundPayment>>, unknown, AdminPostPaymentRefundsReq>(
    ['payments', 'refundPayment', id,requestBody],
    () => client.payments.refundPayment(id,requestBody),
    options
  );
};


