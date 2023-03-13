/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { UseQueryOptionsWrapper, UseMutationOptionsWrapper} from '../core/HookUtils';
import { useMedusaAdmin } from '../useMedusaAdmin';
import type { AdminOrderEditDeleteRes } from '@medusajs/client-types';
import type { AdminOrderEditItemChangeDeleteRes } from '@medusajs/client-types';
import type { AdminOrderEditsListRes } from '@medusajs/client-types';
import type { AdminOrderEditsRes } from '@medusajs/client-types';
import type { AdminPostOrderEditsEditLineItemsLineItemReq } from '@medusajs/client-types';
import type { AdminPostOrderEditsEditLineItemsReq } from '@medusajs/client-types';
import type { AdminPostOrderEditsOrderEditReq } from '@medusajs/client-types';
import type { AdminPostOrderEditsReq } from '@medusajs/client-types';
import type { GetOrderEditsOrderEditParams } from '@medusajs/client-types';
import type { GetOrderEditsParams } from '@medusajs/client-types';

const { client } = useMedusaAdmin()

export const useOrderEditsList = (
  queryParams: GetOrderEditsParams,
  options: UseQueryOptionsWrapper<Awaited<ReturnType<typeof client.orderEdits.list>>> = {}
) => {
  const { data, ...rest } = useQuery<Awaited<ReturnType<typeof client.orderEdits.list>>>(
    ['orderEdits', 'list', queryParams],
    () => client.orderEdits.list(queryParams),
    options
  );
  return { ...data, ...rest } as const
};

export const useOrderEditsCreate = (
  requestBody: AdminPostOrderEditsReq,
  options: UseMutationOptionsWrapper<Awaited<ReturnType<typeof client.orderEdits.create>>, unknown, AdminPostOrderEditsReq> = {}
) => {
  if (!options?.onSuccess) {
    const queryClient = useQueryClient()
    options.onSuccess = async () => {
      await queryClient.invalidateQueries('orderEdits')
    }
  }
  return useMutation<Awaited<ReturnType<typeof client.orderEdits.create>>, unknown, AdminPostOrderEditsReq>(
    ['orderEdits', 'create', requestBody],
    () => client.orderEdits.create(requestBody),
    options
  );
};

export const useOrderEditsRetrieve = (
  id: string,
  queryParams: GetOrderEditsOrderEditParams,
  options: UseQueryOptionsWrapper<Awaited<ReturnType<typeof client.orderEdits.retrieve>>> = {}
) => {
  const { data, ...rest } = useQuery<Awaited<ReturnType<typeof client.orderEdits.retrieve>>>(
    ['orderEdits', 'retrieve', id,queryParams],
    () => client.orderEdits.retrieve(id,queryParams),
    options
  );
  return { ...data, ...rest } as const
};

export const useOrderEditsUpdate = (
  id: string,
  requestBody: AdminPostOrderEditsOrderEditReq,
  options: UseMutationOptionsWrapper<Awaited<ReturnType<typeof client.orderEdits.update>>, unknown, AdminPostOrderEditsOrderEditReq> = {}
) => {
  if (!options?.onSuccess) {
    const queryClient = useQueryClient()
    options.onSuccess = async () => {
      await queryClient.invalidateQueries('orderEdits')
    }
  }
  return useMutation<Awaited<ReturnType<typeof client.orderEdits.update>>, unknown, AdminPostOrderEditsOrderEditReq>(
    ['orderEdits', 'update', id,requestBody],
    () => client.orderEdits.update(id,requestBody),
    options
  );
};

export const useOrderEditsDelete = (
  id: string,
  options: UseMutationOptionsWrapper<Awaited<ReturnType<typeof client.orderEdits.delete>>, unknown, void> = {}
) => {
  if (!options?.onSuccess) {
    const queryClient = useQueryClient()
    options.onSuccess = async () => {
      await queryClient.invalidateQueries('orderEdits')
    }
  }
  return useMutation<Awaited<ReturnType<typeof client.orderEdits.delete>>, unknown, void>(
    ['orderEdits', 'delete', id],
    () => client.orderEdits.delete(id),
    options
  );
};

export const useOrderEditsCancel = (
  id: string,
  options: UseMutationOptionsWrapper<Awaited<ReturnType<typeof client.orderEdits.cancel>>, unknown, void> = {}
) => {
  if (!options?.onSuccess) {
    const queryClient = useQueryClient()
    options.onSuccess = async () => {
      await queryClient.invalidateQueries('orderEdits')
    }
  }
  return useMutation<Awaited<ReturnType<typeof client.orderEdits.cancel>>, unknown, void>(
    ['orderEdits', 'cancel', id],
    () => client.orderEdits.cancel(id),
    options
  );
};

