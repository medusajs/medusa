import { MedusaError, Validator } from "medusa-core-utils"

/**
 * @oas [post] /notes
 * operationId: "PostNotes"
 * summary: "Creates a Note"
 * description: "Creates a Note which can be associated with any resource as required."
 * requestBody:
 *  content:
 *    application/json:
 *      schema:
 *        properties:
 *          resource_id:
 *            type: string
 *            description: The id of the resource which the Note relates to.
 *          resource_type:
 *            type: string
 *            description: The type of resource which the Note relates to.
 *          value:
 *            type: string
 *            description: The content of the Note to create.
 * tags:
 *   - Note
 * responses:
 *   200:
 *     description: OK
 *     content:
 *       application/json:
 *         schema:
 *           properties:
 *             note:
 *               $ref: "#/components/schemas/note"
 *
 */
export default async (req, res) => {
  const schema = Validator.object().keys({
    resource_id: Validator.string(),
    resource_type: Validator.string(),
    value: Validator.string(),
  })

  const userId = req.user.id || req.user.userId

  const { value, error } = schema.validate(req.body)
  if (error) {
    throw new MedusaError(MedusaError.Types.INVALID_DATA, error.details)
  }

  const noteService = req.scope.resolve("noteService")

  const result = await noteService.create({
    resource_id: value.resource_id,
    resource_type: value.resource_type,
    value: value.value,
    author_id: userId,
  })

  res.status(200).json({ note: result })
}
