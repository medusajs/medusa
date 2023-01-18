/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { UseQueryOptionsWrapper, UseMutationOptionsWrapper} from '../core/HookUtils';
import { useMedusaAdmin } from '../useMedusaAdmin';
import type { AdminGetShippingOptionsParams } from '../models/AdminGetShippingOptionsParams';
import type { AdminPostShippingOptionsOptionReq } from '../models/AdminPostShippingOptionsOptionReq';
import type { AdminPostShippingOptionsReq } from '../models/AdminPostShippingOptionsReq';
import type { AdminShippingOptionsDeleteRes } from '../models/AdminShippingOptionsDeleteRes';
import type { AdminShippingOptionsListRes } from '../models/AdminShippingOptionsListRes';
import type { AdminShippingOptionsRes } from '../models/AdminShippingOptionsRes';

export const useShippingOptionList = (
  queryParams: AdminGetShippingOptionsParams,
  options: UseQueryOptionsWrapper<Awaited<ReturnType<typeof client.shippingOption.list>>> = {}
) => {
  const { client } = useMedusaAdmin()
  const { data, ...rest } = useQuery<Awaited<ReturnType<typeof client.shippingOption.list>>>(
    ['shippingOption', 'list', queryParams],
    () => client.shippingOption.list(queryParams),
    options
  );
  return { ...data, ...rest } as const
};

export const useShippingOptionCreate = (
  requestBody: AdminPostShippingOptionsReq,
  options: UseMutationOptionsWrapper<Awaited<ReturnType<typeof client.shippingOption.create>>, unknown, AdminPostShippingOptionsReq> = {}
) => {
  const { client } = useMedusaAdmin()
  if (!options?.onSuccess) {
    const queryClient = useQueryClient()
    options.onSuccess = async () => {
      await queryClient.invalidateQueries('shippingOption')
    }
  }
  return useMutation<Awaited<ReturnType<typeof client.shippingOption.create>>, unknown, AdminPostShippingOptionsReq>(
    ['shippingOption', 'create', requestBody],
    () => client.shippingOption.create(requestBody),
    options
  );
};

export const useShippingOptionRetrieve = (
  id: string,
  options: UseQueryOptionsWrapper<Awaited<ReturnType<typeof client.shippingOption.retrieve>>> = {}
) => {
  const { client } = useMedusaAdmin()
  const { data, ...rest } = useQuery<Awaited<ReturnType<typeof client.shippingOption.retrieve>>>(
    ['shippingOption', 'retrieve', id],
    () => client.shippingOption.retrieve(id),
    options
  );
  return { ...data, ...rest } as const
};

export const useShippingOptionUpdate = (
  id: string,
  requestBody: AdminPostShippingOptionsOptionReq,
  options: UseMutationOptionsWrapper<Awaited<ReturnType<typeof client.shippingOption.update>>, unknown, AdminPostShippingOptionsOptionReq> = {}
) => {
  const { client } = useMedusaAdmin()
  if (!options?.onSuccess) {
    const queryClient = useQueryClient()
    options.onSuccess = async () => {
      await queryClient.invalidateQueries('shippingOption')
    }
  }
  return useMutation<Awaited<ReturnType<typeof client.shippingOption.update>>, unknown, AdminPostShippingOptionsOptionReq>(
    ['shippingOption', 'update', id,requestBody],
    () => client.shippingOption.update(id,requestBody),
    options
  );
};

export const useShippingOptionDelete = (
  id: string,
  options: UseMutationOptionsWrapper<Awaited<ReturnType<typeof client.shippingOption.delete>>, unknown, void> = {}
) => {
  const { client } = useMedusaAdmin()
  if (!options?.onSuccess) {
    const queryClient = useQueryClient()
    options.onSuccess = async () => {
      await queryClient.invalidateQueries('shippingOption')
    }
  }
  return useMutation<Awaited<ReturnType<typeof client.shippingOption.delete>>, unknown, void>(
    ['shippingOption', 'delete', id],
    () => client.shippingOption.delete(id),
    options
  );
};


