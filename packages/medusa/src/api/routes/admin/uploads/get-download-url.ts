import { IsString } from "class-validator"
import { AbstractFileService } from "../../../../interfaces"
import { validator } from "../../../../utils/validator"

/**
 * [post] /uploads/download-url
 * operationId: "CreateUploadsDownloadUrl"
 * summary: "Creates a presigned download url for a file"
 * description: "Creates a presigned download url for a file"
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
  const fileService: AbstractFileService<any> = req.scope.resolve("fileService")

  const url = await fileService.getPresignedDownloadUrl({
    fileKey: (req.validatedBody as AdminCreateUploadsFileDownloadUrlReq)
      .file_key,
  })

  res.status(200).send({ download_url: url })
}

export class AdminCreateUploadsFileDownloadUrlReq {
  @IsString()
  file_key: string
}
