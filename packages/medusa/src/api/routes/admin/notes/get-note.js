/**
 * @oas [get] /notes/{id}
 * operationId: "GetNoteNote"
 * summary: "Get Note"
 * description: "Retrieves a single note using its id"
 * parameters:
 *   - (path) id=* {string} The id of the note to retrieve.
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
 */
export default async (req, res) => {
  const { id } = req.params

  try {
    const noteService = req.scope.resolve("noteService")
    const note = await noteService.retrieve(id, { relations: ["author"] })

    res.status(200).json({ note })
  } catch (err) {
    throw err
  }
}
