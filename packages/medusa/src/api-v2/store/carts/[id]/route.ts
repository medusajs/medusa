import { updateCartsWorkflow } from "@medusajs/core-flows"
import { ModuleRegistrationName } from "@medusajs/modules-sdk"
import { ICartModuleService, UpdateCartDataDTO } from "@medusajs/types"
import { MedusaRequest, MedusaResponse } from "../../../../types/routing"

export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
  const cartModuleService: ICartModuleService = req.scope.resolve(
    ModuleRegistrationName.CART
  )

  // TODO: Replace with remoteQuery
  const cart = await cartModuleService.retrieve(req.params.id, {
    select: req.retrieveConfig.select,
    relations: req.retrieveConfig.relations,
  })

  // const remoteQuery = req.scope.resolve("remoteQuery")

  // const variables = { id: req.params.id }

  // const query = {
  //   cart: {
  //     __args: variables,
  //     ...defaultStoreCartRemoteQueryObject,
  //   },
  // }

  // const [cart] = await remoteQuery(query)

  res.json({ cart })
}

export const POST = async (req: MedusaRequest, res: MedusaResponse) => {
  const updateCartWorkflow = updateCartsWorkflow(req.scope)

  const workflowInput = {
    selector: { id: req.params.id },
    update: req.validatedBody as UpdateCartDataDTO,
  }

  const { result, errors } = await updateCartWorkflow.run({
    input: workflowInput,
    throwOnError: false,
  })

  if (Array.isArray(errors) && errors[0]) {
    throw errors[0].error
  }

  res.status(200).json({ cart: result[0] })
}
