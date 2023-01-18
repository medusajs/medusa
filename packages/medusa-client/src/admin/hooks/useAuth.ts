/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { UseQueryOptionsWrapper, UseMutationOptionsWrapper} from '../core/HookUtils';
import { useMedusaAdmin } from '../useMedusaAdmin';
import type { AdminAuthRes } from '../models/AdminAuthRes';

export const useAuthGetSession = (
  options: UseQueryOptionsWrapper<Awaited<ReturnType<typeof client.auth.getSession>>> = {}
) => {
  const { client } = useMedusaAdmin()
  const { data, ...rest } = useQuery<Awaited<ReturnType<typeof client.auth.getSession>>>(
    ['auth', 'getSession'],
    () => client.auth.getSession(),
    options
  );
  return { ...data, ...rest } as const
};

export const useAuthCreateSession = (
  requestBody: {
    /**
     * The User's email.
     */
    email: string;
    /**
     * The User's password.
     */
    password: string;
  },
  options: UseMutationOptionsWrapper<Awaited<ReturnType<typeof client.auth.createSession>>, unknown, any> = {}
) => {
  const { client } = useMedusaAdmin()
  if (!options?.onSuccess) {
    const queryClient = useQueryClient()
    options.onSuccess = async () => {
      await queryClient.invalidateQueries('auth')
    }
  }
  return useMutation<Awaited<ReturnType<typeof client.auth.createSession>>, unknown, any>(
    ['auth', 'createSession', requestBody],
    () => client.auth.createSession(requestBody),
    options
  );
};

export const useAuthDeleteSession = (
  options: UseMutationOptionsWrapper<Awaited<ReturnType<typeof client.auth.deleteSession>>, unknown, void> = {}
) => {
  const { client } = useMedusaAdmin()
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


