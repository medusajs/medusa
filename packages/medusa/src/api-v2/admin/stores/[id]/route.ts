import { updateStoresWorkflow } from "@medusajs/core-flows"
import { UpdateStoreDTO } from "@medusajs/types"
import { remoteQueryObjectFromString } from "@medusajs/utils"
import { MedusaRequest, MedusaResponse } from "../../../../types/routing"
import { defaultAdminStoreFields } from "../query-config"

export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
  const remoteQuery = req.scope.resolve("remoteQuery")

  const variables = { id: req.params.id }

  const queryObject = remoteQueryObjectFromString({
    entryPoint: "store",
    variables,
    fields: defaultAdminStoreFields,
  })

  const [store] = await remoteQuery(queryObject)
  res.status(200).json({ store })
}

export const POST = async (req: MedusaRequest, res: MedusaResponse) => {
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

  res.status(200).json({ store: result[0] })
}
