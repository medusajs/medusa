import { IFileService } from "../../../../interfaces"

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
  const { key } = req.params
  try {
    const fileService: IFileService = req.scope.resolve("fileService")

    const preSignedUrl = await fileService.getPresignedDownloadUrl({
      key: key || "test-1653895914252.csv",
    })

    res.status(200).send({ preSignedUrl })
  } catch (err) {
    console.log(err)
    throw err
  }
}
