import { updateStoresWorkflow } from "@medusajs/core-flows"
import { ContainerRegistrationKeys, MedusaError } from "@medusajs/utils"
import {
  AuthenticatedMedusaRequest,
  MedusaResponse,
} from "../../../../types/routing"
import { AdminGetStoreParamsType, AdminUpdateStoreType } from "../validators"
import { refetchStore } from "../helpers"
import { HttpTypes } from "@medusajs/types"

export const GET = async (
  req: AuthenticatedMedusaRequest<AdminGetStoreParamsType>,
  res: MedusaResponse<HttpTypes.AdminStoreResponse>
) => {
  const query = req.scope.resolve(ContainerRegistrationKeys.QUERY)
  const variables = { id: req.params.id }

  const {
    data: [store],
  } = await query.graph({
    entryPoint: "store",
    variables,
    fields: req.remoteQueryConfig.fields,
  })

  res.status(200).json({ store })
}

export const POST = async (
  req: AuthenticatedMedusaRequest<AdminUpdateStoreType>,
  res: MedusaResponse<HttpTypes.AdminStoreResponse>
) => {
  const existingStore = await refetchStore(req.params.id, req.scope, ["id"])
  if (!existingStore) {
    throw new MedusaError(
      MedusaError.Types.NOT_FOUND,
      `Store with id "${req.params.id}" not found`
    )
  }

  const { result } = await updateStoresWorkflow(req.scope).run({
    input: {
      selector: { id: req.params.id },
      update: req.validatedBody,
    },
  })

  const store = await refetchStore(
    result[0].id,
    req.scope,
    req.remoteQueryConfig.fields
  )

  res.status(200).json({ store })
}
