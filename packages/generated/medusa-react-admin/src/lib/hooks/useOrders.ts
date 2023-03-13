/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { UseQueryOptionsWrapper, UseMutationOptionsWrapper} from '../core/HookUtils';
import { useMedusaAdmin } from '../useMedusaAdmin';
import type { AdminGetOrdersOrderParams } from '@medusajs/client-types';
import type { AdminGetOrdersParams } from '@medusajs/client-types';
import type { AdminOrdersListRes } from '@medusajs/client-types';
import type { AdminOrdersOrderLineItemReservationReq } from '@medusajs/client-types';
import type { AdminOrdersRes } from '@medusajs/client-types';
import type { AdminPostOrdersOrderClaimsClaimFulfillmentsReq } from '@medusajs/client-types';
import type { AdminPostOrdersOrderClaimsClaimReq } from '@medusajs/client-types';
import type { AdminPostOrdersOrderClaimsClaimShipmentsReq } from '@medusajs/client-types';
import type { AdminPostOrdersOrderClaimsReq } from '@medusajs/client-types';
import type { AdminPostOrdersOrderFulfillmentsReq } from '@medusajs/client-types';
import type { AdminPostOrdersOrderRefundsReq } from '@medusajs/client-types';
import type { AdminPostOrdersOrderReq } from '@medusajs/client-types';
import type { AdminPostOrdersOrderReturnsReq } from '@medusajs/client-types';
import type { AdminPostOrdersOrderShipmentReq } from '@medusajs/client-types';
import type { AdminPostOrdersOrderShippingMethodsReq } from '@medusajs/client-types';
import type { AdminPostOrdersOrderSwapsParams } from '@medusajs/client-types';
import type { AdminPostOrdersOrderSwapsReq } from '@medusajs/client-types';
import type { AdminPostOrdersOrderSwapsSwapFulfillmentsReq } from '@medusajs/client-types';
import type { AdminPostOrdersOrderSwapsSwapShipmentsReq } from '@medusajs/client-types';
import type { AdminPostReservationsReq } from '@medusajs/client-types';
import type { AdminReservationsListRes } from '@medusajs/client-types';

const { client } = useMedusaAdmin()

export const useOrdersList = (
  queryParams: AdminGetOrdersParams,
  options: UseQueryOptionsWrapper<Awaited<ReturnType<typeof client.orders.list>>> = {}
) => {
  const { data, ...rest } = useQuery<Awaited<ReturnType<typeof client.orders.list>>>(
    ['orders', 'list', queryParams],
    () => client.orders.list(queryParams),
    options
  );
  return { ...data, ...rest } as const
};

export const useOrdersRetrieve = (
  id: string,
  queryParams: AdminGetOrdersOrderParams,
  options: UseQueryOptionsWrapper<Awaited<ReturnType<typeof client.orders.retrieve>>> = {}
) => {
  const { data, ...rest } = useQuery<Awaited<ReturnType<typeof client.orders.retrieve>>>(
    ['orders', 'retrieve', id,queryParams],
    () => client.orders.retrieve(id,queryParams),
    options
  );
  return { ...data, ...rest } as const
};

export const useOrdersUpdate = (
  id: string,
  requestBody: AdminPostOrdersOrderReq,
  queryParams: {
    /**
     * Comma separated list of relations to include in the result.
     */
    expand?: string,
    /**
     * Comma separated list of fields to include in the result.
     */
    fields?: string,
  },
  options: UseMutationOptionsWrapper<Awaited<ReturnType<typeof client.orders.update>>, unknown, AdminPostOrdersOrderReq> = {}
) => {
  if (!options?.onSuccess) {
    const queryClient = useQueryClient()
    options.onSuccess = async () => {
      await queryClient.invalidateQueries('orders')
    }
  }
  return useMutation<Awaited<ReturnType<typeof client.orders.update>>, unknown, AdminPostOrdersOrderReq>(
    ['orders', 'update', id,requestBody,queryParams],
    () => client.orders.update(id,requestBody,queryParams),
    options
  );
};

export const useOrdersArchive = (
  id: string,
  queryParams: {
    /**
     * Comma separated list of relations to include in the result.
     */
    expand?: string,
    /**
     * Comma separated list of fields to include in the result.
     */
    fields?: string,
  },
  options: UseMutationOptionsWrapper<Awaited<ReturnType<typeof client.orders.archive>>, unknown, void> = {}
) => {
  if (!options?.onSuccess) {
    const queryClient = useQueryClient()
    options.onSuccess = async () => {
      await queryClient.invalidateQueries('orders')
    }
  }
  return useMutation<Awaited<ReturnType<typeof client.orders.archive>>, unknown, void>(
    ['orders', 'archive', id,queryParams],
    () => client.orders.archive(id,queryParams),
    options
  );
};

