/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { UseQueryOptionsWrapper, UseMutationOptionsWrapper} from '../core/HookUtils';
import { useMedusaAdmin } from '../useMedusaAdmin';
import type { AdminOrderEditDeleteRes } from '../models/AdminOrderEditDeleteRes';
import type { AdminOrderEditItemChangeDeleteRes } from '../models/AdminOrderEditItemChangeDeleteRes';
import type { AdminOrderEditsListRes } from '../models/AdminOrderEditsListRes';
import type { AdminOrderEditsRes } from '../models/AdminOrderEditsRes';
import type { AdminPostOrderEditsEditLineItemsLineItemReq } from '../models/AdminPostOrderEditsEditLineItemsLineItemReq';
import type { AdminPostOrderEditsEditLineItemsReq } from '../models/AdminPostOrderEditsEditLineItemsReq';
import type { AdminPostOrderEditsOrderEditReq } from '../models/AdminPostOrderEditsOrderEditReq';
import type { AdminPostOrderEditsReq } from '../models/AdminPostOrderEditsReq';
import type { GetOrderEditsOrderEditParams } from '../models/GetOrderEditsOrderEditParams';
import type { GetOrderEditsParams } from '../models/GetOrderEditsParams';

const { client } = useMedusaAdmin()

export const useOrderEditList = (
  queryParams: GetOrderEditsParams,
  options: UseQueryOptionsWrapper<Awaited<ReturnType<typeof client.orderEdit.list>>> = {}
) => {
  const { data, ...rest } = useQuery<Awaited<ReturnType<typeof client.orderEdit.list>>>(
    ['orderEdit', 'list', queryParams],
    () => client.orderEdit.list(queryParams),
    options
  );
  return { ...data, ...rest } as const
};

export const useOrderEditCreate = (
  requestBody: AdminPostOrderEditsReq,
  options: UseMutationOptionsWrapper<Awaited<ReturnType<typeof client.orderEdit.create>>, unknown, AdminPostOrderEditsReq> = {}
) => {
  if (!options?.onSuccess) {
    const queryClient = useQueryClient()
    options.onSuccess = async () => {
      await queryClient.invalidateQueries('orderEdit')
    }
  }
  return useMutation<Awaited<ReturnType<typeof client.orderEdit.create>>, unknown, AdminPostOrderEditsReq>(
    ['orderEdit', 'create', requestBody],
    () => client.orderEdit.create(requestBody),
    options
  );
};

export const useOrderEditRetrieve = (
  id: string,
  queryParams: GetOrderEditsOrderEditParams,
  options: UseQueryOptionsWrapper<Awaited<ReturnType<typeof client.orderEdit.retrieve>>> = {}
) => {
  const { data, ...rest } = useQuery<Awaited<ReturnType<typeof client.orderEdit.retrieve>>>(
    ['orderEdit', 'retrieve', id,queryParams],
    () => client.orderEdit.retrieve(id,queryParams),
    options
  );
  return { ...data, ...rest } as const
};

export const useOrderEditUpdate = (
  id: string,
  requestBody: AdminPostOrderEditsOrderEditReq,
  options: UseMutationOptionsWrapper<Awaited<ReturnType<typeof client.orderEdit.update>>, unknown, AdminPostOrderEditsOrderEditReq> = {}
) => {
  if (!options?.onSuccess) {
    const queryClient = useQueryClient()
    options.onSuccess = async () => {
      await queryClient.invalidateQueries('orderEdit')
    }
  }
  return useMutation<Awaited<ReturnType<typeof client.orderEdit.update>>, unknown, AdminPostOrderEditsOrderEditReq>(
    ['orderEdit', 'update', id,requestBody],
    () => client.orderEdit.update(id,requestBody),
    options
  );
};

export const useOrderEditDelete = (
  id: string,
  options: UseMutationOptionsWrapper<Awaited<ReturnType<typeof client.orderEdit.delete>>, unknown, void> = {}
) => {
  if (!options?.onSuccess) {
    const queryClient = useQueryClient()
    options.onSuccess = async () => {
      await queryClient.invalidateQueries('orderEdit')
    }
  }
  return useMutation<Awaited<ReturnType<typeof client.orderEdit.delete>>, unknown, void>(
    ['orderEdit', 'delete', id],
    () => client.orderEdit.delete(id),
    options
  );
};

export const useOrderEditCancel = (
  id: string,
  options: UseMutationOptionsWrapper<Awaited<ReturnType<typeof client.orderEdit.cancel>>, unknown, void> = {}
) => {
  if (!options?.onSuccess) {
    const queryClient = useQueryClient()
    options.onSuccess = async () => {
      await queryClient.invalidateQueries('orderEdit')
    }
  }
  return useMutation<Awaited<ReturnType<typeof client.orderEdit.cancel>>, unknown, void>(
    ['orderEdit', 'cancel', id],
    () => client.orderEdit.cancel(id),
    options
  );
};

