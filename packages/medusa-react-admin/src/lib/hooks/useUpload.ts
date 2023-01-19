/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { UseQueryOptionsWrapper, UseMutationOptionsWrapper} from '../core/HookUtils';
import { useMedusaAdmin } from '../useMedusaAdmin';
import type { AdminDeleteUploadsReq } from '../models/AdminDeleteUploadsReq';
import type { AdminDeleteUploadsRes } from '../models/AdminDeleteUploadsRes';
import type { AdminPostUploadsDownloadUrlReq } from '../models/AdminPostUploadsDownloadUrlReq';
import type { AdminUploadsDownloadUrlRes } from '../models/AdminUploadsDownloadUrlRes';
import type { AdminUploadsRes } from '../models/AdminUploadsRes';

const { client } = useMedusaAdmin()

export const useUploadPostUploads = (
  formData: {
    files?: Blob;
  },
  options: UseMutationOptionsWrapper<Awaited<ReturnType<typeof client.upload.postUploads>>, unknown, any> = {}
) => {
  if (!options?.onSuccess) {
    const queryClient = useQueryClient()
    options.onSuccess = async () => {
      await queryClient.invalidateQueries('upload')
    }
  }
  return useMutation<Awaited<ReturnType<typeof client.upload.postUploads>>, unknown, any>(
    ['upload', 'postUploads', formData],
    () => client.upload.postUploads(formData),
    options
  );
};

export const useUploadAdminDeleteUploads = (
  requestBody: AdminDeleteUploadsReq,
  options: UseMutationOptionsWrapper<Awaited<ReturnType<typeof client.upload.adminDeleteUploads>>, unknown, AdminDeleteUploadsReq> = {}
) => {
  if (!options?.onSuccess) {
    const queryClient = useQueryClient()
    options.onSuccess = async () => {
      await queryClient.invalidateQueries('upload')
    }
  }
  return useMutation<Awaited<ReturnType<typeof client.upload.adminDeleteUploads>>, unknown, AdminDeleteUploadsReq>(
    ['upload', 'adminDeleteUploads', requestBody],
    () => client.upload.adminDeleteUploads(requestBody),
    options
  );
};

export const useUploadPostUploadsDownloadUrl = (
  requestBody: AdminPostUploadsDownloadUrlReq,
  options: UseMutationOptionsWrapper<Awaited<ReturnType<typeof client.upload.postUploadsDownloadUrl>>, unknown, AdminPostUploadsDownloadUrlReq> = {}
) => {
  if (!options?.onSuccess) {
    const queryClient = useQueryClient()
    options.onSuccess = async () => {
      await queryClient.invalidateQueries('upload')
    }
  }
  return useMutation<Awaited<ReturnType<typeof client.upload.postUploadsDownloadUrl>>, unknown, AdminPostUploadsDownloadUrlReq>(
    ['upload', 'postUploadsDownloadUrl', requestBody],
    () => client.upload.postUploadsDownloadUrl(requestBody),
    options
  );
};

export const useUploadPostUploadsProtected = (
  formData: {
    files?: Blob;
  },
  options: UseMutationOptionsWrapper<Awaited<ReturnType<typeof client.upload.postUploadsProtected>>, unknown, any> = {}
) => {
  if (!options?.onSuccess) {
    const queryClient = useQueryClient()
    options.onSuccess = async () => {
      await queryClient.invalidateQueries('upload')
    }
  }
  return useMutation<Awaited<ReturnType<typeof client.upload.postUploadsProtected>>, unknown, any>(
    ['upload', 'postUploadsProtected', formData],
    () => client.upload.postUploadsProtected(formData),
    options
  );
};


