import { IsNumber, IsOptional, IsString } from "class-validator"
import NoteService from "../../../../services/note"
import { validator } from "../../../../utils/validator"
import { selector } from "../../../../types/note"
import { Type } from "class-transformer"
/**
 * @oas [get] /notes
 * operationId: "GetNotes"
 * summary: "List Notes"
 * x-authenticated: true
 * description: "Retrieves a list of notes"
 *  * parameters:
 *   - (path) limit= {number} The number of notes to get
 *   - (path) offset= {number} The offset at which to get notes
 *   - (path) resource_id= {string} The id which the notes belongs to
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