export const useOrdersCancel = (
  id: string,
  queryParams: {
    /**
     * Comma separated list of relations to include in the result.
     */
    expand?: string,
    /**
     * Comma separated list of fields to include in the result.
     */
    fields?: string,
  },
  options: UseMutationOptionsWrapper<Awaited<ReturnType<typeof client.orders.cancel>>, unknown, void> = {}
) => {
  if (!options?.onSuccess) {
    const queryClient = useQueryClient()
    options.onSuccess = async () => {
      await queryClient.invalidateQueries('orders')
    }
  }
  return useMutation<Awaited<ReturnType<typeof client.orders.cancel>>, unknown, void>(
    ['orders', 'cancel', id,queryParams],
    () => client.orders.cancel(id,queryParams),
    options
  );
};

export const useOrdersCapturePayment = (
  id: string,
  queryParams: {
    /**
     * Comma separated list of relations to include in the result.
     */
    expand?: string,
    /**
     * Comma separated list of fields to include in the result.
     */
    fields?: string,
  },
  options: UseMutationOptionsWrapper<Awaited<ReturnType<typeof client.orders.capturePayment>>, unknown, void> = {}
) => {
  if (!options?.onSuccess) {
    const queryClient = useQueryClient()
    options.onSuccess = async () => {
      await queryClient.invalidateQueries('orders')
    }
  }
  return useMutation<Awaited<ReturnType<typeof client.orders.capturePayment>>, unknown, void>(
    ['orders', 'capturePayment', id,queryParams],
    () => client.orders.capturePayment(id,queryParams),
    options
  );
};

export const useOrdersCreateClaim = (
  id: string,
  requestBody: AdminPostOrdersOrderClaimsReq,
  queryParams: {
    /**
     * Comma separated list of relations to include in the result.
     */
    expand?: string,
    /**
     * Comma separated list of fields to include in the result.
     */
    fields?: string,
  },
  options: UseMutationOptionsWrapper<Awaited<ReturnType<typeof client.orders.createClaim>>, unknown, AdminPostOrdersOrderClaimsReq> = {}
) => {
  if (!options?.onSuccess) {
    const queryClient = useQueryClient()
    options.onSuccess = async () => {
      await queryClient.invalidateQueries('orders')
    }
  }
  return useMutation<Awaited<ReturnType<typeof client.orders.createClaim>>, unknown, AdminPostOrdersOrderClaimsReq>(
    ['orders', 'createClaim', id,requestBody,queryParams],
    () => client.orders.createClaim(id,requestBody,queryParams),
    options
  );
};

export const useOrdersUpdateClaim = (
  id: string,
  claimId: string,
  requestBody: AdminPostOrdersOrderClaimsClaimReq,
  queryParams: {
    /**
     * Comma separated list of relations to include in the result.
     */
    expand?: string,
    /**
     * Comma separated list of fields to include in the result.
     */
    fields?: string,
  },
  options: UseMutationOptionsWrapper<Awaited<ReturnType<typeof client.orders.updateClaim>>, unknown, AdminPostOrdersOrderClaimsClaimReq> = {}
) => {
  if (!options?.onSuccess) {
    const queryClient = useQueryClient()
    options.onSuccess = async () => {
      await queryClient.invalidateQueries('orders')
    }
  }
  return useMutation<Awaited<ReturnType<typeof client.orders.updateClaim>>, unknown, AdminPostOrdersOrderClaimsClaimReq>(
    ['orders', 'updateClaim', id,claimId,requestBody,queryParams],
    () => client.orders.updateClaim(id,claimId,requestBody,queryParams),
    options
  );
};

export const useOrdersCancelClaim = (
  id: string,
  claimId: string,
  queryParams: {
    /**
     * Comma separated list of relations to include in the result.
     */
    expand?: string,
    /**
     * Comma separated list of fields to include in the result.
     */
    fields?: string,
  },
  options: UseMutationOptionsWrapper<Awaited<ReturnType<typeof client.orders.cancelClaim>>, unknown, void> = {}
) => {
  if (!options?.onSuccess) {
    const queryClient = useQueryClient()
    options.onSuccess = async () => {
      await queryClient.invalidateQueries('orders')
    }
  }
  return useMutation<Awaited<ReturnType<typeof client.orders.cancelClaim>>, unknown, void>(
    ['orders', 'cancelClaim', id,claimId,queryParams],
    () => client.orders.cancelClaim(id,claimId,queryParams),
    options
  );
};

