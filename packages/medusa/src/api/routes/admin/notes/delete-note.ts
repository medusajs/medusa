import NoteService from "../../../../services/note"
import { EntityManager } from "typeorm"

/**
 * @oas [delete] /notes/{id}
 * operationId: "DeleteNotesNote"
 * summary: "Deletes a Note"
 * description: "Deletes a Note."
 * x-authenticated: true
 * parameters:
 *   - (path) id=* {string} The id of the Note to delete.
 * tags:
 *   - Note
 * responses:
 *   200:
 *     description: OK
 *     content:
 *       application/json:
 *         schema:
 *           properties:
 *             id:
 *               type: string
 *               description: The id of the deleted Note.
 *             deleted:
 *               type: boolean
 *               description: Whether or not the Note was deleted.
 */
export default async (req, res) => {
  const { id } = req.params

  const noteService: NoteService = req.scope.resolve("noteService")
  const manager: EntityManager = req.scope.resolve("manager")
  await manager.transaction(async (transactionManager) => {
    return await noteService.withTransaction(transactionManager).delete(id)
  })

  res.status(200).json({ id, object: "note", deleted: true })
}