export const useOrderEditsDeleteItemChange = (
  id: string,
  changeId: string,
  options: UseMutationOptionsWrapper<Awaited<ReturnType<typeof client.orderEdits.deleteItemChange>>, unknown, void> = {}
) => {
  if (!options?.onSuccess) {
    const queryClient = useQueryClient()
    options.onSuccess = async () => {
      await queryClient.invalidateQueries('orderEdits')
    }
  }
  return useMutation<Awaited<ReturnType<typeof client.orderEdits.deleteItemChange>>, unknown, void>(
    ['orderEdits', 'deleteItemChange', id,changeId],
    () => client.orderEdits.deleteItemChange(id,changeId),
    options
  );
};

export const useOrderEditsConfirm = (
  id: string,
  options: UseMutationOptionsWrapper<Awaited<ReturnType<typeof client.orderEdits.confirm>>, unknown, void> = {}
) => {
  if (!options?.onSuccess) {
    const queryClient = useQueryClient()
    options.onSuccess = async () => {
      await queryClient.invalidateQueries('orderEdits')
    }
  }
  return useMutation<Awaited<ReturnType<typeof client.orderEdits.confirm>>, unknown, void>(
    ['orderEdits', 'confirm', id],
    () => client.orderEdits.confirm(id),
    options
  );
};

export const useOrderEditsAddLineItem = (
  id: string,
  requestBody: AdminPostOrderEditsEditLineItemsReq,
  options: UseMutationOptionsWrapper<Awaited<ReturnType<typeof client.orderEdits.addLineItem>>, unknown, AdminPostOrderEditsEditLineItemsReq> = {}
) => {
  if (!options?.onSuccess) {
    const queryClient = useQueryClient()
    options.onSuccess = async () => {
      await queryClient.invalidateQueries('orderEdits')
    }
  }
  return useMutation<Awaited<ReturnType<typeof client.orderEdits.addLineItem>>, unknown, AdminPostOrderEditsEditLineItemsReq>(
    ['orderEdits', 'addLineItem', id,requestBody],
    () => client.orderEdits.addLineItem(id,requestBody),
    options
  );
};

export const useOrderEditsUpdateLineItem = (
  id: string,
  itemId: string,
  requestBody: AdminPostOrderEditsEditLineItemsLineItemReq,
  options: UseMutationOptionsWrapper<Awaited<ReturnType<typeof client.orderEdits.updateLineItem>>, unknown, AdminPostOrderEditsEditLineItemsLineItemReq> = {}
) => {
  if (!options?.onSuccess) {
    const queryClient = useQueryClient()
    options.onSuccess = async () => {
      await queryClient.invalidateQueries('orderEdits')
    }
  }
  return useMutation<Awaited<ReturnType<typeof client.orderEdits.updateLineItem>>, unknown, AdminPostOrderEditsEditLineItemsLineItemReq>(
    ['orderEdits', 'updateLineItem', id,itemId,requestBody],
    () => client.orderEdits.updateLineItem(id,itemId,requestBody),
    options
  );
};

export const useOrderEditsRemoveLineItem = (
  id: string,
  itemId: string,
  options: UseMutationOptionsWrapper<Awaited<ReturnType<typeof client.orderEdits.removeLineItem>>, unknown, void> = {}
) => {
  if (!options?.onSuccess) {
    const queryClient = useQueryClient()
    options.onSuccess = async () => {
      await queryClient.invalidateQueries('orderEdits')
    }
  }
  return useMutation<Awaited<ReturnType<typeof client.orderEdits.removeLineItem>>, unknown, void>(
    ['orderEdits', 'removeLineItem', id,itemId],
    () => client.orderEdits.removeLineItem(id,itemId),
    options
  );
};

export const useOrderEditsRequestConfirmation = (
  id: string,
  options: UseMutationOptionsWrapper<Awaited<ReturnType<typeof client.orderEdits.requestConfirmation>>, unknown, void> = {}
) => {
  if (!options?.onSuccess) {
    const queryClient = useQueryClient()
    options.onSuccess = async () => {
      await queryClient.invalidateQueries('orderEdits')
    }
  }
  return useMutation<Awaited<ReturnType<typeof client.orderEdits.requestConfirmation>>, unknown, void>(
    ['orderEdits', 'requestConfirmation', id],
    () => client.orderEdits.requestConfirmation(id),
    options
  );
};


