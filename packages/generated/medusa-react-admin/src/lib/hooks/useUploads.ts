/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { UseQueryOptionsWrapper, UseMutationOptionsWrapper} from '../core/HookUtils';
import { useMedusaAdmin } from '../useMedusaAdmin';
import type { AdminDeleteUploadsReq } from '@medusajs/client-types';
import type { AdminDeleteUploadsRes } from '@medusajs/client-types';
import type { AdminPostUploadsDownloadUrlReq } from '@medusajs/client-types';
import type { AdminUploadsDownloadUrlRes } from '@medusajs/client-types';
import type { AdminUploadsRes } from '@medusajs/client-types';

const { client } = useMedusaAdmin()

export const useUploadsPostUploads = (
  formData: {
    files?: Blob;
  },
  options: UseMutationOptionsWrapper<Awaited<ReturnType<typeof client.uploads.postUploads>>, unknown, any> = {}
) => {
  if (!options?.onSuccess) {
    const queryClient = useQueryClient()
    options.onSuccess = async () => {
      await queryClient.invalidateQueries('uploads')
    }
  }
  return useMutation<Awaited<ReturnType<typeof client.uploads.postUploads>>, unknown, any>(
    ['uploads', 'postUploads', formData],
    () => client.uploads.postUploads(formData),
    options
  );
};

export const useUploadsDeleteUploads = (
  requestBody: AdminDeleteUploadsReq,
  options: UseMutationOptionsWrapper<Awaited<ReturnType<typeof client.uploads.deleteUploads>>, unknown, AdminDeleteUploadsReq> = {}
) => {
  if (!options?.onSuccess) {
    const queryClient = useQueryClient()
    options.onSuccess = async () => {
      await queryClient.invalidateQueries('uploads')
    }
  }
  return useMutation<Awaited<ReturnType<typeof client.uploads.deleteUploads>>, unknown, AdminDeleteUploadsReq>(
    ['uploads', 'deleteUploads', requestBody],
    () => client.uploads.deleteUploads(requestBody),
    options
  );
};

export const useUploadsPostUploadsDownloadUrl = (
  requestBody: AdminPostUploadsDownloadUrlReq,
  options: UseMutationOptionsWrapper<Awaited<ReturnType<typeof client.uploads.postUploadsDownloadUrl>>, unknown, AdminPostUploadsDownloadUrlReq> = {}
) => {
  if (!options?.onSuccess) {
    const queryClient = useQueryClient()
    options.onSuccess = async () => {
      await queryClient.invalidateQueries('uploads')
    }
  }
  return useMutation<Awaited<ReturnType<typeof client.uploads.postUploadsDownloadUrl>>, unknown, AdminPostUploadsDownloadUrlReq>(
    ['uploads', 'postUploadsDownloadUrl', requestBody],
    () => client.uploads.postUploadsDownloadUrl(requestBody),
    options
  );
};

export const useUploadsPostUploadsProtected = (
  formData: {
    files?: Blob;
  },
  options: UseMutationOptionsWrapper<Awaited<ReturnType<typeof client.uploads.postUploadsProtected>>, unknown, any> = {}
) => {
  if (!options?.onSuccess) {
    const queryClient = useQueryClient()
    options.onSuccess = async () => {
      await queryClient.invalidateQueries('uploads')
    }
  }
  return useMutation<Awaited<ReturnType<typeof client.uploads.postUploadsProtected>>, unknown, any>(
    ['uploads', 'postUploadsProtected', formData],
    () => client.uploads.postUploadsProtected(formData),
    options
  );
};


