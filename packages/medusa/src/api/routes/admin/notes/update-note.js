import { MedusaError, Validator } from "medusa-core-utils"

/**
 * @oas [post] /notes/{id}
 * operationId: "PostNotesNote"
 * summary: "Updates a Note"
 * description: "Updates a Note associated with some resource"
 * parameters:
 *   - (path) id=* {string} The id of the Note to update
 * requestBody:
 *  content:
 *    application/json:
 *      schema:
 *        properties:
 *          value:
 *            type: string
 *            description: The updated description of the Note.
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
  const { id } = req.params

  const schema = Validator.object().keys({
    value: Validator.string(),
  })

  const { value, error } = schema.validate(req.body)
  if (error) {
    throw new MedusaError(MedusaError.Types.INVALID_DATA, error.details)
  }

  try {
    const noteService = req.scope.resolve("noteService")
    const result = await noteService.update(id, value.value)

    res.status(200).json({ note: result })
  } catch (err) {
    throw err
  }
}
