/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { UseQueryOptionsWrapper, UseMutationOptionsWrapper} from '../core/HookUtils';
import { useMedusaAdmin } from '../useMedusaAdmin';
import type { AdminGetNotesParams } from '../models/AdminGetNotesParams';
import type { AdminNotesDeleteRes } from '../models/AdminNotesDeleteRes';
import type { AdminNotesListRes } from '../models/AdminNotesListRes';
import type { AdminNotesRes } from '../models/AdminNotesRes';
import type { AdminPostNotesNoteReq } from '../models/AdminPostNotesNoteReq';
import type { AdminPostNotesReq } from '../models/AdminPostNotesReq';

export const useNoteList = (
  queryParams: AdminGetNotesParams,
  options: UseQueryOptionsWrapper<Awaited<ReturnType<typeof client.note.list>>> = {}
) => {
  const { client } = useMedusaAdmin()
  const { data, ...rest } = useQuery<Awaited<ReturnType<typeof client.note.list>>>(
    ['note', 'list', queryParams],
    () => client.note.list(queryParams),
    options
  );
  return { ...data, ...rest } as const
};

export const useNoteCreate = (
  requestBody: AdminPostNotesReq,
  options: UseMutationOptionsWrapper<Awaited<ReturnType<typeof client.note.create>>, unknown, AdminPostNotesReq> = {}
) => {
  const { client } = useMedusaAdmin()
  if (!options?.onSuccess) {
    const queryClient = useQueryClient()
    options.onSuccess = async () => {
      await queryClient.invalidateQueries('note')
    }
  }
  return useMutation<Awaited<ReturnType<typeof client.note.create>>, unknown, AdminPostNotesReq>(
    ['note', 'create', requestBody],
    () => client.note.create(requestBody),
    options
  );
};

export const useNoteRetrieve = (
  id: string,
  options: UseQueryOptionsWrapper<Awaited<ReturnType<typeof client.note.retrieve>>> = {}
) => {
  const { client } = useMedusaAdmin()
  const { data, ...rest } = useQuery<Awaited<ReturnType<typeof client.note.retrieve>>>(
    ['note', 'retrieve', id],
    () => client.note.retrieve(id),
    options
  );
  return { ...data, ...rest } as const
};

export const useNoteUpdate = (
  id: string,
  requestBody: AdminPostNotesNoteReq,
  options: UseMutationOptionsWrapper<Awaited<ReturnType<typeof client.note.update>>, unknown, AdminPostNotesNoteReq> = {}
) => {
  const { client } = useMedusaAdmin()
  if (!options?.onSuccess) {
    const queryClient = useQueryClient()
    options.onSuccess = async () => {
      await queryClient.invalidateQueries('note')
    }
  }
  return useMutation<Awaited<ReturnType<typeof client.note.update>>, unknown, AdminPostNotesNoteReq>(
    ['note', 'update', id,requestBody],
    () => client.note.update(id,requestBody),
    options
  );
};

export const useNoteDelete = (
  id: string,
  options: UseMutationOptionsWrapper<Awaited<ReturnType<typeof client.note.delete>>, unknown, void> = {}
) => {
  const { client } = useMedusaAdmin()
  if (!options?.onSuccess) {
    const queryClient = useQueryClient()
    options.onSuccess = async () => {
      await queryClient.invalidateQueries('note')
    }
  }
  return useMutation<Awaited<ReturnType<typeof client.note.delete>>, unknown, void>(
    ['note', 'delete', id],
    () => client.note.delete(id),
    options
  );
};


