import {
  AdminDeleteUploadsReq,
  IAdminPostUploadsFileReq,
  AdminDeleteUploadsRes,
  AdminPostUploadsDownloadUrlReq,
  AdminUploadsDownloadUrlRes,
  AdminUploadsRes,
} from "@medusajs/medusa"
import { Response } from "@medusajs/medusa-js"
import { useMutation, UseMutationOptions, useQueryClient } from "react-query"
import { useMedusa } from "../../../contexts"
import { buildOptions } from "../../utils/buildOptions"

export const useAdminUploadFile = (
  options?: UseMutationOptions<
    Response<AdminUploadsRes>,
    Error,
    IAdminPostUploadsFileReq
  >
) => {
  const { client } = useMedusa()
  const queryClient = useQueryClient()

  return useMutation((payload: IAdminPostUploadsFileReq) => {
    return client.admin.uploads.create(payload)
  }, buildOptions(queryClient, [], options))
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
    buildOptions(queryClient, [], options)
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
    buildOptions(queryClient, [], options)
  )
}