export const useOrdersFulfillClaim = (
  id: string,
  claimId: string,
  requestBody: AdminPostOrdersOrderClaimsClaimFulfillmentsReq,
  queryParams: {
    /**
     * Comma separated list of relations to include in the result.
     */
    expand?: string,
    /**
     * Comma separated list of fields to include in the result.
     */
    fields?: string,
  },
  options: UseMutationOptionsWrapper<Awaited<ReturnType<typeof client.orders.fulfillClaim>>, unknown, AdminPostOrdersOrderClaimsClaimFulfillmentsReq> = {}
) => {
  if (!options?.onSuccess) {
    const queryClient = useQueryClient()
    options.onSuccess = async () => {
      await queryClient.invalidateQueries('orders')
    }
  }
  return useMutation<Awaited<ReturnType<typeof client.orders.fulfillClaim>>, unknown, AdminPostOrdersOrderClaimsClaimFulfillmentsReq>(
    ['orders', 'fulfillClaim', id,claimId,requestBody,queryParams],
    () => client.orders.fulfillClaim(id,claimId,requestBody,queryParams),
    options
  );
};

export const useOrdersCancelClaimFulfillment = (
  id: string,
  claimId: string,
  fulfillmentId: string,
  queryParams: {
    /**
     * Comma separated list of relations to include in the result.
     */
    expand?: string,
    /**
     * Comma separated list of fields to include in the result.
     */
    fields?: string,
  },
  options: UseMutationOptionsWrapper<Awaited<ReturnType<typeof client.orders.cancelClaimFulfillment>>, unknown, void> = {}
) => {
  if (!options?.onSuccess) {
    const queryClient = useQueryClient()
    options.onSuccess = async () => {
      await queryClient.invalidateQueries('orders')
    }
  }
  return useMutation<Awaited<ReturnType<typeof client.orders.cancelClaimFulfillment>>, unknown, void>(
    ['orders', 'cancelClaimFulfillment', id,claimId,fulfillmentId,queryParams],
    () => client.orders.cancelClaimFulfillment(id,claimId,fulfillmentId,queryParams),
    options
  );
};

export const useOrdersCreateClaimShipment = (
  id: string,
  claimId: string,
  requestBody: AdminPostOrdersOrderClaimsClaimShipmentsReq,
  queryParams: {
    /**
     * Comma separated list of relations to include in the result.
     */
    expand?: string,
    /**
     * Comma separated list of fields to include in the result.
     */
    fields?: string,
  },
  options: UseMutationOptionsWrapper<Awaited<ReturnType<typeof client.orders.createClaimShipment>>, unknown, AdminPostOrdersOrderClaimsClaimShipmentsReq> = {}
) => {
  if (!options?.onSuccess) {
    const queryClient = useQueryClient()
    options.onSuccess = async () => {
      await queryClient.invalidateQueries('orders')
    }
  }
  return useMutation<Awaited<ReturnType<typeof client.orders.createClaimShipment>>, unknown, AdminPostOrdersOrderClaimsClaimShipmentsReq>(
    ['orders', 'createClaimShipment', id,claimId,requestBody,queryParams],
    () => client.orders.createClaimShipment(id,claimId,requestBody,queryParams),
    options
  );
};

export const useOrdersComplete = (
  id: string,
  queryParams: {
    /**
     * Comma separated list of relations to include in the result.
     */
    expand?: string,
    /**
     * Comma separated list of fields to include in the result.
     */
    fields?: string,
  },
  options: UseMutationOptionsWrapper<Awaited<ReturnType<typeof client.orders.complete>>, unknown, void> = {}
) => {
  if (!options?.onSuccess) {
    const queryClient = useQueryClient()
    options.onSuccess = async () => {
      await queryClient.invalidateQueries('orders')
    }
  }
  return useMutation<Awaited<ReturnType<typeof client.orders.complete>>, unknown, void>(
    ['orders', 'complete', id,queryParams],
    () => client.orders.complete(id,queryParams),
    options
  );
};

