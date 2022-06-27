import { IsString } from "class-validator"
import { AbstractFileService } from "../../../../interfaces"
import { validator } from "../../../../utils/validator"

/**
 * [get] /uploads
 * operationId: "GetUploadsFileDownloadUrl"
 * summary: "Gets a presigned download url for a file"
 * description: "Gets a presigned download url for a file"
 * x-authenticated: true
 * requestBody:
 *   content:
 *     application/json:
 *       schema:
 *         required:
 *           - file_key
 *         properties:
 *           file_key:
 *             description: "key of the file to obtain the download link for"
 *             type: string
 *   - (path) fileKey=* {string} key of the file to obtain the download link for.
 * tags:
 *   - Uploads
 * responses:
 *   200:
 *     description: OK
 */
export default async (req, res) => {
  const validated = await validator(AdminGetUploadsFileDownloadUrlReq, req.body)

  const fileService: AbstractFileService<any> = req.scope.resolve("fileService")

  const url = await fileService.getPresignedDownloadUrl({
    fileKey: validated.file_key,
  })

  res.status(200).send({ download_url: url })
}

class AdminGetUploadsFileDownloadUrlReq {
  @IsString()
  file_key: string
}
