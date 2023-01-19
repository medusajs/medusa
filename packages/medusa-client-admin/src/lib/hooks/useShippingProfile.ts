/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { UseQueryOptionsWrapper, UseMutationOptionsWrapper} from '../core/HookUtils';
import { useMedusaAdmin } from '../useMedusaAdmin';
import type { AdminDeleteShippingProfileRes } from '../models/AdminDeleteShippingProfileRes';
import type { AdminPostShippingProfilesProfileReq } from '../models/AdminPostShippingProfilesProfileReq';
import type { AdminPostShippingProfilesReq } from '../models/AdminPostShippingProfilesReq';
import type { AdminShippingProfilesListRes } from '../models/AdminShippingProfilesListRes';
import type { AdminShippingProfilesRes } from '../models/AdminShippingProfilesRes';

const { client } = useMedusaAdmin()

export const useShippingProfileList = (
  options: UseQueryOptionsWrapper<Awaited<ReturnType<typeof client.shippingProfile.list>>> = {}
) => {
  const { data, ...rest } = useQuery<Awaited<ReturnType<typeof client.shippingProfile.list>>>(
    ['shippingProfile', 'list'],
    () => client.shippingProfile.list(),
    options
  );
  return { ...data, ...rest } as const
};

export const useShippingProfileCreate = (
  requestBody: AdminPostShippingProfilesReq,
  options: UseMutationOptionsWrapper<Awaited<ReturnType<typeof client.shippingProfile.create>>, unknown, AdminPostShippingProfilesReq> = {}
) => {
  if (!options?.onSuccess) {
    const queryClient = useQueryClient()
    options.onSuccess = async () => {
      await queryClient.invalidateQueries('shippingProfile')
    }
  }
  return useMutation<Awaited<ReturnType<typeof client.shippingProfile.create>>, unknown, AdminPostShippingProfilesReq>(
    ['shippingProfile', 'create', requestBody],
    () => client.shippingProfile.create(requestBody),
    options
  );
};

export const useShippingProfileRetrieve = (
  id: string,
  options: UseQueryOptionsWrapper<Awaited<ReturnType<typeof client.shippingProfile.retrieve>>> = {}
) => {
  const { data, ...rest } = useQuery<Awaited<ReturnType<typeof client.shippingProfile.retrieve>>>(
    ['shippingProfile', 'retrieve', id],
    () => client.shippingProfile.retrieve(id),
    options
  );
  return { ...data, ...rest } as const
};

export const useShippingProfileUpdate = (
  id: string,
  requestBody: AdminPostShippingProfilesProfileReq,
  options: UseMutationOptionsWrapper<Awaited<ReturnType<typeof client.shippingProfile.update>>, unknown, AdminPostShippingProfilesProfileReq> = {}
) => {
  if (!options?.onSuccess) {
    const queryClient = useQueryClient()
    options.onSuccess = async () => {
      await queryClient.invalidateQueries('shippingProfile')
    }
  }
  return useMutation<Awaited<ReturnType<typeof client.shippingProfile.update>>, unknown, AdminPostShippingProfilesProfileReq>(
    ['shippingProfile', 'update', id,requestBody],
    () => client.shippingProfile.update(id,requestBody),
    options
  );
};

export const useShippingProfileDelete = (
  id: string,
  options: UseMutationOptionsWrapper<Awaited<ReturnType<typeof client.shippingProfile.delete>>, unknown, void> = {}
) => {
  if (!options?.onSuccess) {
    const queryClient = useQueryClient()
    options.onSuccess = async () => {
      await queryClient.invalidateQueries('shippingProfile')
    }
  }
  return useMutation<Awaited<ReturnType<typeof client.shippingProfile.delete>>, unknown, void>(
    ['shippingProfile', 'delete', id],
    () => client.shippingProfile.delete(id),
    options
  );
};


