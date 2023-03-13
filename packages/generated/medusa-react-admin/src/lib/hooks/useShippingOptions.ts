/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { UseQueryOptionsWrapper, UseMutationOptionsWrapper} from '../core/HookUtils';
import { useMedusaAdmin } from '../useMedusaAdmin';
import type { AdminGetShippingOptionsParams } from '@medusajs/client-types';
import type { AdminPostShippingOptionsOptionReq } from '@medusajs/client-types';
import type { AdminPostShippingOptionsReq } from '@medusajs/client-types';
import type { AdminShippingOptionsDeleteRes } from '@medusajs/client-types';
import type { AdminShippingOptionsListRes } from '@medusajs/client-types';
import type { AdminShippingOptionsRes } from '@medusajs/client-types';

const { client } = useMedusaAdmin()

export const useShippingOptionsList = (
  queryParams: AdminGetShippingOptionsParams,
  options: UseQueryOptionsWrapper<Awaited<ReturnType<typeof client.shippingOptions.list>>> = {}
) => {
  const { data, ...rest } = useQuery<Awaited<ReturnType<typeof client.shippingOptions.list>>>(
    ['shippingOptions', 'list', queryParams],
    () => client.shippingOptions.list(queryParams),
    options
  );
  return { ...data, ...rest } as const
};

export const useShippingOptionsCreate = (
  requestBody: AdminPostShippingOptionsReq,
  options: UseMutationOptionsWrapper<Awaited<ReturnType<typeof client.shippingOptions.create>>, unknown, AdminPostShippingOptionsReq> = {}
) => {
  if (!options?.onSuccess) {
    const queryClient = useQueryClient()
    options.onSuccess = async () => {
      await queryClient.invalidateQueries('shippingOptions')
    }
  }
  return useMutation<Awaited<ReturnType<typeof client.shippingOptions.create>>, unknown, AdminPostShippingOptionsReq>(
    ['shippingOptions', 'create', requestBody],
    () => client.shippingOptions.create(requestBody),
    options
  );
};

export const useShippingOptionsRetrieve = (
  id: string,
  options: UseQueryOptionsWrapper<Awaited<ReturnType<typeof client.shippingOptions.retrieve>>> = {}
) => {
  const { data, ...rest } = useQuery<Awaited<ReturnType<typeof client.shippingOptions.retrieve>>>(
    ['shippingOptions', 'retrieve', id],
    () => client.shippingOptions.retrieve(id),
    options
  );
  return { ...data, ...rest } as const
};

export const useShippingOptionsUpdate = (
  id: string,
  requestBody: AdminPostShippingOptionsOptionReq,
  options: UseMutationOptionsWrapper<Awaited<ReturnType<typeof client.shippingOptions.update>>, unknown, AdminPostShippingOptionsOptionReq> = {}
) => {
  if (!options?.onSuccess) {
    const queryClient = useQueryClient()
    options.onSuccess = async () => {
      await queryClient.invalidateQueries('shippingOptions')
    }
  }
  return useMutation<Awaited<ReturnType<typeof client.shippingOptions.update>>, unknown, AdminPostShippingOptionsOptionReq>(
    ['shippingOptions', 'update', id,requestBody],
    () => client.shippingOptions.update(id,requestBody),
    options
  );
};

export const useShippingOptionsDelete = (
  id: string,
  options: UseMutationOptionsWrapper<Awaited<ReturnType<typeof client.shippingOptions.delete>>, unknown, void> = {}
) => {
  if (!options?.onSuccess) {
    const queryClient = useQueryClient()
    options.onSuccess = async () => {
      await queryClient.invalidateQueries('shippingOptions')
    }
  }
  return useMutation<Awaited<ReturnType<typeof client.shippingOptions.delete>>, unknown, void>(
    ['shippingOptions', 'delete', id],
    () => client.shippingOptions.delete(id),
    options
  );
};


