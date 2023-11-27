import { AbstractFileService } from "../../../../interfaces"
import { IsString } from "class-validator"

/**
 * @oas [post] /admin/uploads/download-url
 * operationId: "PostUploadsDownloadUrl"
 * summary: "Get a File's Download URL"
 * description: "Create and retrieve a presigned or public download URL for a file. The URL creation is handled by the file service installed on the Medusa backend."
 * x-authenticated: true
 * requestBody:
 *   content:
 *     application/json:
 *       schema:
 *         $ref: "#/components/schemas/AdminPostUploadsDownloadUrlReq"
 * x-codeSamples:
 *   - lang: JavaScript
 *     label: JS Client
 *     source: |
 *       import Medusa from "@medusajs/medusa-js"
 *       const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
 *       // must be previously logged in or use api token
 *       medusa.admin.uploads.getPresignedDownloadUrl({
 *         file_key
 *       })
 *       .then(({ download_url }) => {
 *         console.log(download_url);
 *       })
 *   - lang: Shell
 *     label: cURL
 *     source: |
 *       curl -X POST '{backend_url}/admin/uploads/download-url' \
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
 *           $ref: "#/components/schemas/AdminUploadsDownloadUrlRes"
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
export default async (req, res) => {
  const fileService: AbstractFileService = req.scope.resolve("fileService")

  const url = await fileService.getPresignedDownloadUrl({
    fileKey: (req.validatedBody as AdminPostUploadsDownloadUrlReq).file_key,
  })

  res.status(200).send({ download_url: url })
}

/**
 * @schema AdminPostUploadsDownloadUrlReq
 * type: object
 * required:
 *   - file_key
 * properties:
 *   file_key:
 *     description: "key of the file to obtain the download link for. This is obtained when you first uploaded the file, or by the file service if you used it directly."
 *     type: string
 */
export class AdminPostUploadsDownloadUrlReq {
  @IsString()
  file_key: string
}
