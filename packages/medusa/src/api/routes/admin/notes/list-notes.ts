import { IsNumber, IsOptional, IsString } from "class-validator"

import NoteService from "../../../../services/note"
import { Type } from "class-transformer"
import { selector } from "../../../../types/note"
import { validator } from "../../../../utils/validator"

/**
 * @oas [get] /notes
 * operationId: "GetNotes"
 * summary: "List Notes"
 * x-authenticated: true
 * description: "Retrieves a list of notes"
 * parameters:
 *   - (query) limit=50 {number} The number of notes to get
 *   - (query) offset=0 {number} The offset at which to get notes
 *   - (query) resource_id {string} The ID which the notes belongs to
 * x-codegen:
 *   method: list
 *   queryParams: AdminGetNotesParams
 * x-codeSamples:
 *   - lang: JavaScript
 *     label: JS Client
 *     source: |
 *       import Medusa from "@medusajs/medusa-js"
 *       const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
 *       // must be previously logged in or use api token
 *       medusa.admin.notes.list()
 *       .then(({ notes, limit, offset, count }) => {
 *         console.log(notes.length);
 *       });
 *   - lang: Shell
 *     label: cURL
 *     source: |
 *       curl --location --request GET 'https://medusa-url.com/admin/notes' \
 *       --header 'Authorization: Bearer {api_token}'
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
 *           $ref: "#/components/schemas/AdminNotesListRes"
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
  const validated = await validator(AdminGetNotesParams, req.query)

  const selector: selector = {}

  if (validated.resource_id) {
    selector.resource_id = validated.resource_id
  }

  const noteService: NoteService = req.scope.resolve("noteService")
  const notes = await noteService.list(selector, {
    take: validated.limit,
    skip: validated.offset,
    relations: ["author"],
  })

  res.status(200).json({
    notes,
    count: notes.length,
    offset: validated.offset,
    limit: validated.limit,
  })
}

export class AdminGetNotesParams {
  @IsString()
  @IsOptional()
  resource_id?: string

  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  limit = 50

  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  offset = 0
}
