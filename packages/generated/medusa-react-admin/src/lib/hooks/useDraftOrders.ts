/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { UseQueryOptionsWrapper, UseMutationOptionsWrapper} from '../core/HookUtils';
import { useMedusaAdmin } from '../useMedusaAdmin';
import type { AdminDraftOrdersDeleteRes } from '@medusajs/client-types';
import type { AdminDraftOrdersListRes } from '@medusajs/client-types';
import type { AdminDraftOrdersRes } from '@medusajs/client-types';
import type { AdminGetDraftOrdersParams } from '@medusajs/client-types';
import type { AdminPostDraftOrdersDraftOrderLineItemsItemReq } from '@medusajs/client-types';
import type { AdminPostDraftOrdersDraftOrderLineItemsReq } from '@medusajs/client-types';
import type { AdminPostDraftOrdersDraftOrderRegisterPaymentRes } from '@medusajs/client-types';
import type { AdminPostDraftOrdersDraftOrderReq } from '@medusajs/client-types';
import type { AdminPostDraftOrdersReq } from '@medusajs/client-types';

const { client } = useMedusaAdmin()

export const useDraftOrdersList = (
  queryParams: AdminGetDraftOrdersParams,
  options: UseQueryOptionsWrapper<Awaited<ReturnType<typeof client.draftOrders.list>>> = {}
) => {
  const { data, ...rest } = useQuery<Awaited<ReturnType<typeof client.draftOrders.list>>>(
    ['draftOrders', 'list', queryParams],
    () => client.draftOrders.list(queryParams),
    options
  );
  return { ...data, ...rest } as const
};

export const useDraftOrdersCreate = (
  requestBody: AdminPostDraftOrdersReq,
  options: UseMutationOptionsWrapper<Awaited<ReturnType<typeof client.draftOrders.create>>, unknown, AdminPostDraftOrdersReq> = {}
) => {
  if (!options?.onSuccess) {
    const queryClient = useQueryClient()
    options.onSuccess = async () => {
      await queryClient.invalidateQueries('draftOrders')
    }
  }
  return useMutation<Awaited<ReturnType<typeof client.draftOrders.create>>, unknown, AdminPostDraftOrdersReq>(
    ['draftOrders', 'create', requestBody],
    () => client.draftOrders.create(requestBody),
    options
  );
};

export const useDraftOrdersRetrieve = (
  id: string,
  options: UseQueryOptionsWrapper<Awaited<ReturnType<typeof client.draftOrders.retrieve>>> = {}
) => {
  const { data, ...rest } = useQuery<Awaited<ReturnType<typeof client.draftOrders.retrieve>>>(
    ['draftOrders', 'retrieve', id],
    () => client.draftOrders.retrieve(id),
    options
  );
  return { ...data, ...rest } as const
};

export const useDraftOrdersUpdate = (
  id: string,
  requestBody: AdminPostDraftOrdersDraftOrderReq,
  options: UseMutationOptionsWrapper<Awaited<ReturnType<typeof client.draftOrders.update>>, unknown, AdminPostDraftOrdersDraftOrderReq> = {}
) => {
  if (!options?.onSuccess) {
    const queryClient = useQueryClient()
    options.onSuccess = async () => {
      await queryClient.invalidateQueries('draftOrders')
    }
  }
  return useMutation<Awaited<ReturnType<typeof client.draftOrders.update>>, unknown, AdminPostDraftOrdersDraftOrderReq>(
    ['draftOrders', 'update', id,requestBody],
    () => client.draftOrders.update(id,requestBody),
    options
  );
};

export const useDraftOrdersDelete = (
  id: string,
  options: UseMutationOptionsWrapper<Awaited<ReturnType<typeof client.draftOrders.delete>>, unknown, void> = {}
) => {
  if (!options?.onSuccess) {
    const queryClient = useQueryClient()
    options.onSuccess = async () => {
      await queryClient.invalidateQueries('draftOrders')
    }
  }
  return useMutation<Awaited<ReturnType<typeof client.draftOrders.delete>>, unknown, void>(
    ['draftOrders', 'delete', id],
    () => client.draftOrders.delete(id),
    options
  );
};

export const useDraftOrdersAddLineItem = (
  id: string,
  requestBody: AdminPostDraftOrdersDraftOrderLineItemsReq,
  options: UseMutationOptionsWrapper<Awaited<ReturnType<typeof client.draftOrders.addLineItem>>, unknown, AdminPostDraftOrdersDraftOrderLineItemsReq> = {}
) => {
  if (!options?.onSuccess) {
    const queryClient = useQueryClient()
    options.onSuccess = async () => {
      await queryClient.invalidateQueries('draftOrders')
    }
  }
  return useMutation<Awaited<ReturnType<typeof client.draftOrders.addLineItem>>, unknown, AdminPostDraftOrdersDraftOrderLineItemsReq>(
    ['draftOrders', 'addLineItem', id,requestBody],
    () => client.draftOrders.addLineItem(id,requestBody),
    options
  );
};

export const useDraftOrdersUpdateLineItem = (
  id: string,
  lineId: string,
  requestBody: AdminPostDraftOrdersDraftOrderLineItemsItemReq,
  options: UseMutationOptionsWrapper<Awaited<ReturnType<typeof client.draftOrders.updateLineItem>>, unknown, AdminPostDraftOrdersDraftOrderLineItemsItemReq> = {}
) => {
  if (!options?.onSuccess) {
    const queryClient = useQueryClient()
    options.onSuccess = async () => {
      await queryClient.invalidateQueries('draftOrders')
    }
  }
  return useMutation<Awaited<ReturnType<typeof client.draftOrders.updateLineItem>>, unknown, AdminPostDraftOrdersDraftOrderLineItemsItemReq>(
    ['draftOrders', 'updateLineItem', id,lineId,requestBody],
    () => client.draftOrders.updateLineItem(id,lineId,requestBody),
    options
  );
};

export const useDraftOrdersRemoveLineItem = (
  id: string,
  lineId: string,
  options: UseMutationOptionsWrapper<Awaited<ReturnType<typeof client.draftOrders.removeLineItem>>, unknown, void> = {}
) => {
  if (!options?.onSuccess) {
    const queryClient = useQueryClient()
    options.onSuccess = async () => {
      await queryClient.invalidateQueries('draftOrders')
    }
  }
  return useMutation<Awaited<ReturnType<typeof client.draftOrders.removeLineItem>>, unknown, void>(
    ['draftOrders', 'removeLineItem', id,lineId],
    () => client.draftOrders.removeLineItem(id,lineId),
    options
  );
};

export const useDraftOrdersMarkPaid = (
  id: string,
  options: UseMutationOptionsWrapper<Awaited<ReturnType<typeof client.draftOrders.markPaid>>, unknown, void> = {}
) => {
  if (!options?.onSuccess) {
    const queryClient = useQueryClient()
    options.onSuccess = async () => {
      await queryClient.invalidateQueries('draftOrders')
    }
  }
  return useMutation<Awaited<ReturnType<typeof client.draftOrders.markPaid>>, unknown, void>(
    ['draftOrders', 'markPaid', id],
    () => client.draftOrders.markPaid(id),
    options
  );
};


