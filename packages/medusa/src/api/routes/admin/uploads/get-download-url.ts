import { AbstractFileService } from "../../../../interfaces"
import { IsString } from "class-validator"

/**
 * [post] /uploads/download-url
 * operationId: "PostUploadsDownloadUrl"
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
 * tags:
 *   - Upload
 * responses:
 *   200:
 *     description: OK
 *     content:
 *       application/json:
 *         schema:
 *           properties:
 *             download_url:
 *               type: string
 *               description: The Download URL of the file
 */
export default async (req, res) => {
  const fileService: AbstractFileService<any> = req.scope.resolve("fileService")

  const url = await fileService.getPresignedDownloadUrl({
    fileKey: (req.validatedBody as AdminPostUploadsDownloadUrlReq).file_key,
  })

  res.status(200).send({ download_url: url })
}

export class AdminPostUploadsDownloadUrlReq {
  @IsString()
  file_key: string
}
