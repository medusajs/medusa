/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { UseQueryOptionsWrapper, UseMutationOptionsWrapper} from '../core/HookUtils';
import { useMedusaAdmin } from '../useMedusaAdmin';
import type { AdminGetNotesParams } from '@medusajs/client-types';
import type { AdminNotesDeleteRes } from '@medusajs/client-types';
import type { AdminNotesListRes } from '@medusajs/client-types';
import type { AdminNotesRes } from '@medusajs/client-types';
import type { AdminPostNotesNoteReq } from '@medusajs/client-types';
import type { AdminPostNotesReq } from '@medusajs/client-types';

const { client } = useMedusaAdmin()

export const useNotesList = (
  queryParams: AdminGetNotesParams,
  options: UseQueryOptionsWrapper<Awaited<ReturnType<typeof client.notes.list>>> = {}
) => {
  const { data, ...rest } = useQuery<Awaited<ReturnType<typeof client.notes.list>>>(
    ['notes', 'list', queryParams],
    () => client.notes.list(queryParams),
    options
  );
  return { ...data, ...rest } as const
};

export const useNotesCreate = (
  requestBody: AdminPostNotesReq,
  options: UseMutationOptionsWrapper<Awaited<ReturnType<typeof client.notes.create>>, unknown, AdminPostNotesReq> = {}
) => {
  if (!options?.onSuccess) {
    const queryClient = useQueryClient()
    options.onSuccess = async () => {
      await queryClient.invalidateQueries('notes')
    }
  }
  return useMutation<Awaited<ReturnType<typeof client.notes.create>>, unknown, AdminPostNotesReq>(
    ['notes', 'create', requestBody],
    () => client.notes.create(requestBody),
    options
  );
};

export const useNotesRetrieve = (
  id: string,
  options: UseQueryOptionsWrapper<Awaited<ReturnType<typeof client.notes.retrieve>>> = {}
) => {
  const { data, ...rest } = useQuery<Awaited<ReturnType<typeof client.notes.retrieve>>>(
    ['notes', 'retrieve', id],
    () => client.notes.retrieve(id),
    options
  );
  return { ...data, ...rest } as const
};

export const useNotesUpdate = (
  id: string,
  requestBody: AdminPostNotesNoteReq,
  options: UseMutationOptionsWrapper<Awaited<ReturnType<typeof client.notes.update>>, unknown, AdminPostNotesNoteReq> = {}
) => {
  if (!options?.onSuccess) {
    const queryClient = useQueryClient()
    options.onSuccess = async () => {
      await queryClient.invalidateQueries('notes')
    }
  }
  return useMutation<Awaited<ReturnType<typeof client.notes.update>>, unknown, AdminPostNotesNoteReq>(
    ['notes', 'update', id,requestBody],
    () => client.notes.update(id,requestBody),
    options
  );
};

export const useNotesDelete = (
  id: string,
  options: UseMutationOptionsWrapper<Awaited<ReturnType<typeof client.notes.delete>>, unknown, void> = {}
) => {
  if (!options?.onSuccess) {
    const queryClient = useQueryClient()
    options.onSuccess = async () => {
      await queryClient.invalidateQueries('notes')
    }
  }
  return useMutation<Awaited<ReturnType<typeof client.notes.delete>>, unknown, void>(
    ['notes', 'delete', id],
    () => client.notes.delete(id),
    options
  );
};


