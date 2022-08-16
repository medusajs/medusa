import fs from "fs"

/**
 * @oas [post] /uploads
 * operationId: "PostUploads"
 * summary: "Uploads a file"
 * description: "Uploads a file to the specific fileservice that is installed in Medusa."
 * x-authenticated: true
 * tags:
 *   - Upload
 * requestBody:
 *   content:
 *     multipart/form-data:
 *       schema:
 *         type: object
 *         properties:
 *           files:
 *             type: string
 *             format: binary
 * responses:
 *   200:
 *     description: OK
 *     content:
 *       application/json:
 *         schema:
 *           properties:
 *             uploads:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   url:
 *                     type: string
 *                     description: The URL of the uploaded file.
 *                     format: uri
 */
export default async (req, res) => {
  try {
    const fileService = req.scope.resolve("fileService")

    const result = await Promise.all(
      req.files.map(async (f) => {
        return fileService.upload(f).then((result) => {
          fs.unlinkSync(f.path)
          return result
        })
      })
    )

    res.status(200).json({ uploads: result })
  } catch (err) {
    console.log(err)
    throw err
  }
}

export class IAdminPostUploadsFileReq {
  originalName: string
  path: string
}
