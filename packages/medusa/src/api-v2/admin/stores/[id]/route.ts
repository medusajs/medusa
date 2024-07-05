import { updateStoresWorkflow } from "@medusajs/core-flows"
import { UpdateStoreDTO } from "@medusajs/types"
import {
  remoteQueryObjectFromString,
  ContainerRegistrationKeys,
} from "@medusajs/utils"
import {
  AuthenticatedMedusaRequest,
  MedusaResponse,
} from "../../../../types/routing"
import { AdminGetStoreParamsType, AdminUpdateStoreType } from "../validators"
import { refetchStore } from "../helpers"

export const GET = async (
  req: AuthenticatedMedusaRequest<AdminGetStoreParamsType>,
  res: MedusaResponse
) => {
  const remoteQuery = req.scope.resolve(ContainerRegistrationKeys.REMOTE_QUERY)
  const variables = { id: req.params.id }

  const queryObject = remoteQueryObjectFromString({
    entryPoint: "store",
    variables,
    fields: req.remoteQueryConfig.fields,
  })

  const [store] = await remoteQuery(queryObject)
  res.status(200).json({ store })
}

export const POST = async (
  req: AuthenticatedMedusaRequest<AdminUpdateStoreType>,
  res: MedusaResponse
) => {
  const { result, errors } = await updateStoresWorkflow(req.scope).run({
    input: {
      selector: { id: req.params.id },
      update: req.validatedBody as UpdateStoreDTO,
    },
    throwOnError: false,
  })

  if (Array.isArray(errors) && errors[0]) {
    throw errors[0].error
  }

  const store = await refetchStore(
    result[0].id,
    req.scope,
    req.remoteQueryConfig.fields
  )

  res.status(200).json({ store })
}