export const useOrderEditDeleteItemChange = (
  id: string,
  changeId: string,
  options: UseMutationOptionsWrapper<Awaited<ReturnType<typeof client.orderEdit.deleteItemChange>>, unknown, void> = {}
) => {
  if (!options?.onSuccess) {
    const queryClient = useQueryClient()
    options.onSuccess = async () => {
      await queryClient.invalidateQueries('orderEdit')
    }
  }
  return useMutation<Awaited<ReturnType<typeof client.orderEdit.deleteItemChange>>, unknown, void>(
    ['orderEdit', 'deleteItemChange', id,changeId],
    () => client.orderEdit.deleteItemChange(id,changeId),
    options
  );
};

export const useOrderEditConfirm = (
  id: string,
  options: UseMutationOptionsWrapper<Awaited<ReturnType<typeof client.orderEdit.confirm>>, unknown, void> = {}
) => {
  if (!options?.onSuccess) {
    const queryClient = useQueryClient()
    options.onSuccess = async () => {
      await queryClient.invalidateQueries('orderEdit')
    }
  }
  return useMutation<Awaited<ReturnType<typeof client.orderEdit.confirm>>, unknown, void>(
    ['orderEdit', 'confirm', id],
    () => client.orderEdit.confirm(id),
    options
  );
};

export const useOrderEditAddLineItem = (
  id: string,
  requestBody: AdminPostOrderEditsEditLineItemsReq,
  options: UseMutationOptionsWrapper<Awaited<ReturnType<typeof client.orderEdit.addLineItem>>, unknown, AdminPostOrderEditsEditLineItemsReq> = {}
) => {
  if (!options?.onSuccess) {
    const queryClient = useQueryClient()
    options.onSuccess = async () => {
      await queryClient.invalidateQueries('orderEdit')
    }
  }
  return useMutation<Awaited<ReturnType<typeof client.orderEdit.addLineItem>>, unknown, AdminPostOrderEditsEditLineItemsReq>(
    ['orderEdit', 'addLineItem', id,requestBody],
    () => client.orderEdit.addLineItem(id,requestBody),
    options
  );
};

export const useOrderEditUpdateLineItem = (
  id: string,
  itemId: string,
  requestBody: AdminPostOrderEditsEditLineItemsLineItemReq,
  options: UseMutationOptionsWrapper<Awaited<ReturnType<typeof client.orderEdit.updateLineItem>>, unknown, AdminPostOrderEditsEditLineItemsLineItemReq> = {}
) => {
  if (!options?.onSuccess) {
    const queryClient = useQueryClient()
    options.onSuccess = async () => {
      await queryClient.invalidateQueries('orderEdit')
    }
  }
  return useMutation<Awaited<ReturnType<typeof client.orderEdit.updateLineItem>>, unknown, AdminPostOrderEditsEditLineItemsLineItemReq>(
    ['orderEdit', 'updateLineItem', id,itemId,requestBody],
    () => client.orderEdit.updateLineItem(id,itemId,requestBody),
    options
  );
};

export const useOrderEditRemoveLineItem = (
  id: string,
  itemId: string,
  options: UseMutationOptionsWrapper<Awaited<ReturnType<typeof client.orderEdit.removeLineItem>>, unknown, void> = {}
) => {
  if (!options?.onSuccess) {
    const queryClient = useQueryClient()
    options.onSuccess = async () => {
      await queryClient.invalidateQueries('orderEdit')
    }
  }
  return useMutation<Awaited<ReturnType<typeof client.orderEdit.removeLineItem>>, unknown, void>(
    ['orderEdit', 'removeLineItem', id,itemId],
    () => client.orderEdit.removeLineItem(id,itemId),
    options
  );
};

export const useOrderEditRequestConfirmation = (
  id: string,
  options: UseMutationOptionsWrapper<Awaited<ReturnType<typeof client.orderEdit.requestConfirmation>>, unknown, void> = {}
) => {
  if (!options?.onSuccess) {
    const queryClient = useQueryClient()
    options.onSuccess = async () => {
      await queryClient.invalidateQueries('orderEdit')
    }
  }
  return useMutation<Awaited<ReturnType<typeof client.orderEdit.requestConfirmation>>, unknown, void>(
    ['orderEdit', 'requestConfirmation', id],
    () => client.orderEdit.requestConfirmation(id),
    options
  );
};


