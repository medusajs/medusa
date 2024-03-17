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

/**
 * This hook uploads a file to a public bucket or storage. The file upload is handled by the file service installed on the Medusa backend.
 *
 * @example
 * import React from "react"
 * import { useAdminUploadFile } from "medusa-react"
 *
 * const UploadFile = () => {
 *   const uploadFile = useAdminUploadFile()
 *   // ...
 *
 *   const handleFileUpload = (file: File) => {
 *     uploadFile.mutate(file, {
 *       onSuccess: ({ uploads }) => {
 *         console.log(uploads[0].key)
 *       }
 *     })
 *   }
 *
 *   // ...
 * }
 *
 * export default UploadFile
 *
 * @customNamespace Hooks.Admin.Uploads
 * @category Mutations
 */
export const useAdminUploadFile = (
  options?: UseMutationOptions<
    Response<AdminUploadsRes>,
    Error,
    AdminCreateUploadPayload
  >
) => {
  const { client } = useMedusa()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: AdminCreateUploadPayload) =>
      client.admin.uploads.create(payload),
    ...buildOptions(queryClient, undefined, options),
  })
}

/**
 * This hook uploads a file to an ACL or a non-public bucket. The file upload is handled by the file service installed on the Medusa backend.
 *
 * @example
 * import React from "react"
 * import { useAdminUploadProtectedFile } from "medusa-react"
 *
 * const UploadFile = () => {
 *   const uploadFile = useAdminUploadProtectedFile()
 *   // ...
 *
 *   const handleFileUpload = (file: File) => {
 *     uploadFile.mutate(file, {
 *       onSuccess: ({ uploads }) => {
 *         console.log(uploads[0].key)
 *       }
 *     })
 *   }
 *
 *   // ...
 * }
 *
 * export default UploadFile
 *
 * @customNamespace Hooks.Admin.Uploads
 * @category Mutations
 */
export const useAdminUploadProtectedFile = (
  options?: UseMutationOptions<
    Response<AdminUploadsRes>,
    Error,
    AdminCreateUploadPayload
  >
) => {
  const { client } = useMedusa()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: AdminCreateUploadPayload) =>
      client.admin.uploads.createProtected(payload),
    ...buildOptions(queryClient, undefined, options),
  })
}

/**
 * This hook creates and retrieve a presigned or public download URL for a file. The URL creation is handled by the file service installed on the Medusa backend.
 *
 * @example
 * import React from "react"
 * import { useAdminCreatePresignedDownloadUrl } from "medusa-react"
 *
 * const Image = () => {
 *   const createPresignedUrl = useAdminCreatePresignedDownloadUrl()
 *   // ...
 *
 *   const handlePresignedUrl = (fileKey: string) => {
 *     createPresignedUrl.mutate({
 *       file_key: fileKey
 *     }, {
 *       onSuccess: ({ download_url }) => {
 *         console.log(download_url)
 *       }
 *     })
 *   }
 *
 *   // ...
 * }
 *
 * export default Image
 *
 * @customNamespace Hooks.Admin.Uploads
 * @category Mutations
 */
export const useAdminCreatePresignedDownloadUrl = (
  options?: UseMutationOptions<
    Response<AdminUploadsDownloadUrlRes>,
    Error,
    AdminPostUploadsDownloadUrlReq
  >
) => {
  const { client } = useMedusa()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: AdminPostUploadsDownloadUrlReq) =>
      client.admin.uploads.getPresignedDownloadUrl(payload),
    ...buildOptions(queryClient, undefined, options),
  })
}

/**
 * This hook deletes an uploaded file from storage. The file is deleted using the installed file service on the Medusa backend.
 *
 * @example
 * import React from "react"
 * import { useAdminDeleteFile } from "medusa-react"
 *
 * const Image = () => {
 *   const deleteFile = useAdminDeleteFile()
 *   // ...
 *
 *   const handleDeleteFile = (fileKey: string) => {
 *     deleteFile.mutate({
 *       file_key: fileKey
 *     }, {
 *       onSuccess: ({ id, object, deleted }) => {
 *         console.log(id)
 *       }
 *     })
 *   }
 *
 *   // ...
 * }
 *
 * export default Image
 *
 * @customNamespace Hooks.Admin.Uploads
 * @category Mutations
 */
export const useAdminDeleteFile = (
  options?: UseMutationOptions<
    Response<AdminDeleteUploadsRes>,
    Error,
    AdminDeleteUploadsReq
  >
) => {
  const { client } = useMedusa()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: AdminDeleteUploadsReq) =>
      client.admin.uploads.delete(payload),
    ...buildOptions(queryClient, undefined, options),
  })
}
