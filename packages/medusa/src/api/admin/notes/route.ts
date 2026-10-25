import {
  AuthenticatedMedusaRequest,
  MedusaResponse,
  refetchEntities,
  refetchEntity,
} from "@medusajs/framework/http"
import { NoteDTO } from "@medusajs/framework/types"
import { createNoteWorkflow } from "@medusajs/core-flows"
import { AdminCreateNoteType, AdminGetNotesParamsType } from "./validators"

export const GET = async (
  req: AuthenticatedMedusaRequest<AdminGetNotesParamsType>,
  res: MedusaResponse<{
    notes: NoteDTO[]
    count: number
    offset: number
    limit: number
  }>
) => {
  const { data: notes, metadata } = await refetchEntities({
    entity: "note",
    idOrFilter: req.filterableFields,
    scope: req.scope,
    fields: req.queryConfig.fields,
    pagination: req.queryConfig.pagination,
  })

  res.json({
    notes: notes as NoteDTO[],
    count: metadata.count,
    offset: metadata.skip,
    limit: metadata.take,
  })
}

export const POST = async (
  req: AuthenticatedMedusaRequest<AdminCreateNoteType>,
  res: MedusaResponse<{ note: NoteDTO }>
) => {
  const { result } = await createNoteWorkflow(req.scope).run({
    input: {
      ...req.validatedBody,
      author_id: req.auth_context.actor_id,
    },
  })

  const note = await refetchEntity({
    entity: "note",
    idOrFilter: result.id,
    scope: req.scope,
    fields: req.queryConfig.fields,
  })

  res.status(200).json({ note: note as NoteDTO })
}
