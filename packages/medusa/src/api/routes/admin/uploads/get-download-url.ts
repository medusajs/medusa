import { IsString } from "class-validator"
import { AbstractFileService } from "../../../../interfaces"
import { validator } from "../../../../utils/validator"

/**
 * [get] /uploads
 * operationId: "GetUploadsFileDownloadUrl"
 * summary: "Removes an uploaded file"
 * description: "Removes an uploaded file using the installed fileservice"
 * x-authenticated: true
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
