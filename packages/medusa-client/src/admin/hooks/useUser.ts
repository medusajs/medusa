/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { UseQueryOptionsWrapper, UseMutationOptionsWrapper} from '../core/HookUtils';
import { useMedusaAdmin } from '../useMedusaAdmin';
import type { AdminCreateUserRequest } from '../models/AdminCreateUserRequest';
import type { AdminDeleteUserRes } from '../models/AdminDeleteUserRes';
import type { AdminResetPasswordRequest } from '../models/AdminResetPasswordRequest';
import type { AdminResetPasswordTokenRequest } from '../models/AdminResetPasswordTokenRequest';
import type { AdminUpdateUserRequest } from '../models/AdminUpdateUserRequest';
import type { AdminUserRes } from '../models/AdminUserRes';
import type { AdminUsersListRes } from '../models/AdminUsersListRes';

export const useUserList = (
  options: UseQueryOptionsWrapper<Awaited<ReturnType<typeof client.user.list>>> = {}
) => {
  const { client } = useMedusaAdmin()
  const { data, ...rest } = useQuery<Awaited<ReturnType<typeof client.user.list>>>(
    ['user', 'list'],
    () => client.user.list(),
    options
  );
  return { ...data, ...rest } as const
};

export const useUserCreate = (
  requestBody: AdminCreateUserRequest,
  options: UseMutationOptionsWrapper<Awaited<ReturnType<typeof client.user.create>>, unknown, AdminCreateUserRequest> = {}
) => {
  const { client } = useMedusaAdmin()
  if (!options?.onSuccess) {
    const queryClient = useQueryClient()
    options.onSuccess = async () => {
      await queryClient.invalidateQueries('user')
    }
  }
  return useMutation<Awaited<ReturnType<typeof client.user.create>>, unknown, AdminCreateUserRequest>(
    ['user', 'create', requestBody],
    () => client.user.create(requestBody),
    options
  );
};

export const useUserSendResetPasswordToken = (
  requestBody: AdminResetPasswordTokenRequest,
  options: UseMutationOptionsWrapper<Awaited<ReturnType<typeof client.user.sendResetPasswordToken>>, unknown, AdminResetPasswordTokenRequest> = {}
) => {
  const { client } = useMedusaAdmin()
  if (!options?.onSuccess) {
    const queryClient = useQueryClient()
    options.onSuccess = async () => {
      await queryClient.invalidateQueries('user')
    }
  }
  return useMutation<Awaited<ReturnType<typeof client.user.sendResetPasswordToken>>, unknown, AdminResetPasswordTokenRequest>(
    ['user', 'sendResetPasswordToken', requestBody],
    () => client.user.sendResetPasswordToken(requestBody),
    options
  );
};

export const useUserResetPassword = (
  requestBody: AdminResetPasswordRequest,
  options: UseMutationOptionsWrapper<Awaited<ReturnType<typeof client.user.resetPassword>>, unknown, AdminResetPasswordRequest> = {}
) => {
  const { client } = useMedusaAdmin()
  if (!options?.onSuccess) {
    const queryClient = useQueryClient()
    options.onSuccess = async () => {
      await queryClient.invalidateQueries('user')
    }
  }
  return useMutation<Awaited<ReturnType<typeof client.user.resetPassword>>, unknown, AdminResetPasswordRequest>(
    ['user', 'resetPassword', requestBody],
    () => client.user.resetPassword(requestBody),
    options
  );
};

export const useUserRetrieve = (
  id: string,
  options: UseQueryOptionsWrapper<Awaited<ReturnType<typeof client.user.retrieve>>> = {}
) => {
  const { client } = useMedusaAdmin()
  const { data, ...rest } = useQuery<Awaited<ReturnType<typeof client.user.retrieve>>>(
    ['user', 'retrieve', id],
    () => client.user.retrieve(id),
    options
  );
  return { ...data, ...rest } as const
};

export const useUserUpdate = (
  id: string,
  requestBody: AdminUpdateUserRequest,
  options: UseMutationOptionsWrapper<Awaited<ReturnType<typeof client.user.update>>, unknown, AdminUpdateUserRequest> = {}
) => {
  const { client } = useMedusaAdmin()
  if (!options?.onSuccess) {
    const queryClient = useQueryClient()
    options.onSuccess = async () => {
      await queryClient.invalidateQueries('user')
    }
  }
  return useMutation<Awaited<ReturnType<typeof client.user.update>>, unknown, AdminUpdateUserRequest>(
    ['user', 'update', id,requestBody],
    () => client.user.update(id,requestBody),
    options
  );
};

export const useUserDelete = (
  id: string,
  options: UseMutationOptionsWrapper<Awaited<ReturnType<typeof client.user.delete>>, unknown, void> = {}
) => {
  const { client } = useMedusaAdmin()
  if (!options?.onSuccess) {
    const queryClient = useQueryClient()
    options.onSuccess = async () => {
      await queryClient.invalidateQueries('user')
    }
  }
  return useMutation<Awaited<ReturnType<typeof client.user.delete>>, unknown, void>(
    ['user', 'delete', id],
    () => client.user.delete(id),
    options
  );
};