export const useOrdersCreateFulfillment = (
  id: string,
  requestBody: AdminPostOrdersOrderFulfillmentsReq,
  queryParams: {
    /**
     * Comma separated list of relations to include in the result.
     */
    expand?: string,
    /**
     * Comma separated list of fields to include in the result.
     */
    fields?: string,
  },
  options: UseMutationOptionsWrapper<Awaited<ReturnType<typeof client.orders.createFulfillment>>, unknown, AdminPostOrdersOrderFulfillmentsReq> = {}
) => {
  if (!options?.onSuccess) {
    const queryClient = useQueryClient()
    options.onSuccess = async () => {
      await queryClient.invalidateQueries('orders')
    }
  }
  return useMutation<Awaited<ReturnType<typeof client.orders.createFulfillment>>, unknown, AdminPostOrdersOrderFulfillmentsReq>(
    ['orders', 'createFulfillment', id,requestBody,queryParams],
    () => client.orders.createFulfillment(id,requestBody,queryParams),
    options
  );
};

export const useOrdersCancelFulfillment = (
  id: string,
  fulfillmentId: string,
  queryParams: {
    /**
     * Comma separated list of relations to include in the result.
     */
    expand?: string,
    /**
     * Comma separated list of fields to include in the result.
     */
    fields?: string,
  },
  options: UseMutationOptionsWrapper<Awaited<ReturnType<typeof client.orders.cancelFulfillment>>, unknown, void> = {}
) => {
  if (!options?.onSuccess) {
    const queryClient = useQueryClient()
    options.onSuccess = async () => {
      await queryClient.invalidateQueries('orders')
    }
  }
  return useMutation<Awaited<ReturnType<typeof client.orders.cancelFulfillment>>, unknown, void>(
    ['orders', 'cancelFulfillment', id,fulfillmentId,queryParams],
    () => client.orders.cancelFulfillment(id,fulfillmentId,queryParams),
    options
  );
};

export const useOrdersPostOrdersOrderLineItemReservations = (
  id: string,
  lineItemId: string,
  requestBody: AdminOrdersOrderLineItemReservationReq,
  options: UseMutationOptionsWrapper<Awaited<ReturnType<typeof client.orders.postOrdersOrderLineItemReservations>>, unknown, AdminOrdersOrderLineItemReservationReq> = {}
) => {
  if (!options?.onSuccess) {
    const queryClient = useQueryClient()
    options.onSuccess = async () => {
      await queryClient.invalidateQueries('orders')
    }
  }
  return useMutation<Awaited<ReturnType<typeof client.orders.postOrdersOrderLineItemReservations>>, unknown, AdminOrdersOrderLineItemReservationReq>(
    ['orders', 'postOrdersOrderLineItemReservations', id,lineItemId,requestBody],
    () => client.orders.postOrdersOrderLineItemReservations(id,lineItemId,requestBody),
    options
  );
};

export const useOrdersRefundPayment = (
  id: string,
  requestBody: AdminPostOrdersOrderRefundsReq,
  queryParams: {
    /**
     * Comma separated list of relations to include in the result.
     */
    expand?: string,
    /**
     * Comma separated list of fields to include in the result.
     */
    fields?: string,
  },
  options: UseMutationOptionsWrapper<Awaited<ReturnType<typeof client.orders.refundPayment>>, unknown, AdminPostOrdersOrderRefundsReq> = {}
) => {
  if (!options?.onSuccess) {
    const queryClient = useQueryClient()
    options.onSuccess = async () => {
      await queryClient.invalidateQueries('orders')
    }
  }
  return useMutation<Awaited<ReturnType<typeof client.orders.refundPayment>>, unknown, AdminPostOrdersOrderRefundsReq>(
    ['orders', 'refundPayment', id,requestBody,queryParams],
    () => client.orders.refundPayment(id,requestBody,queryParams),
    options
  );
};

export const useOrdersGetOrdersOrderReservations = (
  id: string,
  queryParams: {
    /**
     * How many reservations to skip before the results.
     */
    offset?: number,
    /**
     * Limit the number of reservations returned.
     */
    limit?: number,
  },
  options: UseQueryOptionsWrapper<Awaited<ReturnType<typeof client.orders.getOrdersOrderReservations>>> = {}
) => {
  const { data, ...rest } = useQuery<Awaited<ReturnType<typeof client.orders.getOrdersOrderReservations>>>(
    ['orders', 'getOrdersOrderReservations', id,queryParams],
    () => client.orders.getOrdersOrderReservations(id,queryParams),
    options
  );
  return { ...data, ...rest } as const
};

