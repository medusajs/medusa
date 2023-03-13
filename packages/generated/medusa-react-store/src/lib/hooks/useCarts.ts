/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { UseQueryOptionsWrapper, UseMutationOptionsWrapper} from '../core/HookUtils';
import { useMedusaStore } from '../useMedusaStore';
import type { StoreCartsRes } from '@medusajs/client-types';
import type { StoreCompleteCartRes } from '@medusajs/client-types';
import type { StorePostCartReq } from '@medusajs/client-types';
import type { StorePostCartsCartLineItemsItemReq } from '@medusajs/client-types';
import type { StorePostCartsCartLineItemsReq } from '@medusajs/client-types';
import type { StorePostCartsCartPaymentSessionReq } from '@medusajs/client-types';
import type { StorePostCartsCartPaymentSessionUpdateReq } from '@medusajs/client-types';
import type { StorePostCartsCartReq } from '@medusajs/client-types';
import type { StorePostCartsCartShippingMethodReq } from '@medusajs/client-types';

const { client } = useMedusaStore()

export const useCartsCreate = (
  requestBody: StorePostCartReq,
  options: UseMutationOptionsWrapper<Awaited<ReturnType<typeof client.carts.create>>, unknown, StorePostCartReq> = {}
) => {
  if (!options?.onSuccess) {
    const queryClient = useQueryClient()
    options.onSuccess = async () => {
      await queryClient.invalidateQueries('carts')
    }
  }
  return useMutation<Awaited<ReturnType<typeof client.carts.create>>, unknown, StorePostCartReq>(
    ['carts', 'create', requestBody],
    () => client.carts.create(requestBody),
    options
  );
};

export const useCartsRetrieve = (
  id: string,
  options: UseQueryOptionsWrapper<Awaited<ReturnType<typeof client.carts.retrieve>>> = {}
) => {
  const { data, ...rest } = useQuery<Awaited<ReturnType<typeof client.carts.retrieve>>>(
    ['carts', 'retrieve', id],
    () => client.carts.retrieve(id),
    options
  );
  return { ...data, ...rest } as const
};

export const useCartsUpdate = (
  id: string,
  requestBody: StorePostCartsCartReq,
  options: UseMutationOptionsWrapper<Awaited<ReturnType<typeof client.carts.update>>, unknown, StorePostCartsCartReq> = {}
) => {
  if (!options?.onSuccess) {
    const queryClient = useQueryClient()
    options.onSuccess = async () => {
      await queryClient.invalidateQueries('carts')
    }
  }
  return useMutation<Awaited<ReturnType<typeof client.carts.update>>, unknown, StorePostCartsCartReq>(
    ['carts', 'update', id,requestBody],
    () => client.carts.update(id,requestBody),
    options
  );
};

export const useCartsComplete = (
  id: string,
  options: UseMutationOptionsWrapper<Awaited<ReturnType<typeof client.carts.complete>>, unknown, void> = {}
) => {
  if (!options?.onSuccess) {
    const queryClient = useQueryClient()
    options.onSuccess = async () => {
      await queryClient.invalidateQueries('carts')
    }
  }
  return useMutation<Awaited<ReturnType<typeof client.carts.complete>>, unknown, void>(
    ['carts', 'complete', id],
    () => client.carts.complete(id),
    options
  );
};

export const useCartsDeleteDiscount = (
  id: string,
  code: string,
  options: UseMutationOptionsWrapper<Awaited<ReturnType<typeof client.carts.deleteDiscount>>, unknown, void> = {}
) => {
  if (!options?.onSuccess) {
    const queryClient = useQueryClient()
    options.onSuccess = async () => {
      await queryClient.invalidateQueries('carts')
    }
  }
  return useMutation<Awaited<ReturnType<typeof client.carts.deleteDiscount>>, unknown, void>(
    ['carts', 'deleteDiscount', id,code],
    () => client.carts.deleteDiscount(id,code),
    options
  );
};

export const useCartsCreateLineItem = (
  id: string,
  requestBody: StorePostCartsCartLineItemsReq,
  options: UseMutationOptionsWrapper<Awaited<ReturnType<typeof client.carts.createLineItem>>, unknown, StorePostCartsCartLineItemsReq> = {}
) => {
  if (!options?.onSuccess) {
    const queryClient = useQueryClient()
    options.onSuccess = async () => {
      await queryClient.invalidateQueries('carts')
    }
  }
  return useMutation<Awaited<ReturnType<typeof client.carts.createLineItem>>, unknown, StorePostCartsCartLineItemsReq>(
    ['carts', 'createLineItem', id,requestBody],
    () => client.carts.createLineItem(id,requestBody),
    options
  );
};

export const useCartsUpdateLineItem = (
  id: string,
  lineId: string,
  requestBody: StorePostCartsCartLineItemsItemReq,
  options: UseMutationOptionsWrapper<Awaited<ReturnType<typeof client.carts.updateLineItem>>, unknown, StorePostCartsCartLineItemsItemReq> = {}
) => {
  if (!options?.onSuccess) {
    const queryClient = useQueryClient()
    options.onSuccess = async () => {
      await queryClient.invalidateQueries('carts')
    }
  }
  return useMutation<Awaited<ReturnType<typeof client.carts.updateLineItem>>, unknown, StorePostCartsCartLineItemsItemReq>(
    ['carts', 'updateLineItem', id,lineId,requestBody],
    () => client.carts.updateLineItem(id,lineId,requestBody),
    options
  );
};

