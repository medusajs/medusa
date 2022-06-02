import { IFileService } from "../../../../interfaces"
import { Logger } from "../../../../types/global"

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
  const { key } = req.body
  try {
    const fileService: IFileService<any> = req.scope.resolve("fileService")
    const logger_: Logger = req.scope.resolve("logger")

    logger_.info(key)

    const preSignedUrl = await fileService.getPresignedDownloadUrl({
      fileKey: key || "test-1653895914252.csv",
    })

    res.status(200).send({ preSignedUrl })
  } catch (err) {
    console.log(err)
    throw err
  }
}
