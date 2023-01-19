/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { UseQueryOptionsWrapper, UseMutationOptionsWrapper} from '../core/HookUtils';
import { useMedusaAdmin } from '../useMedusaAdmin';
import type { AdminPaymentRes } from '../models/AdminPaymentRes';
import type { AdminPostPaymentRefundsReq } from '../models/AdminPostPaymentRefundsReq';
import type { AdminRefundRes } from '../models/AdminRefundRes';
import type { GetPaymentsParams } from '../models/GetPaymentsParams';

const { client } = useMedusaAdmin()

export const usePaymentRetrieve = (
  id: string,
  options: UseQueryOptionsWrapper<Awaited<ReturnType<typeof client.payment.retrieve>>> = {}
) => {
  const { data, ...rest } = useQuery<Awaited<ReturnType<typeof client.payment.retrieve>>>(
    ['payment', 'retrieve', id],
    () => client.payment.retrieve(id),
    options
  );
  return { ...data, ...rest } as const
};

export const usePaymentCapturePayment = (
  id: string,
  options: UseMutationOptionsWrapper<Awaited<ReturnType<typeof client.payment.capturePayment>>, unknown, void> = {}
) => {
  if (!options?.onSuccess) {
    const queryClient = useQueryClient()
    options.onSuccess = async () => {
      await queryClient.invalidateQueries('payment')
    }
  }
  return useMutation<Awaited<ReturnType<typeof client.payment.capturePayment>>, unknown, void>(
    ['payment', 'capturePayment', id],
    () => client.payment.capturePayment(id),
    options
  );
};

export const usePaymentRefundPayment = (
  id: string,
  requestBody: AdminPostPaymentRefundsReq,
  options: UseMutationOptionsWrapper<Awaited<ReturnType<typeof client.payment.refundPayment>>, unknown, AdminPostPaymentRefundsReq> = {}
) => {
  if (!options?.onSuccess) {
    const queryClient = useQueryClient()
    options.onSuccess = async () => {
      await queryClient.invalidateQueries('payment')
    }
  }
  return useMutation<Awaited<ReturnType<typeof client.payment.refundPayment>>, unknown, AdminPostPaymentRefundsReq>(
    ['payment', 'refundPayment', id,requestBody],
    () => client.payment.refundPayment(id,requestBody),
    options
  );
};


