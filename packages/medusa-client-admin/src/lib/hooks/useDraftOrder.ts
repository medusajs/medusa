/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { UseQueryOptionsWrapper, UseMutationOptionsWrapper} from '../core/HookUtils';
import { useMedusaAdmin } from '../useMedusaAdmin';
import type { AdminDraftOrdersDeleteRes } from '../models/AdminDraftOrdersDeleteRes';
import type { AdminDraftOrdersListRes } from '../models/AdminDraftOrdersListRes';
import type { AdminDraftOrdersRes } from '../models/AdminDraftOrdersRes';
import type { AdminGetDraftOrdersParams } from '../models/AdminGetDraftOrdersParams';
import type { AdminPostDraftOrdersDraftOrderLineItemsItemReq } from '../models/AdminPostDraftOrdersDraftOrderLineItemsItemReq';
import type { AdminPostDraftOrdersDraftOrderLineItemsReq } from '../models/AdminPostDraftOrdersDraftOrderLineItemsReq';
import type { AdminPostDraftOrdersDraftOrderRegisterPaymentRes } from '../models/AdminPostDraftOrdersDraftOrderRegisterPaymentRes';
import type { AdminPostDraftOrdersDraftOrderReq } from '../models/AdminPostDraftOrdersDraftOrderReq';
import type { AdminPostDraftOrdersReq } from '../models/AdminPostDraftOrdersReq';

const { client } = useMedusaAdmin()

export const useDraftOrderUpdate = (
  id: string,
  requestBody: AdminPostDraftOrdersDraftOrderReq,
  options: UseMutationOptionsWrapper<Awaited<ReturnType<typeof client.draftOrder.update>>, unknown, AdminPostDraftOrdersDraftOrderReq> = {}
) => {
  if (!options?.onSuccess) {
    const queryClient = useQueryClient()
    options.onSuccess = async () => {
      await queryClient.invalidateQueries('draftOrder')
    }
  }
  return useMutation<Awaited<ReturnType<typeof client.draftOrder.update>>, unknown, AdminPostDraftOrdersDraftOrderReq>(
    ['draftOrder', 'update', id,requestBody],
    () => client.draftOrder.update(id,requestBody),
    options
  );
};

export const useDraftOrderList = (
  queryParams: AdminGetDraftOrdersParams,
  options: UseQueryOptionsWrapper<Awaited<ReturnType<typeof client.draftOrder.list>>> = {}
) => {
  const { data, ...rest } = useQuery<Awaited<ReturnType<typeof client.draftOrder.list>>>(
    ['draftOrder', 'list', queryParams],
    () => client.draftOrder.list(queryParams),
    options
  );
  return { ...data, ...rest } as const
};

export const useDraftOrderCreate = (
  requestBody: AdminPostDraftOrdersReq,
  options: UseMutationOptionsWrapper<Awaited<ReturnType<typeof client.draftOrder.create>>, unknown, AdminPostDraftOrdersReq> = {}
) => {
  if (!options?.onSuccess) {
    const queryClient = useQueryClient()
    options.onSuccess = async () => {
      await queryClient.invalidateQueries('draftOrder')
    }
  }
  return useMutation<Awaited<ReturnType<typeof client.draftOrder.create>>, unknown, AdminPostDraftOrdersReq>(
    ['draftOrder', 'create', requestBody],
    () => client.draftOrder.create(requestBody),
    options
  );
};

export const useDraftOrderRetrieve = (
  id: string,
  options: UseQueryOptionsWrapper<Awaited<ReturnType<typeof client.draftOrder.retrieve>>> = {}
) => {
  const { data, ...rest } = useQuery<Awaited<ReturnType<typeof client.draftOrder.retrieve>>>(
    ['draftOrder', 'retrieve', id],
    () => client.draftOrder.retrieve(id),
    options
  );
  return { ...data, ...rest } as const
};

export const useDraftOrderDelete = (
  id: string,
  options: UseMutationOptionsWrapper<Awaited<ReturnType<typeof client.draftOrder.delete>>, unknown, void> = {}
) => {
  if (!options?.onSuccess) {
    const queryClient = useQueryClient()
    options.onSuccess = async () => {
      await queryClient.invalidateQueries('draftOrder')
    }
  }
  return useMutation<Awaited<ReturnType<typeof client.draftOrder.delete>>, unknown, void>(
    ['draftOrder', 'delete', id],
    () => client.draftOrder.delete(id),
    options
  );
};

export const useDraftOrderAddLineItem = (
  id: string,
  requestBody: AdminPostDraftOrdersDraftOrderLineItemsReq,
  options: UseMutationOptionsWrapper<Awaited<ReturnType<typeof client.draftOrder.addLineItem>>, unknown, AdminPostDraftOrdersDraftOrderLineItemsReq> = {}
) => {
  if (!options?.onSuccess) {
    const queryClient = useQueryClient()
    options.onSuccess = async () => {
      await queryClient.invalidateQueries('draftOrder')
    }
  }
  return useMutation<Awaited<ReturnType<typeof client.draftOrder.addLineItem>>, unknown, AdminPostDraftOrdersDraftOrderLineItemsReq>(
    ['draftOrder', 'addLineItem', id,requestBody],
    () => client.draftOrder.addLineItem(id,requestBody),
    options
  );
};

export const useDraftOrderUpdateLineItem = (
  id: string,
  lineId: string,
  requestBody: AdminPostDraftOrdersDraftOrderLineItemsItemReq,
  options: UseMutationOptionsWrapper<Awaited<ReturnType<typeof client.draftOrder.updateLineItem>>, unknown, AdminPostDraftOrdersDraftOrderLineItemsItemReq> = {}
) => {
  if (!options?.onSuccess) {
    const queryClient = useQueryClient()
    options.onSuccess = async () => {
      await queryClient.invalidateQueries('draftOrder')
    }
  }
  return useMutation<Awaited<ReturnType<typeof client.draftOrder.updateLineItem>>, unknown, AdminPostDraftOrdersDraftOrderLineItemsItemReq>(
    ['draftOrder', 'updateLineItem', id,lineId,requestBody],
    () => client.draftOrder.updateLineItem(id,lineId,requestBody),
    options
  );
};

export const useDraftOrderRemoveLineItem = (
  id: string,
  lineId: string,
  options: UseMutationOptionsWrapper<Awaited<ReturnType<typeof client.draftOrder.removeLineItem>>, unknown, void> = {}
) => {
  if (!options?.onSuccess) {
    const queryClient = useQueryClient()
    options.onSuccess = async () => {
      await queryClient.invalidateQueries('draftOrder')
    }
  }
  return useMutation<Awaited<ReturnType<typeof client.draftOrder.removeLineItem>>, unknown, void>(
    ['draftOrder', 'removeLineItem', id,lineId],
    () => client.draftOrder.removeLineItem(id,lineId),
    options
  );
};

export const useDraftOrderMarkPaid = (
  id: string,
  options: UseMutationOptionsWrapper<Awaited<ReturnType<typeof client.draftOrder.markPaid>>, unknown, void> = {}
) => {
  if (!options?.onSuccess) {
    const queryClient = useQueryClient()
    options.onSuccess = async () => {
      await queryClient.invalidateQueries('draftOrder')
    }
  }
  return useMutation<Awaited<ReturnType<typeof client.draftOrder.markPaid>>, unknown, void>(
    ['draftOrder', 'markPaid', id],
    () => client.draftOrder.markPaid(id),
    options
  );
};


