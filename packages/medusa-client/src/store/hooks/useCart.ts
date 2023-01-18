/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { UseQueryOptionsWrapper, UseMutationOptionsWrapper} from '../core/HookUtils';
import { useMedusaStore } from '../useMedusaStore';
import type { StoreCartsRes } from '../models/StoreCartsRes';
import type { StoreCompleteCartRes } from '../models/StoreCompleteCartRes';
import type { StorePostCartReq } from '../models/StorePostCartReq';
import type { StorePostCartsCartLineItemsItemReq } from '../models/StorePostCartsCartLineItemsItemReq';
import type { StorePostCartsCartLineItemsReq } from '../models/StorePostCartsCartLineItemsReq';
import type { StorePostCartsCartPaymentSessionUpdateReq } from '../models/StorePostCartsCartPaymentSessionUpdateReq';
import type { StorePostCartsCartReq } from '../models/StorePostCartsCartReq';
import type { StorePostCartsCartShippingMethodReq } from '../models/StorePostCartsCartShippingMethodReq';

export const useCartCreate = (
  requestBody: StorePostCartReq,
  options: UseMutationOptionsWrapper<Awaited<ReturnType<typeof client.cart.create>>, unknown, StorePostCartReq> = {}
) => {
  const { client } = useMedusaStore()
  if (!options?.onSuccess) {
    const queryClient = useQueryClient()
    options.onSuccess = async () => {
      await queryClient.invalidateQueries('cart')
    }
  }
  return useMutation<Awaited<ReturnType<typeof client.cart.create>>, unknown, StorePostCartReq>(
    ['cart', 'create', requestBody],
    () => client.cart.create(requestBody),
    options
  );
};

export const useCartRetrieve = (
  id: string,
  options: UseQueryOptionsWrapper<Awaited<ReturnType<typeof client.cart.retrieve>>> = {}
) => {
  const { client } = useMedusaStore()
  const { data, ...rest } = useQuery<Awaited<ReturnType<typeof client.cart.retrieve>>>(
    ['cart', 'retrieve', id],
    () => client.cart.retrieve(id),
    options
  );
  return { ...data, ...rest } as const
};

export const useCartUpdate = (
  id: string,
  requestBody: StorePostCartsCartReq,
  options: UseMutationOptionsWrapper<Awaited<ReturnType<typeof client.cart.update>>, unknown, StorePostCartsCartReq> = {}
) => {
  const { client } = useMedusaStore()
  if (!options?.onSuccess) {
    const queryClient = useQueryClient()
    options.onSuccess = async () => {
      await queryClient.invalidateQueries('cart')
    }
  }
  return useMutation<Awaited<ReturnType<typeof client.cart.update>>, unknown, StorePostCartsCartReq>(
    ['cart', 'update', id,requestBody],
    () => client.cart.update(id,requestBody),
    options
  );
};

export const useCartComplete = (
  id: string,
  options: UseMutationOptionsWrapper<Awaited<ReturnType<typeof client.cart.complete>>, unknown, void> = {}
) => {
  const { client } = useMedusaStore()
  if (!options?.onSuccess) {
    const queryClient = useQueryClient()
    options.onSuccess = async () => {
      await queryClient.invalidateQueries('cart')
    }
  }
  return useMutation<Awaited<ReturnType<typeof client.cart.complete>>, unknown, void>(
    ['cart', 'complete', id],
    () => client.cart.complete(id),
    options
  );
};

export const useCartDeleteDiscount = (
  id: string,
  code: string,
  options: UseMutationOptionsWrapper<Awaited<ReturnType<typeof client.cart.deleteDiscount>>, unknown, void> = {}
) => {
  const { client } = useMedusaStore()
  if (!options?.onSuccess) {
    const queryClient = useQueryClient()
    options.onSuccess = async () => {
      await queryClient.invalidateQueries('cart')
    }
  }
  return useMutation<Awaited<ReturnType<typeof client.cart.deleteDiscount>>, unknown, void>(
    ['cart', 'deleteDiscount', id,code],
    () => client.cart.deleteDiscount(id,code),
    options
  );
};