export const useOrdersRequestReturn = (
  id: string,
  requestBody: AdminPostOrdersOrderReturnsReq,
  queryParams: {
    /**
     * Comma separated list of relations to include in the result.
     */
    expand?: string,
    /**
     * Comma separated list of fields to include in the result.
     */
    fields?: string,
  },
  options: UseMutationOptionsWrapper<Awaited<ReturnType<typeof client.orders.requestReturn>>, unknown, AdminPostOrdersOrderReturnsReq> = {}
) => {
  if (!options?.onSuccess) {
    const queryClient = useQueryClient()
    options.onSuccess = async () => {
      await queryClient.invalidateQueries('orders')
    }
  }
  return useMutation<Awaited<ReturnType<typeof client.orders.requestReturn>>, unknown, AdminPostOrdersOrderReturnsReq>(
    ['orders', 'requestReturn', id,requestBody,queryParams],
    () => client.orders.requestReturn(id,requestBody,queryParams),
    options
  );
};

export const useOrdersCreateShipment = (
  id: string,
  requestBody: AdminPostOrdersOrderShipmentReq,
  queryParams: {
    /**
     * Comma separated list of relations to include in the result.
     */
    expand?: string,
    /**
     * Comma separated list of fields to include in the result.
     */
    fields?: string,
  },
  options: UseMutationOptionsWrapper<Awaited<ReturnType<typeof client.orders.createShipment>>, unknown, AdminPostOrdersOrderShipmentReq> = {}
) => {
  if (!options?.onSuccess) {
    const queryClient = useQueryClient()
    options.onSuccess = async () => {
      await queryClient.invalidateQueries('orders')
    }
  }
  return useMutation<Awaited<ReturnType<typeof client.orders.createShipment>>, unknown, AdminPostOrdersOrderShipmentReq>(
    ['orders', 'createShipment', id,requestBody,queryParams],
    () => client.orders.createShipment(id,requestBody,queryParams),
    options
  );
};

export const useOrdersAddShippingMethod = (
  id: string,
  requestBody: AdminPostOrdersOrderShippingMethodsReq,
  queryParams: {
    /**
     * Comma separated list of relations to include in the result.
     */
    expand?: string,
    /**
     * Comma separated list of fields to include in the result.
     */
    fields?: string,
  },
  options: UseMutationOptionsWrapper<Awaited<ReturnType<typeof client.orders.addShippingMethod>>, unknown, AdminPostOrdersOrderShippingMethodsReq> = {}
) => {
  if (!options?.onSuccess) {
    const queryClient = useQueryClient()
    options.onSuccess = async () => {
      await queryClient.invalidateQueries('orders')
    }
  }
  return useMutation<Awaited<ReturnType<typeof client.orders.addShippingMethod>>, unknown, AdminPostOrdersOrderShippingMethodsReq>(
    ['orders', 'addShippingMethod', id,requestBody,queryParams],
    () => client.orders.addShippingMethod(id,requestBody,queryParams),
    options
  );
};

export const useOrdersCreateSwap = (
  id: string,
  requestBody: AdminPostOrdersOrderSwapsReq,
  queryParams: AdminPostOrdersOrderSwapsParams,
  options: UseMutationOptionsWrapper<Awaited<ReturnType<typeof client.orders.createSwap>>, unknown, AdminPostOrdersOrderSwapsReq> = {}
) => {
  if (!options?.onSuccess) {
    const queryClient = useQueryClient()
    options.onSuccess = async () => {
      await queryClient.invalidateQueries('orders')
    }
  }
  return useMutation<Awaited<ReturnType<typeof client.orders.createSwap>>, unknown, AdminPostOrdersOrderSwapsReq>(
    ['orders', 'createSwap', id,requestBody,queryParams],
    () => client.orders.createSwap(id,requestBody,queryParams),
    options
  );
};

export const useOrdersCancelSwap = (
  id: string,
  swapId: string,
  queryParams: {
    /**
     * Comma separated list of relations to include in the result.
     */
    expand?: string,
    /**
     * Comma separated list of fields to include in the result.
     */
    fields?: string,
  },
  options: UseMutationOptionsWrapper<Awaited<ReturnType<typeof client.orders.cancelSwap>>, unknown, void> = {}
) => {
  if (!options?.onSuccess) {
    const queryClient = useQueryClient()
    options.onSuccess = async () => {
      await queryClient.invalidateQueries('orders')
    }
  }
  return useMutation<Awaited<ReturnType<typeof client.orders.cancelSwap>>, unknown, void>(
    ['orders', 'cancelSwap', id,swapId,queryParams],
    () => client.orders.cancelSwap(id,swapId,queryParams),
    options
  );
};

