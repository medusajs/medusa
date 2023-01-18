/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { UseQueryOptionsWrapper, UseMutationOptionsWrapper} from '../core/HookUtils';
import { useMedusaAdmin } from '../useMedusaAdmin';
import type { AdminInviteDeleteRes } from '../models/AdminInviteDeleteRes';
import type { AdminListInvitesRes } from '../models/AdminListInvitesRes';
import type { AdminPostInvitesInviteAcceptReq } from '../models/AdminPostInvitesInviteAcceptReq';
import type { AdminPostInvitesReq } from '../models/AdminPostInvitesReq';

export const useInviteList = (
  options: UseQueryOptionsWrapper<Awaited<ReturnType<typeof client.invite.list>>> = {}
) => {
  const { client } = useMedusaAdmin()
  const { data, ...rest } = useQuery<Awaited<ReturnType<typeof client.invite.list>>>(
    ['invite', 'list'],
    () => client.invite.list(),
    options
  );
  return { ...data, ...rest } as const
};

export const useInviteCreate = (
  requestBody: AdminPostInvitesReq,
  options: UseMutationOptionsWrapper<Awaited<ReturnType<typeof client.invite.create>>, unknown, AdminPostInvitesReq> = {}
) => {
  const { client } = useMedusaAdmin()
  if (!options?.onSuccess) {
    const queryClient = useQueryClient()
    options.onSuccess = async () => {
      await queryClient.invalidateQueries('invite')
    }
  }
  return useMutation<Awaited<ReturnType<typeof client.invite.create>>, unknown, AdminPostInvitesReq>(
    ['invite', 'create', requestBody],
    () => client.invite.create(requestBody),
    options
  );
};

export const useInviteAccept = (
  requestBody: AdminPostInvitesInviteAcceptReq,
  options: UseMutationOptionsWrapper<Awaited<ReturnType<typeof client.invite.accept>>, unknown, AdminPostInvitesInviteAcceptReq> = {}
) => {
  const { client } = useMedusaAdmin()
  if (!options?.onSuccess) {
    const queryClient = useQueryClient()
    options.onSuccess = async () => {
      await queryClient.invalidateQueries('invite')
    }
  }
  return useMutation<Awaited<ReturnType<typeof client.invite.accept>>, unknown, AdminPostInvitesInviteAcceptReq>(
    ['invite', 'accept', requestBody],
    () => client.invite.accept(requestBody),
    options
  );
};

export const useInviteDelete = (
  inviteId: string,
  options: UseMutationOptionsWrapper<Awaited<ReturnType<typeof client.invite.delete>>, unknown, void> = {}
) => {
  const { client } = useMedusaAdmin()
  if (!options?.onSuccess) {
    const queryClient = useQueryClient()
    options.onSuccess = async () => {
      await queryClient.invalidateQueries('invite')
    }
  }
  return useMutation<Awaited<ReturnType<typeof client.invite.delete>>, unknown, void>(
    ['invite', 'delete', inviteId],
    () => client.invite.delete(inviteId),
    options
  );
};

export const useInviteResend = (
  inviteId: string,
  options: UseMutationOptionsWrapper<Awaited<ReturnType<typeof client.invite.resend>>, unknown, void> = {}
) => {
  const { client } = useMedusaAdmin()
  if (!options?.onSuccess) {
    const queryClient = useQueryClient()
    options.onSuccess = async () => {
      await queryClient.invalidateQueries('invite')
    }
  }
  return useMutation<Awaited<ReturnType<typeof client.invite.resend>>, unknown, void>(
    ['invite', 'resend', inviteId],
    () => client.invite.resend(inviteId),
    options
  );
};


