import { IsString } from "class-validator"
import NoteService from "../../../../services/note"
import { validator } from "../../../../utils/validator"
import { EntityManager } from "typeorm"

/**
 * @oas [post] /admin/notes/{id}
 * operationId: "PostNotesNote"
 * summary: "Update a Note"
 * x-authenticated: true
 * description: "Update a Note's details."
 * parameters:
 *   - (path) id=* {string} The ID of the Note
 * requestBody:
 *  content:
 *    application/json:
 *      schema:
 *        $ref: "#/components/schemas/AdminPostNotesNoteReq"
 * x-codegen:
 *   method: update
 * x-codeSamples:
 *   - lang: JavaScript
 *     label: JS Client
 *     source: |
 *       import Medusa from "@medusajs/medusa-js"
 *       const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
 *       // must be previously logged in or use api token
 *       medusa.admin.notes.update(noteId, {
 *        value: "We delivered this order"
 *       })
 *       .then(({ note }) => {
 *         console.log(note.id);
 *       })
 *   - lang: Shell
 *     label: cURL
 *     source: |
 *       curl -X POST '{backend_url}/admin/notes/{id}' \
 *       -H 'x-medusa-access-token: {api_token}' \
 *       -H 'Content-Type: application/json' \
 *       --data-raw '{
 *           "value": "We delivered this order"
 *       }'
 * security:
 *   - api_token: []
 *   - cookie_auth: []
 *   - jwt_token: []
 * tags:
 *   - Notes
 * responses:
 *   200:
 *     description: OK
 *     content:
 *       application/json:
 *         schema:
 *           $ref: "#/components/schemas/AdminNotesRes"
 *   "400":
 *     $ref: "#/components/responses/400_error"
 *   "401":
 *     $ref: "#/components/responses/unauthorized"
 *   "404":
 *     $ref: "#/components/responses/not_found_error"
 *   "409":
 *     $ref: "#/components/responses/invalid_state_error"
 *   "422":
 *     $ref: "#/components/responses/invalid_request_error"
 *   "500":
 *     $ref: "#/components/responses/500_error"
 */
export default async (req, res) => {
  const { id } = req.params

  const validated = await validator(AdminPostNotesNoteReq, req.body)

  const noteService: NoteService = req.scope.resolve("noteService")
  const manager: EntityManager = req.scope.resolve("manager")
  const note = await manager.transaction(async (transactionManager) => {
    return await noteService
      .withTransaction(transactionManager)
      .update(id, validated.value)
  })

  res.status(200).json({ note })
}

/**
 * @schema AdminPostNotesNoteReq
 * type: object
 * required:
 *   - value
 * properties:
 *   value:
 *     type: string
 *     description: The description of the Note.
 */
export class AdminPostNotesNoteReq {
  @IsString()
  value: string
}
