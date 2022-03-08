import fs from "fs"

/**
 * @oas [post] /
 * operationId: "PostUploads"
 * summary: "Uploads an array of files"
 * description: "Uploads an array of files to the specific fileservice that is installed in medusa."
 * x-authenticated: true
 * tags:
 *   - Uploads
 * responses:
 *   200:
 *     description: OK
 *     content:
 *       application/json:
 *         schema:
 *           properties:
 *             uploads
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

export class IAdminPostUploadsFile {
  originalName: string
  path: string
}
