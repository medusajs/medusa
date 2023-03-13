/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { UseQueryOptionsWrapper, UseMutationOptionsWrapper} from '../core/HookUtils';
import { useMedusaAdmin } from '../useMedusaAdmin';
import type { AdminInviteDeleteRes } from '@medusajs/client-types';
import type { AdminListInvitesRes } from '@medusajs/client-types';
import type { AdminPostInvitesInviteAcceptReq } from '@medusajs/client-types';
import type { AdminPostInvitesReq } from '@medusajs/client-types';

const { client } = useMedusaAdmin()

export const useInvitesList = (
  options: UseQueryOptionsWrapper<Awaited<ReturnType<typeof client.invites.list>>> = {}
) => {
  const { data, ...rest } = useQuery<Awaited<ReturnType<typeof client.invites.list>>>(
    ['invites', 'list'],
    () => client.invites.list(),
    options
  );
  return { ...data, ...rest } as const
};

export const useInvitesCreate = (
  requestBody: AdminPostInvitesReq,
  options: UseMutationOptionsWrapper<Awaited<ReturnType<typeof client.invites.create>>, unknown, AdminPostInvitesReq> = {}
) => {
  if (!options?.onSuccess) {
    const queryClient = useQueryClient()
    options.onSuccess = async () => {
      await queryClient.invalidateQueries('invites')
    }
  }
  return useMutation<Awaited<ReturnType<typeof client.invites.create>>, unknown, AdminPostInvitesReq>(
    ['invites', 'create', requestBody],
    () => client.invites.create(requestBody),
    options
  );
};

export const useInvitesAccept = (
  requestBody: AdminPostInvitesInviteAcceptReq,
  options: UseMutationOptionsWrapper<Awaited<ReturnType<typeof client.invites.accept>>, unknown, AdminPostInvitesInviteAcceptReq> = {}
) => {
  if (!options?.onSuccess) {
    const queryClient = useQueryClient()
    options.onSuccess = async () => {
      await queryClient.invalidateQueries('invites')
    }
  }
  return useMutation<Awaited<ReturnType<typeof client.invites.accept>>, unknown, AdminPostInvitesInviteAcceptReq>(
    ['invites', 'accept', requestBody],
    () => client.invites.accept(requestBody),
    options
  );
};

export const useInvitesDelete = (
  inviteId: string,
  options: UseMutationOptionsWrapper<Awaited<ReturnType<typeof client.invites.delete>>, unknown, void> = {}
) => {
  if (!options?.onSuccess) {
    const queryClient = useQueryClient()
    options.onSuccess = async () => {
      await queryClient.invalidateQueries('invites')
    }
  }
  return useMutation<Awaited<ReturnType<typeof client.invites.delete>>, unknown, void>(
    ['invites', 'delete', inviteId],
    () => client.invites.delete(inviteId),
    options
  );
};

export const useInvitesResend = (
  inviteId: string,
  options: UseMutationOptionsWrapper<Awaited<ReturnType<typeof client.invites.resend>>, unknown, void> = {}
) => {
  if (!options?.onSuccess) {
    const queryClient = useQueryClient()
    options.onSuccess = async () => {
      await queryClient.invalidateQueries('invites')
    }
  }
  return useMutation<Awaited<ReturnType<typeof client.invites.resend>>, unknown, void>(
    ['invites', 'resend', inviteId],
    () => client.invites.resend(inviteId),
    options
  );
};


