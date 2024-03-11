import {
  AuthenticatedMedusaRequest,
  MedusaResponse,
} from "../../../../../../types/routing"
import {
  deleteProductOptionsWorkflow,
  updateProductOptionsWorkflow,
} from "@medusajs/core-flows"

import { UpdateProductDTO } from "@medusajs/types"
import { remoteQueryObjectFromString } from "@medusajs/utils"
import { UpdateProductOptionDTO } from "../../../../../../../../types/dist"

export const GET = async (
  req: AuthenticatedMedusaRequest,
  res: MedusaResponse
) => {
  const remoteQuery = req.scope.resolve("remoteQuery")

  // TODO: Should we allow fetching a option without knowing the product ID? In such case we'll need to change the route to /admin/products/options/:id
  const productId = req.params.id
  const optionId = req.params.option_id

  const variables = { id: optionId, product_id: productId }

  const queryObject = remoteQueryObjectFromString({
    entryPoint: "product_option",
    variables,
    fields: req.retrieveConfig.select as string[],
  })

  const [product_option] = await remoteQuery(queryObject)
  res.status(200).json({ product_option })
}

export const POST = async (
  req: AuthenticatedMedusaRequest<UpdateProductOptionDTO>,
  res: MedusaResponse
) => {
  // TODO: Should we allow fetching a option without knowing the product ID? In such case we'll need to change the route to /admin/products/options/:id
  const productId = req.params.id
  const optionId = req.params.option_id

  const { result, errors } = await updateProductOptionsWorkflow(req.scope).run({
    input: {
      selector: { id: optionId, product_id: productId },
      update: req.validatedBody,
    },
    throwOnError: false,
  })

  if (Array.isArray(errors) && errors[0]) {
    throw errors[0].error
  }

  res.status(200).json({ product_option: result[0] })
}

export const DELETE = async (
  req: AuthenticatedMedusaRequest,
  res: MedusaResponse
) => {
  // TODO: Should we allow fetching a option without knowing the product ID? In such case we'll need to change the route to /admin/products/options/:id
  const productId = req.params.id
  const optionId = req.params.option_id

  // TODO: I believe here we cannot even enforce the product ID based on the standard API we provide?
  const { errors } = await deleteProductOptionsWorkflow(req.scope).run({
    input: { ids: [optionId] /* product_id: productId */ },
    throwOnError: false,
  })

  if (Array.isArray(errors) && errors[0]) {
    throw errors[0].error
  }

  res.status(200).json({
    id: optionId,
    object: "product_option",
    deleted: true,
  })
}
