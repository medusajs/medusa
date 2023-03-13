/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { UseQueryOptionsWrapper, UseMutationOptionsWrapper} from '../core/HookUtils';
import { useMedusaAdmin } from '../useMedusaAdmin';
import type { AdminDeleteShippingProfileRes } from '@medusajs/client-types';
import type { AdminPostShippingProfilesProfileReq } from '@medusajs/client-types';
import type { AdminPostShippingProfilesReq } from '@medusajs/client-types';
import type { AdminShippingProfilesListRes } from '@medusajs/client-types';
import type { AdminShippingProfilesRes } from '@medusajs/client-types';

const { client } = useMedusaAdmin()

export const useShippingProfilesList = (
  options: UseQueryOptionsWrapper<Awaited<ReturnType<typeof client.shippingProfiles.list>>> = {}
) => {
  const { data, ...rest } = useQuery<Awaited<ReturnType<typeof client.shippingProfiles.list>>>(
    ['shippingProfiles', 'list'],
    () => client.shippingProfiles.list(),
    options
  );
  return { ...data, ...rest } as const
};

export const useShippingProfilesCreate = (
  requestBody: AdminPostShippingProfilesReq,
  options: UseMutationOptionsWrapper<Awaited<ReturnType<typeof client.shippingProfiles.create>>, unknown, AdminPostShippingProfilesReq> = {}
) => {
  if (!options?.onSuccess) {
    const queryClient = useQueryClient()
    options.onSuccess = async () => {
      await queryClient.invalidateQueries('shippingProfiles')
    }
  }
  return useMutation<Awaited<ReturnType<typeof client.shippingProfiles.create>>, unknown, AdminPostShippingProfilesReq>(
    ['shippingProfiles', 'create', requestBody],
    () => client.shippingProfiles.create(requestBody),
    options
  );
};

export const useShippingProfilesRetrieve = (
  id: string,
  options: UseQueryOptionsWrapper<Awaited<ReturnType<typeof client.shippingProfiles.retrieve>>> = {}
) => {
  const { data, ...rest } = useQuery<Awaited<ReturnType<typeof client.shippingProfiles.retrieve>>>(
    ['shippingProfiles', 'retrieve', id],
    () => client.shippingProfiles.retrieve(id),
    options
  );
  return { ...data, ...rest } as const
};

export const useShippingProfilesUpdate = (
  id: string,
  requestBody: AdminPostShippingProfilesProfileReq,
  options: UseMutationOptionsWrapper<Awaited<ReturnType<typeof client.shippingProfiles.update>>, unknown, AdminPostShippingProfilesProfileReq> = {}
) => {
  if (!options?.onSuccess) {
    const queryClient = useQueryClient()
    options.onSuccess = async () => {
      await queryClient.invalidateQueries('shippingProfiles')
    }
  }
  return useMutation<Awaited<ReturnType<typeof client.shippingProfiles.update>>, unknown, AdminPostShippingProfilesProfileReq>(
    ['shippingProfiles', 'update', id,requestBody],
    () => client.shippingProfiles.update(id,requestBody),
    options
  );
};

export const useShippingProfilesDelete = (
  id: string,
  options: UseMutationOptionsWrapper<Awaited<ReturnType<typeof client.shippingProfiles.delete>>, unknown, void> = {}
) => {
  if (!options?.onSuccess) {
    const queryClient = useQueryClient()
    options.onSuccess = async () => {
      await queryClient.invalidateQueries('shippingProfiles')
    }
  }
  return useMutation<Awaited<ReturnType<typeof client.shippingProfiles.delete>>, unknown, void>(
    ['shippingProfiles', 'delete', id],
    () => client.shippingProfiles.delete(id),
    options
  );
};


