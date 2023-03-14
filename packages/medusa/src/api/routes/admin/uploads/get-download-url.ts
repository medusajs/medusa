import { AbstractFileService } from "../../../../interfaces"
import { IsString } from "class-validator"

/**
 * @oas [post] /uploads/download-url
 * operationId: "PostUploadsDownloadUrl"
 * summary: "Get a File's Download URL"
 * description: "Creates a presigned download url for a file"
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
 *       });
 *   - lang: Shell
 *     label: cURL
 *     source: |
 *       curl --location --request POST 'https://medusa-url.com/admin/uploads/download-url' \
 *       --header 'Authorization: Bearer {api_token}' \
 *       --header 'Content-Type: application/json' \
 *       --data-raw '{
 *           "file_key": "{file_key}"
 *       }'
 * security:
 *   - api_token: []
 *   - cookie_auth: []
 * tags:
 *   - Upload
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
 *     description: "key of the file to obtain the download link for"
 *     type: string
 */
export class AdminPostUploadsDownloadUrlReq {
  @IsString()
  file_key: string
}
