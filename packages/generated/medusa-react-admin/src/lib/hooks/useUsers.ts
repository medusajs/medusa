/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { UseQueryOptionsWrapper, UseMutationOptionsWrapper} from '../core/HookUtils';
import { useMedusaAdmin } from '../useMedusaAdmin';
import type { AdminCreateUserRequest } from '@medusajs/client-types';
import type { AdminDeleteUserRes } from '@medusajs/client-types';
import type { AdminResetPasswordRequest } from '@medusajs/client-types';
import type { AdminResetPasswordTokenRequest } from '@medusajs/client-types';
import type { AdminUpdateUserRequest } from '@medusajs/client-types';
import type { AdminUserRes } from '@medusajs/client-types';
import type { AdminUsersListRes } from '@medusajs/client-types';

const { client } = useMedusaAdmin()

export const useUsersList = (
  options: UseQueryOptionsWrapper<Awaited<ReturnType<typeof client.users.list>>> = {}
) => {
  const { data, ...rest } = useQuery<Awaited<ReturnType<typeof client.users.list>>>(
    ['users', 'list'],
    () => client.users.list(),
    options
  );
  return { ...data, ...rest } as const
};

export const useUsersCreate = (
  requestBody: AdminCreateUserRequest,
  options: UseMutationOptionsWrapper<Awaited<ReturnType<typeof client.users.create>>, unknown, AdminCreateUserRequest> = {}
) => {
  if (!options?.onSuccess) {
    const queryClient = useQueryClient()
    options.onSuccess = async () => {
      await queryClient.invalidateQueries('users')
    }
  }
  return useMutation<Awaited<ReturnType<typeof client.users.create>>, unknown, AdminCreateUserRequest>(
    ['users', 'create', requestBody],
    () => client.users.create(requestBody),
    options
  );
};

export const useUsersSendResetPasswordToken = (
  requestBody: AdminResetPasswordTokenRequest,
  options: UseMutationOptionsWrapper<Awaited<ReturnType<typeof client.users.sendResetPasswordToken>>, unknown, AdminResetPasswordTokenRequest> = {}
) => {
  if (!options?.onSuccess) {
    const queryClient = useQueryClient()
    options.onSuccess = async () => {
      await queryClient.invalidateQueries('users')
    }
  }
  return useMutation<Awaited<ReturnType<typeof client.users.sendResetPasswordToken>>, unknown, AdminResetPasswordTokenRequest>(
    ['users', 'sendResetPasswordToken', requestBody],
    () => client.users.sendResetPasswordToken(requestBody),
    options
  );
};

export const useUsersResetPassword = (
  requestBody: AdminResetPasswordRequest,
  options: UseMutationOptionsWrapper<Awaited<ReturnType<typeof client.users.resetPassword>>, unknown, AdminResetPasswordRequest> = {}
) => {
  if (!options?.onSuccess) {
    const queryClient = useQueryClient()
    options.onSuccess = async () => {
      await queryClient.invalidateQueries('users')
    }
  }
  return useMutation<Awaited<ReturnType<typeof client.users.resetPassword>>, unknown, AdminResetPasswordRequest>(
    ['users', 'resetPassword', requestBody],
    () => client.users.resetPassword(requestBody),
    options
  );
};

export const useUsersRetrieve = (
  id: string,
  options: UseQueryOptionsWrapper<Awaited<ReturnType<typeof client.users.retrieve>>> = {}
) => {
  const { data, ...rest } = useQuery<Awaited<ReturnType<typeof client.users.retrieve>>>(
    ['users', 'retrieve', id],
    () => client.users.retrieve(id),
    options
  );
  return { ...data, ...rest } as const
};

export const useUsersUpdate = (
  id: string,
  requestBody: AdminUpdateUserRequest,
  options: UseMutationOptionsWrapper<Awaited<ReturnType<typeof client.users.update>>, unknown, AdminUpdateUserRequest> = {}
) => {
  if (!options?.onSuccess) {
    const queryClient = useQueryClient()
    options.onSuccess = async () => {
      await queryClient.invalidateQueries('users')
    }
  }
  return useMutation<Awaited<ReturnType<typeof client.users.update>>, unknown, AdminUpdateUserRequest>(
    ['users', 'update', id,requestBody],
    () => client.users.update(id,requestBody),
    options
  );
};

export const useUsersDelete = (
  id: string,
  options: UseMutationOptionsWrapper<Awaited<ReturnType<typeof client.users.delete>>, unknown, void> = {}
) => {
  if (!options?.onSuccess) {
    const queryClient = useQueryClient()
    options.onSuccess = async () => {
      await queryClient.invalidateQueries('users')
    }
  }
  return useMutation<Awaited<ReturnType<typeof client.users.delete>>, unknown, void>(
    ['users', 'delete', id],
    () => client.users.delete(id),
    options
  );
};


