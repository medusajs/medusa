import { IsNotEmpty, IsString } from "class-validator"

import NoteService from "../../../../services/note"
import { validator } from "../../../../utils/validator"
import { EntityManager } from "typeorm"

/**
 * @oas [post] /notes
 * operationId: "PostNotes"
 * summary: "Creates a Note"
 * description: "Creates a Note which can be associated with any resource as required."
 * x-authenticated: true
 * requestBody:
 *  content:
 *    application/json:
 *      schema:
 *        $ref: "#/components/schemas/AdminPostNotesReq"
 * x-codegen:
 *   method: create
 * x-codeSamples:
 *   - lang: JavaScript
 *     label: JS Client
 *     source: |
 *       import Medusa from "@medusajs/medusa-js"
 *       const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
 *       // must be previously logged in or use api token
 *       medusa.admin.notes.create({
 *         resource_id,
 *         resource_type: 'order',
 *         value: 'We delivered this order'
 *       })
 *       .then(({ note }) => {
 *         console.log(note.id);
 *       });
 *   - lang: Shell
 *     label: cURL
 *     source: |
 *       curl --location --request POST 'https://medusa-url.com/admin/notes' \
 *       --header 'Authorization: Bearer {api_token}' \
 *       --header 'Content-Type: application/json' \
 *       --data-raw '{
 *           "resource_id": "{resource_id}",
 *           "resource_type": "order",
 *           "value": "We delivered this order"
 *       }'
 * security:
 *   - api_token: []
 *   - cookie_auth: []
 * tags:
 *   - Note
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
 *
 */
export default async (req, res) => {
  const validated = await validator(AdminPostNotesReq, req.body)

  const userId: string = req.user.id || req.user.userId

  const noteService: NoteService = req.scope.resolve("noteService")

  const manager: EntityManager = req.scope.resolve("manager")
  const result = await manager.transaction(async (transactionManager) => {
    return await noteService.withTransaction(transactionManager).create({
      resource_id: validated.resource_id,
      resource_type: validated.resource_type,
      value: validated.value,
      author_id: userId,
    })
  })

  res.status(200).json({ note: result })
}

/**
 * @schema AdminPostNotesReq
 * type: object
 * required:
 *   - resource_id
 *   - resource_type
 *   - value
 * properties:
 *   resource_id:
 *     type: string
 *     description: The ID of the resource which the Note relates to.
 *   resource_type:
 *     type: string
 *     description: The type of resource which the Note relates to.
 *   value:
 *     type: string
 *     description: The content of the Note to create.
 */
export class AdminPostNotesReq {
  @IsString()
  @IsNotEmpty()
  resource_id: string

  @IsString()
  @IsNotEmpty()
  resource_type: string

  @IsString()
  @IsNotEmpty()
  value: string
}
