import { IsString } from "class-validator"
import { Request, Response } from "express"
import { IFileService } from "../../../../interfaces"
/**
 * @oas [delete] /admin/uploads
 * operationId: "DeleteUploads"
 * summary: "Delete an Uploaded File"
 * description: "Delete an uploaded file from storage. The file is deleted using the installed file service on the Medusa backend."
 * x-authenticated: true
 * requestBody:
 *   content:
 *     application/json:
 *       schema:
 *         $ref: "#/components/schemas/AdminDeleteUploadsReq"
 * x-codeSamples:
 *   - lang: JavaScript
 *     label: JS Client
 *     source: |
 *       import Medusa from "@medusajs/medusa-js"
 *       const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
 *       // must be previously logged in or use api token
 *       medusa.admin.uploads.delete({
 *         file_key
 *       })
 *       .then(({ id, object, deleted }) => {
 *         console.log(id);
 *       })
 *   - lang: tsx
 *     label: Medusa React
 *     source: |
 *       import React from "react"
 *       import { useAdminDeleteFile } from "medusa-react"
 *
 *       const Image = () => {
 *         const deleteFile = useAdminDeleteFile()
 *         // ...
 *
 *         const handleDeleteFile = (fileKey: string) => {
 *           deleteFile.mutate({
 *             file_key: fileKey
 *           }, {
 *             onSuccess: ({ id, object, deleted }) => {
 *               console.log(id)
 *             }
 *           })
 *         }
 *
 *         // ...
 *       }
 *
 *       export default Image
 *   - lang: Shell
 *     label: cURL
 *     source: |
 *       curl -X DELETE '{backend_url}/admin/uploads' \
 *       -H 'x-medusa-access-token: {api_token}' \
 *       -H 'Content-Type: application/json' \
 *       --data-raw '{
 *           "file_key": "{file_key}"
 *       }'
 * security:
 *   - api_token: []
 *   - cookie_auth: []
 *   - jwt_token: []
 * tags:
 *   - Uploads
 * responses:
 *   200:
 *     description: OK
 *     content:
 *       application/json:
 *         schema:
 *           $ref: "#/components/schemas/AdminDeleteUploadsRes"
 *   "400":
 *     $ref: "#/components/responses/400_error"
 *   "401":
 *     $ref: "#/components/responses/unauthorized"
 *   "404":
 *     $ref: "#/components/responses/not_found_error"
 *   "409":
 *     $ref: "#/components/responses/invalid_state_error"
 *   "422":
 *     $ref: "#/components/responses/invalid_request_error"
 *   "500":
 *     $ref: "#/components/responses/500_error"
 */
export default async (req: Request, res: Response) => {
  const validated = req.validatedBody as AdminDeleteUploadsReq

  const fileService: IFileService = req.scope.resolve("fileService")

  await fileService.delete({
    fileKey: validated.file_key,
  })

  res
    .status(200)
    .send({ id: validated.file_key, object: "file", deleted: true })
}

/**
 * @schema AdminDeleteUploadsReq
 * type: object
 * description: "The details of the file to delete."
 * required:
 *   - file_key
 * properties:
 *   file_key:
 *     description: "key of the file to delete. This is obtained when you first uploaded the file, or by the file service if you used it directly."
 *     type: string
 */
export class AdminDeleteUploadsReq {
  @IsString()
  file_key: string
}
