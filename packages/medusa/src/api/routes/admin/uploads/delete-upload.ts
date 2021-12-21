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

    await fileService.delete(req.body.file)

    res.status(200).send({ id: "", object: "file", deleted: true })
  } catch (err) {
    console.log(err)
    throw err
  }
}
