import {
  AuthenticatedMedusaRequest,
  MedusaResponse,
} from "../../../../../../types/routing"
import {
  deleteProductOptionsWorkflow,
  updateProductOptionsWorkflow,
} from "@medusajs/core-flows"

import {
  ContainerRegistrationKeys,
  remoteQueryObjectFromString,
} from "@medusajs/utils"
import { refetchProduct, remapProductResponse } from "../../../helpers"
import { AdminUpdateProductOptionType } from "../../../validators"

export const GET = async (
  req: AuthenticatedMedusaRequest,
  res: MedusaResponse
) => {
  const remoteQuery = req.scope.resolve(ContainerRegistrationKeys.REMOTE_QUERY)

  const productId = req.params.id
  const optionId = req.params.option_id

  const variables = { id: optionId, product_id: productId }

  const queryObject = remoteQueryObjectFromString({
    entryPoint: "product_option",
    variables,
    fields: req.remoteQueryConfig.fields,
  })

  const [product_option] = await remoteQuery(queryObject)
  res.status(200).json({ product_option })
}

export const POST = async (
  req: AuthenticatedMedusaRequest<AdminUpdateProductOptionType>,
  res: MedusaResponse
) => {
  const productId = req.params.id
  const optionId = req.params.option_id

  const { errors } = await updateProductOptionsWorkflow(req.scope).run({
    input: {
      selector: { id: optionId, product_id: productId },
      update: req.validatedBody,
    },
    throwOnError: false,
  })

  if (Array.isArray(errors) && errors[0]) {
    throw errors[0].error
  }

  const product = await refetchProduct(
    productId,
    req.scope,
    req.remoteQueryConfig.fields
  )
  res.status(200).json({ product: remapProductResponse(product) })
}

export const DELETE = async (
  req: AuthenticatedMedusaRequest,
  res: MedusaResponse
) => {
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

  const product = await refetchProduct(
    productId,
    req.scope,
    req.remoteQueryConfig.fields
  )

  res.status(200).json({
    id: optionId,
    object: "product_option",
    deleted: true,
    parent: product,
  })
}
