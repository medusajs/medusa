/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { UseQueryOptionsWrapper, UseMutationOptionsWrapper} from '../core/HookUtils';
import { useMedusaStore } from '../useMedusaStore';
import type { StoreAuthRes } from '../models/StoreAuthRes';
import type { StoreGetAuthEmailRes } from '../models/StoreGetAuthEmailRes';
import type { StorePostAuthReq } from '../models/StorePostAuthReq';

const { client } = useMedusaStore()

export const useAuthGetSession = (
  options: UseQueryOptionsWrapper<Awaited<ReturnType<typeof client.auth.getSession>>> = {}
) => {
  const { data, ...rest } = useQuery<Awaited<ReturnType<typeof client.auth.getSession>>>(
    ['auth', 'getSession'],
    () => client.auth.getSession(),
    options
  );
  return { ...data, ...rest } as const
};

export const useAuthCreate = (
  requestBody: StorePostAuthReq,
  options: UseMutationOptionsWrapper<Awaited<ReturnType<typeof client.auth.create>>, unknown, StorePostAuthReq> = {}
) => {
  if (!options?.onSuccess) {
    const queryClient = useQueryClient()
    options.onSuccess = async () => {
      await queryClient.invalidateQueries('auth')
    }
  }
  return useMutation<Awaited<ReturnType<typeof client.auth.create>>, unknown, StorePostAuthReq>(
    ['auth', 'create', requestBody],
    () => client.auth.create(requestBody),
    options
  );
};

export const useAuthDeleteSession = (
  options: UseMutationOptionsWrapper<Awaited<ReturnType<typeof client.auth.deleteSession>>, unknown, void> = {}
) => {
  if (!options?.onSuccess) {
    const queryClient = useQueryClient()
    options.onSuccess = async () => {
      await queryClient.invalidateQueries('auth')
    }
  }
  return useMutation<Awaited<ReturnType<typeof client.auth.deleteSession>>, unknown, void>(
    ['auth', 'deleteSession'],
    () => client.auth.deleteSession(),
    options
  );
};

export const useAuthExists = (
  email: string,
  options: UseQueryOptionsWrapper<Awaited<ReturnType<typeof client.auth.exists>>> = {}
) => {
  const { data, ...rest } = useQuery<Awaited<ReturnType<typeof client.auth.exists>>>(
    ['auth', 'exists', email],
    () => client.auth.exists(email),
    options
  );
  return { ...data, ...rest } as const
};