export const useCartCreateLineItem = (
  id: string,
  requestBody: StorePostCartsCartLineItemsReq,
  options: UseMutationOptionsWrapper<Awaited<ReturnType<typeof client.cart.createLineItem>>, unknown, StorePostCartsCartLineItemsReq> = {}
) => {
  const { client } = useMedusaStore()
  if (!options?.onSuccess) {
    const queryClient = useQueryClient()
    options.onSuccess = async () => {
      await queryClient.invalidateQueries('cart')
    }
  }
  return useMutation<Awaited<ReturnType<typeof client.cart.createLineItem>>, unknown, StorePostCartsCartLineItemsReq>(
    ['cart', 'createLineItem', id,requestBody],
    () => client.cart.createLineItem(id,requestBody),
    options
  );
};

export const useCartUpdateLineItem = (
  id: string,
  lineId: string,
  requestBody: StorePostCartsCartLineItemsItemReq,
  options: UseMutationOptionsWrapper<Awaited<ReturnType<typeof client.cart.updateLineItem>>, unknown, StorePostCartsCartLineItemsItemReq> = {}
) => {
  const { client } = useMedusaStore()
  if (!options?.onSuccess) {
    const queryClient = useQueryClient()
    options.onSuccess = async () => {
      await queryClient.invalidateQueries('cart')
    }
  }
  return useMutation<Awaited<ReturnType<typeof client.cart.updateLineItem>>, unknown, StorePostCartsCartLineItemsItemReq>(
    ['cart', 'updateLineItem', id,lineId,requestBody],
    () => client.cart.updateLineItem(id,lineId,requestBody),
    options
  );
};

export const useCartDeleteLineItem = (
  id: string,
  lineId: string,
  options: UseMutationOptionsWrapper<Awaited<ReturnType<typeof client.cart.deleteLineItem>>, unknown, void> = {}
) => {
  const { client } = useMedusaStore()
  if (!options?.onSuccess) {
    const queryClient = useQueryClient()
    options.onSuccess = async () => {
      await queryClient.invalidateQueries('cart')
    }
  }
  return useMutation<Awaited<ReturnType<typeof client.cart.deleteLineItem>>, unknown, void>(
    ['cart', 'deleteLineItem', id,lineId],
    () => client.cart.deleteLineItem(id,lineId),
    options
  );
};

export const useCartSetPaymentSession = (
  id: string,
  requestBody: {
    /**
     * The ID of the Payment Provider.
     */
    provider_id: string;
  },
  options: UseMutationOptionsWrapper<Awaited<ReturnType<typeof client.cart.setPaymentSession>>, unknown, any> = {}
) => {
  const { client } = useMedusaStore()
  if (!options?.onSuccess) {
    const queryClient = useQueryClient()
    options.onSuccess = async () => {
      await queryClient.invalidateQueries('cart')
    }
  }
  return useMutation<Awaited<ReturnType<typeof client.cart.setPaymentSession>>, unknown, any>(
    ['cart', 'setPaymentSession', id,requestBody],
    () => client.cart.setPaymentSession(id,requestBody),
    options
  );
};

export const useCartCreatePaymentSessions = (
  id: string,
  options: UseMutationOptionsWrapper<Awaited<ReturnType<typeof client.cart.createPaymentSessions>>, unknown, void> = {}
) => {
  const { client } = useMedusaStore()
  if (!options?.onSuccess) {
    const queryClient = useQueryClient()
    options.onSuccess = async () => {
      await queryClient.invalidateQueries('cart')
    }
  }
  return useMutation<Awaited<ReturnType<typeof client.cart.createPaymentSessions>>, unknown, void>(
    ['cart', 'createPaymentSessions', id],
    () => client.cart.createPaymentSessions(id),
    options
  );
};

