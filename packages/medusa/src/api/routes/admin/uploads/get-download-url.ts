import { IsString } from "class-validator"
import { AbstractFileService } from "../../../../interfaces"
import { validator } from "../../../../utils/validator"

/**
 * [get] /uploads
 * operationId: "GetUploadsFileDownloadUrl"
 * summary: "Gets a presigned download url for a file"
 * description: "Gets a presigned download url for a file"
 * x-authenticated: true
 * parameters:
 *   - (path) fileKey=* {string} key of the file to obtain the download link for.
 * tags:
 *   - Uploads
 * responses:
 *   200:
 *     description: OK
 */
export default async (req, res) => {
  try {
    const validated = await validator(
      AdminGetUploadsFileDownloadUrlReq,
      req.body
    )

    const fileService: AbstractFileService<any> =
      req.scope.resolve("fileService")

    const url = await fileService.getPresignedDownloadUrl({ ...validated })

    res.status(200).send({ downloadUrl: url })
  } catch (err) {
    console.log(err)
    throw err
  }
}

class AdminGetUploadsFileDownloadUrlReq {
  @IsString()
  fileKey: string
}
