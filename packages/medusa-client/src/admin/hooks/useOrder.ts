/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { UseQueryOptionsWrapper, UseMutationOptionsWrapper} from '../core/HookUtils';
import { useMedusaAdmin } from '../useMedusaAdmin';
import type { AdminGetOrdersOrderParams } from '../models/AdminGetOrdersOrderParams';
import type { AdminGetOrdersParams } from '../models/AdminGetOrdersParams';
import type { AdminOrdersListRes } from '../models/AdminOrdersListRes';
import type { AdminOrdersRes } from '../models/AdminOrdersRes';
import type { AdminPostOrdersOrderRefundsReq } from '../models/AdminPostOrdersOrderRefundsReq';
import type { AdminPostOrdersOrderReq } from '../models/AdminPostOrdersOrderReq';
import type { AdminPostOrdersOrderReturnsReq } from '../models/AdminPostOrdersOrderReturnsReq';
import type { AdminPostOrdersOrderShipmentReq } from '../models/AdminPostOrdersOrderShipmentReq';
import type { AdminPostOrdersOrderShippingMethodsReq } from '../models/AdminPostOrdersOrderShippingMethodsReq';

export const useOrderList = (
  queryParams: AdminGetOrdersParams,
  options: UseQueryOptionsWrapper<Awaited<ReturnType<typeof client.order.list>>> = {}
) => {
  const { client } = useMedusaAdmin()
  const { data, ...rest } = useQuery<Awaited<ReturnType<typeof client.order.list>>>(
    ['order', 'list', queryParams],
    () => client.order.list(queryParams),
    options
  );
  return { ...data, ...rest } as const
};

export const useOrderRetrieve = (
  id: string,
  queryParams: AdminGetOrdersOrderParams,
  options: UseQueryOptionsWrapper<Awaited<ReturnType<typeof client.order.retrieve>>> = {}
) => {
  const { client } = useMedusaAdmin()
  const { data, ...rest } = useQuery<Awaited<ReturnType<typeof client.order.retrieve>>>(
    ['order', 'retrieve', id,queryParams],
    () => client.order.retrieve(id,queryParams),
    options
  );
  return { ...data, ...rest } as const
};

export const useOrderUpdate = (
  id: string,
  requestBody: AdminPostOrdersOrderReq,
  options: UseMutationOptionsWrapper<Awaited<ReturnType<typeof client.order.update>>, unknown, AdminPostOrdersOrderReq> = {}
) => {
  const { client } = useMedusaAdmin()
  if (!options?.onSuccess) {
    const queryClient = useQueryClient()
    options.onSuccess = async () => {
      await queryClient.invalidateQueries('order')
    }
  }
  return useMutation<Awaited<ReturnType<typeof client.order.update>>, unknown, AdminPostOrdersOrderReq>(
    ['order', 'update', id,requestBody],
    () => client.order.update(id,requestBody),
    options
  );
};

export const useOrderArchive = (
  id: string,
  options: UseMutationOptionsWrapper<Awaited<ReturnType<typeof client.order.archive>>, unknown, void> = {}
) => {
  const { client } = useMedusaAdmin()
  if (!options?.onSuccess) {
    const queryClient = useQueryClient()
    options.onSuccess = async () => {
      await queryClient.invalidateQueries('order')
    }
  }
  return useMutation<Awaited<ReturnType<typeof client.order.archive>>, unknown, void>(
    ['order', 'archive', id],
    () => client.order.archive(id),
    options
  );
};

export const useOrderCancel = (
  id: string,
  options: UseMutationOptionsWrapper<Awaited<ReturnType<typeof client.order.cancel>>, unknown, void> = {}
) => {
  const { client } = useMedusaAdmin()
  if (!options?.onSuccess) {
    const queryClient = useQueryClient()
    options.onSuccess = async () => {
      await queryClient.invalidateQueries('order')
    }
  }
  return useMutation<Awaited<ReturnType<typeof client.order.cancel>>, unknown, void>(
    ['order', 'cancel', id],
    () => client.order.cancel(id),
    options
  );
};

