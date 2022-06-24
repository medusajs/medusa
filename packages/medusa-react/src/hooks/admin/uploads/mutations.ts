import {
  AdminDeleteUploadRes,
  AdminDeleteUploadReq,
  AdminCreateUploadsFileDownloadUrlReq,
  AdminCreateUploadsFileDownloadUrlRes,
} from "@medusajs/medusa"
import { Response } from "@medusajs/medusa-js"
import { useMutation, UseMutationOptions, useQueryClient } from "react-query"
import { useMedusa } from "../../../contexts"
import { buildOptions } from "../../utils/buildOptions"

// export const useAdminUploadFile = (
//   options?: UseMutationOptions<
//     Response<AdminUploadRes>,
//     Error,
//     IAdminPostUploadsFile
//   >
// ) => {
//   const { client } = useMedusa()
//   const queryClient = useQueryClient()

//   return useMutation(
//     (payload: IAdminPostUploadsFile) => {
//       return client.admin.uploads.create(payload)
//     },
//     buildOptions(queryClient, [], options)
//   )
// }

export const useAdminCreatePresignedDownloadUrl = (
  options?: UseMutationOptions<
    Response<AdminCreateUploadsFileDownloadUrlRes>,
    Error,
    AdminCreateUploadsFileDownloadUrlReq
  >
) => {
  const { client } = useMedusa()
  const queryClient = useQueryClient()

  return useMutation(
    (payload: AdminCreateUploadsFileDownloadUrlReq) =>
      client.admin.uploads.getPresignedDownloadUrl(payload),
    buildOptions(queryClient, [], options)
  )
}

export const useAdminDeleteFile = (
  options?: UseMutationOptions<
    Response<AdminDeleteUploadRes>,
    Error,
    AdminDeleteUploadReq
  >
) => {
  const { client } = useMedusa()
  const queryClient = useQueryClient()

  return useMutation(
    (payload: AdminDeleteUploadReq) => client.admin.uploads.delete(payload),
    buildOptions(queryClient, [], options)
  )
}
