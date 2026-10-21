import { deleteNoteWorkflow } from "@medusajs/core-flows"
import {
  AuthenticatedMedusaRequest,
  MedusaResponse,
} from "@medusajs/framework/http"

export const DELETE = async (
  req: AuthenticatedMedusaRequest,
  res: MedusaResponse<{ id: string; object: "note"; deleted: boolean }>
) => {
  const { id } = req.params

  await deleteNoteWorkflow(req.scope).run({
    input: { id },
  })

  res.status(200).json({
    id,
    object: "note",
    deleted: true,
  })
}