export const useCartUpdatePaymentSession = (
  id: string,
  providerId: string,
  requestBody: StorePostCartsCartPaymentSessionUpdateReq,
  options: UseMutationOptionsWrapper<Awaited<ReturnType<typeof client.cart.updatePaymentSession>>, unknown, StorePostCartsCartPaymentSessionUpdateReq> = {}
) => {
  const { client } = useMedusaStore()
  if (!options?.onSuccess) {
    const queryClient = useQueryClient()
    options.onSuccess = async () => {
      await queryClient.invalidateQueries('cart')
    }
  }
  return useMutation<Awaited<ReturnType<typeof client.cart.updatePaymentSession>>, unknown, StorePostCartsCartPaymentSessionUpdateReq>(
    ['cart', 'updatePaymentSession', id,providerId,requestBody],
    () => client.cart.updatePaymentSession(id,providerId,requestBody),
    options
  );
};

export const useCartDeletePaymentSession = (
  id: string,
  providerId: string,
  options: UseMutationOptionsWrapper<Awaited<ReturnType<typeof client.cart.deletePaymentSession>>, unknown, void> = {}
) => {
  const { client } = useMedusaStore()
  if (!options?.onSuccess) {
    const queryClient = useQueryClient()
    options.onSuccess = async () => {
      await queryClient.invalidateQueries('cart')
    }
  }
  return useMutation<Awaited<ReturnType<typeof client.cart.deletePaymentSession>>, unknown, void>(
    ['cart', 'deletePaymentSession', id,providerId],
    () => client.cart.deletePaymentSession(id,providerId),
    options
  );
};

export const useCartRefreshPaymentSession = (
  id: string,
  providerId: string,
  options: UseMutationOptionsWrapper<Awaited<ReturnType<typeof client.cart.refreshPaymentSession>>, unknown, void> = {}
) => {
  const { client } = useMedusaStore()
  if (!options?.onSuccess) {
    const queryClient = useQueryClient()
    options.onSuccess = async () => {
      await queryClient.invalidateQueries('cart')
    }
  }
  return useMutation<Awaited<ReturnType<typeof client.cart.refreshPaymentSession>>, unknown, void>(
    ['cart', 'refreshPaymentSession', id,providerId],
    () => client.cart.refreshPaymentSession(id,providerId),
    options
  );
};

export const useCartAddShippingMethod = (
  id: string,
  requestBody: StorePostCartsCartShippingMethodReq,
  options: UseMutationOptionsWrapper<Awaited<ReturnType<typeof client.cart.addShippingMethod>>, unknown, StorePostCartsCartShippingMethodReq> = {}
) => {
  const { client } = useMedusaStore()
  if (!options?.onSuccess) {
    const queryClient = useQueryClient()
    options.onSuccess = async () => {
      await queryClient.invalidateQueries('cart')
    }
  }
  return useMutation<Awaited<ReturnType<typeof client.cart.addShippingMethod>>, unknown, StorePostCartsCartShippingMethodReq>(
    ['cart', 'addShippingMethod', id,requestBody],
    () => client.cart.addShippingMethod(id,requestBody),
    options
  );
};

export const useCartCalculateTaxes = (
  id: string,
  options: UseMutationOptionsWrapper<Awaited<ReturnType<typeof client.cart.calculateTaxes>>, unknown, void> = {}
) => {
  const { client } = useMedusaStore()
  if (!options?.onSuccess) {
    const queryClient = useQueryClient()
    options.onSuccess = async () => {
      await queryClient.invalidateQueries('cart')
    }
  }
  return useMutation<Awaited<ReturnType<typeof client.cart.calculateTaxes>>, unknown, void>(
    ['cart', 'calculateTaxes', id],
    () => client.cart.calculateTaxes(id),
    options
  );
};


