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
    const fileService = req.scope.resolve("fileService")

    const preSignedUrl = await fileService.generatePresignedDownloadUrl({
      key: "test-1653490321530.csv",
    })

    res.status(200).send({ preSignedUrl })
  } catch (err) {
    console.log(err)
    throw err
  }
}
