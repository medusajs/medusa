/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { UseQueryOptionsWrapper, UseMutationOptionsWrapper} from '../core/HookUtils';
import { useMedusaAdmin } from '../useMedusaAdmin';
import type { AdminGetSwapsParams } from '../models/AdminGetSwapsParams';
import type { AdminOrdersRes } from '../models/AdminOrdersRes';
import type { AdminPostOrdersOrderSwapsReq } from '../models/AdminPostOrdersOrderSwapsReq';
import type { AdminPostOrdersOrderSwapsSwapShipmentsReq } from '../models/AdminPostOrdersOrderSwapsSwapShipmentsReq';
import type { AdminSwapsListRes } from '../models/AdminSwapsListRes';
import type { AdminSwapsRes } from '../models/AdminSwapsRes';

const { client } = useMedusaAdmin()

export const useSwapCreateSwap = (
  id: string,
  requestBody: AdminPostOrdersOrderSwapsReq,
  options: UseMutationOptionsWrapper<Awaited<ReturnType<typeof client.swap.createSwap>>, unknown, AdminPostOrdersOrderSwapsReq> = {}
) => {
  if (!options?.onSuccess) {
    const queryClient = useQueryClient()
    options.onSuccess = async () => {
      await queryClient.invalidateQueries('swap')
    }
  }
  return useMutation<Awaited<ReturnType<typeof client.swap.createSwap>>, unknown, AdminPostOrdersOrderSwapsReq>(
    ['swap', 'createSwap', id,requestBody],
    () => client.swap.createSwap(id,requestBody),
    options
  );
};

export const useSwapCancelSwap = (
  id: string,
  swapId: string,
  options: UseMutationOptionsWrapper<Awaited<ReturnType<typeof client.swap.cancelSwap>>, unknown, void> = {}
) => {
  if (!options?.onSuccess) {
    const queryClient = useQueryClient()
    options.onSuccess = async () => {
      await queryClient.invalidateQueries('swap')
    }
  }
  return useMutation<Awaited<ReturnType<typeof client.swap.cancelSwap>>, unknown, void>(
    ['swap', 'cancelSwap', id,swapId],
    () => client.swap.cancelSwap(id,swapId),
    options
  );
};

export const useSwapProcessSwapPayment = (
  id: string,
  swapId: string,
  options: UseMutationOptionsWrapper<Awaited<ReturnType<typeof client.swap.processSwapPayment>>, unknown, void> = {}
) => {
  if (!options?.onSuccess) {
    const queryClient = useQueryClient()
    options.onSuccess = async () => {
      await queryClient.invalidateQueries('swap')
    }
  }
  return useMutation<Awaited<ReturnType<typeof client.swap.processSwapPayment>>, unknown, void>(
    ['swap', 'processSwapPayment', id,swapId],
    () => client.swap.processSwapPayment(id,swapId),
    options
  );
};

export const useSwapCreateSwapShipment = (
  id: string,
  swapId: string,
  requestBody: AdminPostOrdersOrderSwapsSwapShipmentsReq,
  options: UseMutationOptionsWrapper<Awaited<ReturnType<typeof client.swap.createSwapShipment>>, unknown, AdminPostOrdersOrderSwapsSwapShipmentsReq> = {}
) => {
  if (!options?.onSuccess) {
    const queryClient = useQueryClient()
    options.onSuccess = async () => {
      await queryClient.invalidateQueries('swap')
    }
  }
  return useMutation<Awaited<ReturnType<typeof client.swap.createSwapShipment>>, unknown, AdminPostOrdersOrderSwapsSwapShipmentsReq>(
    ['swap', 'createSwapShipment', id,swapId,requestBody],
    () => client.swap.createSwapShipment(id,swapId,requestBody),
    options
  );
};

export const useSwapList = (
  queryParams: AdminGetSwapsParams,
  options: UseQueryOptionsWrapper<Awaited<ReturnType<typeof client.swap.list>>> = {}
) => {
  const { data, ...rest } = useQuery<Awaited<ReturnType<typeof client.swap.list>>>(
    ['swap', 'list', queryParams],
    () => client.swap.list(queryParams),
    options
  );
  return { ...data, ...rest } as const
};

export const useSwapRetrieve = (
  id: string,
  options: UseQueryOptionsWrapper<Awaited<ReturnType<typeof client.swap.retrieve>>> = {}
) => {
  const { data, ...rest } = useQuery<Awaited<ReturnType<typeof client.swap.retrieve>>>(
    ['swap', 'retrieve', id],
    () => client.swap.retrieve(id),
    options
  );
  return { ...data, ...rest } as const
};


