import fs from "fs"
import { IFileService } from "../../../../interfaces"

/**
 * @oas [post] /admin/uploads/protected
 * operationId: "PostUploadsProtected"
 * summary: "Protected File Upload"
 * description: "Uploads at least one file with ACL or a non-public bucket to the specific fileservice that is installed in Medusa."
 * x-authenticated: true
 * requestBody:
 *   content:
 *     multipart/form-data:
 *       schema:
 *         type: object
 *         properties:
 *           files:
 *             type: string
 *             format: binary
 * x-codeSamples:
 *   - lang: JavaScript
 *     label: JS Client
 *     source: |
 *       import Medusa from "@medusajs/medusa-js"
 *       const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
 *       // must be previously logged in or use api token
 *       medusa.admin.uploads.createProtected(file)
 *       .then(({ uploads }) => {
 *         console.log(uploads.length);
 *       });
 *   - lang: Shell
 *     label: cURL
 *     source: |
 *       curl --location --request POST 'https://medusa-url.com/admin/uploads/protected' \
 *       --header 'Authorization: Bearer {api_token}' \
 *       --header 'Content-Type: image/jpeg' \
 *       --form 'files=@"<FILE_PATH_1>"' \
 *       --form 'files=@"<FILE_PATH_1>"'
 * security:
 *   - api_token: []
 *   - cookie_auth: []
 * tags:
 *   - Uploads
 * responses:
 *   200:
 *     description: OK
 *     content:
 *       application/json:
 *         schema:
 *           $ref: "#/components/schemas/AdminUploadsRes"
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
  const fileService: IFileService = req.scope.resolve("fileService")

  const result = await Promise.all(
    req.files.map(async (f) => {
      return fileService.uploadProtected(f).then((result) => {
        fs.unlinkSync(f.path)
        return result
      })
    })
  )

  res.status(200).json({ uploads: result })
}

export class IAdminPostUploadsFileReq {
  originalName: string
  path: string
}