export const useCartsDeleteLineItem = (
  id: string,
  lineId: string,
  options: UseMutationOptionsWrapper<Awaited<ReturnType<typeof client.carts.deleteLineItem>>, unknown, void> = {}
) => {
  if (!options?.onSuccess) {
    const queryClient = useQueryClient()
    options.onSuccess = async () => {
      await queryClient.invalidateQueries('carts')
    }
  }
  return useMutation<Awaited<ReturnType<typeof client.carts.deleteLineItem>>, unknown, void>(
    ['carts', 'deleteLineItem', id,lineId],
    () => client.carts.deleteLineItem(id,lineId),
    options
  );
};

export const useCartsSetPaymentSession = (
  id: string,
  requestBody: StorePostCartsCartPaymentSessionReq,
  options: UseMutationOptionsWrapper<Awaited<ReturnType<typeof client.carts.setPaymentSession>>, unknown, StorePostCartsCartPaymentSessionReq> = {}
) => {
  if (!options?.onSuccess) {
    const queryClient = useQueryClient()
    options.onSuccess = async () => {
      await queryClient.invalidateQueries('carts')
    }
  }
  return useMutation<Awaited<ReturnType<typeof client.carts.setPaymentSession>>, unknown, StorePostCartsCartPaymentSessionReq>(
    ['carts', 'setPaymentSession', id,requestBody],
    () => client.carts.setPaymentSession(id,requestBody),
    options
  );
};

export const useCartsCreatePaymentSessions = (
  id: string,
  options: UseMutationOptionsWrapper<Awaited<ReturnType<typeof client.carts.createPaymentSessions>>, unknown, void> = {}
) => {
  if (!options?.onSuccess) {
    const queryClient = useQueryClient()
    options.onSuccess = async () => {
      await queryClient.invalidateQueries('carts')
    }
  }
  return useMutation<Awaited<ReturnType<typeof client.carts.createPaymentSessions>>, unknown, void>(
    ['carts', 'createPaymentSessions', id],
    () => client.carts.createPaymentSessions(id),
    options
  );
};

export const useCartsUpdatePaymentSession = (
  id: string,
  providerId: string,
  requestBody: StorePostCartsCartPaymentSessionUpdateReq,
  options: UseMutationOptionsWrapper<Awaited<ReturnType<typeof client.carts.updatePaymentSession>>, unknown, StorePostCartsCartPaymentSessionUpdateReq> = {}
) => {
  if (!options?.onSuccess) {
    const queryClient = useQueryClient()
    options.onSuccess = async () => {
      await queryClient.invalidateQueries('carts')
    }
  }
  return useMutation<Awaited<ReturnType<typeof client.carts.updatePaymentSession>>, unknown, StorePostCartsCartPaymentSessionUpdateReq>(
    ['carts', 'updatePaymentSession', id,providerId,requestBody],
    () => client.carts.updatePaymentSession(id,providerId,requestBody),
    options
  );
};

export const useCartsDeletePaymentSession = (
  id: string,
  providerId: string,
  options: UseMutationOptionsWrapper<Awaited<ReturnType<typeof client.carts.deletePaymentSession>>, unknown, void> = {}
) => {
  if (!options?.onSuccess) {
    const queryClient = useQueryClient()
    options.onSuccess = async () => {
      await queryClient.invalidateQueries('carts')
    }
  }
  return useMutation<Awaited<ReturnType<typeof client.carts.deletePaymentSession>>, unknown, void>(
    ['carts', 'deletePaymentSession', id,providerId],
    () => client.carts.deletePaymentSession(id,providerId),
    options
  );
};

export const useCartsRefreshPaymentSession = (
  id: string,
  providerId: string,
  options: UseMutationOptionsWrapper<Awaited<ReturnType<typeof client.carts.refreshPaymentSession>>, unknown, void> = {}
) => {
  if (!options?.onSuccess) {
    const queryClient = useQueryClient()
    options.onSuccess = async () => {
      await queryClient.invalidateQueries('carts')
    }
  }
  return useMutation<Awaited<ReturnType<typeof client.carts.refreshPaymentSession>>, unknown, void>(
    ['carts', 'refreshPaymentSession', id,providerId],
    () => client.carts.refreshPaymentSession(id,providerId),
    options
  );
};

export const useCartsAddShippingMethod = (
  id: string,
  requestBody: StorePostCartsCartShippingMethodReq,
  options: UseMutationOptionsWrapper<Awaited<ReturnType<typeof client.carts.addShippingMethod>>, unknown, StorePostCartsCartShippingMethodReq> = {}
) => {
  if (!options?.onSuccess) {
    const queryClient = useQueryClient()
    options.onSuccess = async () => {
      await queryClient.invalidateQueries('carts')
    }
  }
  return useMutation<Awaited<ReturnType<typeof client.carts.addShippingMethod>>, unknown, StorePostCartsCartShippingMethodReq>(
    ['carts', 'addShippingMethod', id,requestBody],
    () => client.carts.addShippingMethod(id,requestBody),
    options
  );
};

export const useCartsCalculateTaxes = (
  id: string,
  options: UseMutationOptionsWrapper<Awaited<ReturnType<typeof client.carts.calculateTaxes>>, unknown, void> = {}
) => {
  if (!options?.onSuccess) {
    const queryClient = useQueryClient()
    options.onSuccess = async () => {
      await queryClient.invalidateQueries('carts')
    }
  }
  return useMutation<Awaited<ReturnType<typeof client.carts.calculateTaxes>>, unknown, void>(
    ['carts', 'calculateTaxes', id],
    () => client.carts.calculateTaxes(id),
    options
  );
};