export const useOrdersFulfillSwap = (
  id: string,
  swapId: string,
  requestBody: AdminPostOrdersOrderSwapsSwapFulfillmentsReq,
  queryParams: {
    /**
     * Comma separated list of relations to include in the result.
     */
    expand?: string,
    /**
     * Comma separated list of fields to include in the result.
     */
    fields?: string,
  },
  options: UseMutationOptionsWrapper<Awaited<ReturnType<typeof client.orders.fulfillSwap>>, unknown, AdminPostOrdersOrderSwapsSwapFulfillmentsReq> = {}
) => {
  if (!options?.onSuccess) {
    const queryClient = useQueryClient()
    options.onSuccess = async () => {
      await queryClient.invalidateQueries('orders')
    }
  }
  return useMutation<Awaited<ReturnType<typeof client.orders.fulfillSwap>>, unknown, AdminPostOrdersOrderSwapsSwapFulfillmentsReq>(
    ['orders', 'fulfillSwap', id,swapId,requestBody,queryParams],
    () => client.orders.fulfillSwap(id,swapId,requestBody,queryParams),
    options
  );
};

export const useOrdersCancelSwapFulfillment = (
  id: string,
  swapId: string,
  fulfillmentId: string,
  queryParams: {
    /**
     * Comma separated list of relations to include in the result.
     */
    expand?: string,
    /**
     * Comma separated list of fields to include in the result.
     */
    fields?: string,
  },
  options: UseMutationOptionsWrapper<Awaited<ReturnType<typeof client.orders.cancelSwapFulfillment>>, unknown, void> = {}
) => {
  if (!options?.onSuccess) {
    const queryClient = useQueryClient()
    options.onSuccess = async () => {
      await queryClient.invalidateQueries('orders')
    }
  }
  return useMutation<Awaited<ReturnType<typeof client.orders.cancelSwapFulfillment>>, unknown, void>(
    ['orders', 'cancelSwapFulfillment', id,swapId,fulfillmentId,queryParams],
    () => client.orders.cancelSwapFulfillment(id,swapId,fulfillmentId,queryParams),
    options
  );
};

export const useOrdersProcessSwapPayment = (
  id: string,
  swapId: string,
  queryParams: {
    /**
     * Comma separated list of relations to include in the result.
     */
    expand?: string,
    /**
     * Comma separated list of fields to include in the result.
     */
    fields?: string,
  },
  options: UseMutationOptionsWrapper<Awaited<ReturnType<typeof client.orders.processSwapPayment>>, unknown, void> = {}
) => {
  if (!options?.onSuccess) {
    const queryClient = useQueryClient()
    options.onSuccess = async () => {
      await queryClient.invalidateQueries('orders')
    }
  }
  return useMutation<Awaited<ReturnType<typeof client.orders.processSwapPayment>>, unknown, void>(
    ['orders', 'processSwapPayment', id,swapId,queryParams],
    () => client.orders.processSwapPayment(id,swapId,queryParams),
    options
  );
};

export const useOrdersCreateSwapShipment = (
  id: string,
  swapId: string,
  requestBody: AdminPostOrdersOrderSwapsSwapShipmentsReq,
  queryParams: {
    /**
     * Comma separated list of relations to include in the result.
     */
    expand?: string,
    /**
     * Comma separated list of fields to include in the result.
     */
    fields?: string,
  },
  options: UseMutationOptionsWrapper<Awaited<ReturnType<typeof client.orders.createSwapShipment>>, unknown, AdminPostOrdersOrderSwapsSwapShipmentsReq> = {}
) => {
  if (!options?.onSuccess) {
    const queryClient = useQueryClient()
    options.onSuccess = async () => {
      await queryClient.invalidateQueries('orders')
    }
  }
  return useMutation<Awaited<ReturnType<typeof client.orders.createSwapShipment>>, unknown, AdminPostOrdersOrderSwapsSwapShipmentsReq>(
    ['orders', 'createSwapShipment', id,swapId,requestBody,queryParams],
    () => client.orders.createSwapShipment(id,swapId,requestBody,queryParams),
    options
  );
};


