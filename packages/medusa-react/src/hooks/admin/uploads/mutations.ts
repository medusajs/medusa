import {
  AdminDeleteUploadsReq,
  AdminDeleteUploadsRes,
  AdminPostUploadsDownloadUrlReq,
  AdminUploadsDownloadUrlRes,
  AdminUploadsRes,
} from "@medusajs/medusa"
import { AdminCreateUploadPayload, Response } from "@medusajs/medusa-js"
import {
  useMutation,
  UseMutationOptions,
  useQueryClient,
} from "@tanstack/react-query"
import { useMedusa } from "../../../contexts"
import { buildOptions } from "../../utils/buildOptions"

export const useAdminUploadFile = (
  options?: UseMutationOptions<
    Response<AdminUploadsRes>,
    Error,
    AdminCreateUploadPayload
  >
) => {
  const { client } = useMedusa()
  const queryClient = useQueryClient()

  return useMutation((payload: AdminCreateUploadPayload) => {
    return client.admin.uploads.create(payload)
  }, buildOptions(queryClient, undefined, options))
}

export const useAdminUploadProtectedFile = (
  options?: UseMutationOptions<
    Response<AdminUploadsRes>,
    Error,
    AdminCreateUploadPayload
  >
) => {
  const { client } = useMedusa()
  const queryClient = useQueryClient()

  return useMutation((payload: AdminCreateUploadPayload) => {
    return client.admin.uploads.createProtected(payload)
  }, buildOptions(queryClient, undefined, options))
}

export const useAdminCreatePresignedDownloadUrl = (
  options?: UseMutationOptions<
    Response<AdminUploadsDownloadUrlRes>,
    Error,
    AdminPostUploadsDownloadUrlReq
  >
) => {
  const { client } = useMedusa()
  const queryClient = useQueryClient()

  return useMutation(
    (payload: AdminPostUploadsDownloadUrlReq) =>
      client.admin.uploads.getPresignedDownloadUrl(payload),
    buildOptions(queryClient, undefined, options)
  )
}

export const useAdminDeleteFile = (
  options?: UseMutationOptions<
    Response<AdminDeleteUploadsRes>,
    Error,
    AdminDeleteUploadsReq
  >
) => {
  const { client } = useMedusa()
  const queryClient = useQueryClient()

  return useMutation(
    (payload: AdminDeleteUploadsReq) => client.admin.uploads.delete(payload),
    buildOptions(queryClient, undefined, options)
  )
}
