/**
 * @oas [get] /notes
 * operationId: "GetNotes"
 * summary: "List Notes"
 * description: "Retrieves a list of notes"
 * tags:
 *   - Note
 * responses:
 *   200:
 *     description: OK
 *     content:
 *       application/json:
 *         schema:
 *           properties:
 *             notes:
 *               type: array
 *               items:
 *                 $ref: "#/components/schemas/note"
 */
export default async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 50
    const offset = parseInt(req.query.offset) || 0

    const selector = {}

    if ("resource_id" in req.query) {
      selector.resource_id = req.query.resource_id
    }

    const noteService = req.scope.resolve("noteService")
    const notes = await noteService.list(selector, {
      take: limit,
      skip: offset,
      relations: ["author"],
    })

    res.status(200).json({ notes })
  } catch (err) {
    throw err
  }
}
