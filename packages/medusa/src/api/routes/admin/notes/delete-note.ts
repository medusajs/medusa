import { EntityManager } from "typeorm"
import NoteService from "../../../../services/note"

/**
 * @oas [delete] /notes/{id}
 * operationId: "DeleteNotesNote"
 * summary: "Deletes a Note"
 * description: "Deletes a Note."
 * x-authenticated: true
 * parameters:
 *   - (path) id=* {string} The ID of the Note to delete.
 * x-codeSamples:
 *   - lang: JavaScript
 *     label: JS Client
 *     source: |
 *       import Medusa from "@medusajs/medusa-js"
 *       const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
 *       // must be previously logged in
 *       medusa.admin.notes.delete(note_id)
 *   - lang: Shell
 *     label: cURL
 *     source: |
 *       curl --location --request DELETE 'localhost:9000/admin/notes/{id}' \
 *       --header 'Authorization: Bearer {api_token}'
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
 *               description: The ID of the deleted Note.
 *             object:
 *               type: string
 *               description: The type of the object that was deleted.
 *               default: note
 *             deleted:
 *               type: boolean
 *               description: Whether or not the Note was deleted.
 *               default: true
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
