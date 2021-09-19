/**
 * @oas [get] /notes/resource/{resource_id}
 * operationId: "GetNotesResourceResource"
 * summary: "List Notes"
 * description: "Retrieves all notes related to a resource_id"
 * parameters:
 *   - (path) resource_id=* {string} The id of the resource to retrieve Notes associated with.
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
  const { resource_id } = req.params

  try {
    const limit = parseInt(req.query.limit) || 50
    const offset = parseInt(req.query.offset) || 0

    const noteService = req.scope.resolve("noteService")
    const notes = await noteService.listByResource(resource_id, {
      take: limit,
      skip: offset,
      relations: ["author"],
    })

    res.status(200).json({ notes })
  } catch (err) {
    throw err
  }
}