export const useOrderCapturePayment = (
  id: string,
  options: UseMutationOptionsWrapper<Awaited<ReturnType<typeof client.order.capturePayment>>, unknown, void> = {}
) => {
  const { client } = useMedusaAdmin()
  if (!options?.onSuccess) {
    const queryClient = useQueryClient()
    options.onSuccess = async () => {
      await queryClient.invalidateQueries('order')
    }
  }
  return useMutation<Awaited<ReturnType<typeof client.order.capturePayment>>, unknown, void>(
    ['order', 'capturePayment', id],
    () => client.order.capturePayment(id),
    options
  );
};

export const useOrderComplete = (
  id: string,
  options: UseMutationOptionsWrapper<Awaited<ReturnType<typeof client.order.complete>>, unknown, void> = {}
) => {
  const { client } = useMedusaAdmin()
  if (!options?.onSuccess) {
    const queryClient = useQueryClient()
    options.onSuccess = async () => {
      await queryClient.invalidateQueries('order')
    }
  }
  return useMutation<Awaited<ReturnType<typeof client.order.complete>>, unknown, void>(
    ['order', 'complete', id],
    () => client.order.complete(id),
    options
  );
};

export const useOrderRefundPayment = (
  id: string,
  requestBody: AdminPostOrdersOrderRefundsReq,
  options: UseMutationOptionsWrapper<Awaited<ReturnType<typeof client.order.refundPayment>>, unknown, AdminPostOrdersOrderRefundsReq> = {}
) => {
  const { client } = useMedusaAdmin()
  if (!options?.onSuccess) {
    const queryClient = useQueryClient()
    options.onSuccess = async () => {
      await queryClient.invalidateQueries('order')
    }
  }
  return useMutation<Awaited<ReturnType<typeof client.order.refundPayment>>, unknown, AdminPostOrdersOrderRefundsReq>(
    ['order', 'refundPayment', id,requestBody],
    () => client.order.refundPayment(id,requestBody),
    options
  );
};

export const useOrderRequestReturn = (
  id: string,
  requestBody: AdminPostOrdersOrderReturnsReq,
  options: UseMutationOptionsWrapper<Awaited<ReturnType<typeof client.order.requestReturn>>, unknown, AdminPostOrdersOrderReturnsReq> = {}
) => {
  const { client } = useMedusaAdmin()
  if (!options?.onSuccess) {
    const queryClient = useQueryClient()
    options.onSuccess = async () => {
      await queryClient.invalidateQueries('order')
    }
  }
  return useMutation<Awaited<ReturnType<typeof client.order.requestReturn>>, unknown, AdminPostOrdersOrderReturnsReq>(
    ['order', 'requestReturn', id,requestBody],
    () => client.order.requestReturn(id,requestBody),
    options
  );
};

export const useOrderCreateShipment = (
  id: string,
  requestBody: AdminPostOrdersOrderShipmentReq,
  options: UseMutationOptionsWrapper<Awaited<ReturnType<typeof client.order.createShipment>>, unknown, AdminPostOrdersOrderShipmentReq> = {}
) => {
  const { client } = useMedusaAdmin()
  if (!options?.onSuccess) {
    const queryClient = useQueryClient()
    options.onSuccess = async () => {
      await queryClient.invalidateQueries('order')
    }
  }
  return useMutation<Awaited<ReturnType<typeof client.order.createShipment>>, unknown, AdminPostOrdersOrderShipmentReq>(
    ['order', 'createShipment', id,requestBody],
    () => client.order.createShipment(id,requestBody),
    options
  );
};

export const useOrderAddShippingMethod = (
  id: string,
  requestBody: AdminPostOrdersOrderShippingMethodsReq,
  options: UseMutationOptionsWrapper<Awaited<ReturnType<typeof client.order.addShippingMethod>>, unknown, AdminPostOrdersOrderShippingMethodsReq> = {}
) => {
  const { client } = useMedusaAdmin()
  if (!options?.onSuccess) {
    const queryClient = useQueryClient()
    options.onSuccess = async () => {
      await queryClient.invalidateQueries('order')
    }
  }
  return useMutation<Awaited<ReturnType<typeof client.order.addShippingMethod>>, unknown, AdminPostOrdersOrderShippingMethodsReq>(
    ['order', 'addShippingMethod', id,requestBody],
    () => client.order.addShippingMethod(id,requestBody),
    options
  );
};


