import { IsString } from "class-validator"

/**
 * [delete] /uploads
 * operationId: "AdminDeleteUploads"
 * summary: "Removes an uploaded file"
 * description: "Removes an uploaded file using the installed fileservice"
 * x-authenticated: true
 * requestBody:
 *   content:
 *     application/json:
 *       schema:
 *         required:
 *           - file_key
 *         properties:
 *           file_key:
 *             description: "key of the file to delete"
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
 *             id:
 *               type: string
 *               description: The file key of the upload deleted
 *             object:
 *               type: string
 *               description: The type of the object that was deleted.
 *               default: file
 *             deleted:
 *               type: boolean
 *               description: Whether or not the items were deleted.
 *               default: true
 */
export default async (req, res) => {
  const validated = req.validatedBody as AdminDeleteUploadsReq

  const fileService = req.scope.resolve("fileService")

  await fileService.delete(validated)

  res
    .status(200)
    .send({ id: validated.file_key, object: "file", deleted: true })
}

export class AdminDeleteUploadsReq {
  @IsString()
  file_key: string
}
