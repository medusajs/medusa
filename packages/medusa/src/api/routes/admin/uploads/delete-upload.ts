import { IsString } from "class-validator"
import { validator } from "../../../../utils/validator"

/**
 * [delete] /uploads
 * operationId: "AdminDeleteUpload"
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
    const validated = await validator(AdminDeleteUploadReq, req.body)

    const fileService = req.scope.resolve("fileService")

    await fileService.delete(validated.fileKey)

    res.status(200).send({ id: "", object: "file", deleted: true })
  } catch (err) {
    console.log(err)
    throw err
  }
}

class AdminDeleteUploadReq {
  @IsString()
  fileKey: string
}
