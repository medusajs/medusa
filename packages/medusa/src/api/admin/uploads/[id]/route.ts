import {
  AuthenticatedMedusaRequest,
  MedusaResponse,
} from "../../../../types/routing"
import { deleteFilesWorkflow } from "@medusajs/core-flows"
import { HttpTypes } from "@medusajs/types"
import { ContainerRegistrationKeys, MedusaError } from "@medusajs/utils"

export const GET = async (
  req: AuthenticatedMedusaRequest,
  res: MedusaResponse<HttpTypes.AdminFileResponse>
) => {
  const query = req.scope.resolve(ContainerRegistrationKeys.QUERY)
  const variables = { id: req.params.id }

  const {
    data: [file],
  } = await query.graph({
    entryPoint: "file",
    variables,
    fields: req.remoteQueryConfig.fields,
  })

  if (!file) {
    throw new MedusaError(
      MedusaError.Types.NOT_FOUND,
      `File with id: ${req.params.id} not found`
    )
  }

  res.status(200).json({ file })
}

export const DELETE = async (
  req: AuthenticatedMedusaRequest,
  res: MedusaResponse<HttpTypes.AdminFileDeleteResponse>
) => {
  const id = req.params.id

  await deleteFilesWorkflow(req.scope).run({
    input: { ids: [id] },
  })

  res.status(200).json({
    id,
    object: "file",
    deleted: true,
  })
}
