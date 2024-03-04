import {
  AuthenticatedMedusaRequest,
  MedusaResponse,
} from "../../../../types/routing"
import {
  deleteProductWorkflow,
  updateProductsWorkflow,
} from "@medusajs/core-flows"

import { UpdateProductDTO } from "@medusajs/types"
import { defaultAdminProductFields } from "../query-config"
import { remoteQueryObjectFromString } from "@medusajs/utils"

export const GET = async (
  req: AuthenticatedMedusaRequest,
  res: MedusaResponse
) => {
  const remoteQuery = req.scope.resolve("remoteQuery")

  const variables = { id: req.params.id }

  const queryObject = remoteQueryObjectFromString({
    entryPoint: "product",
    variables,
    fields: defaultAdminProductFields,
  })

  const [product] = await remoteQuery(queryObject)

  res.status(200).json({ product })
}

export const POST = async (
  req: AuthenticatedMedusaRequest<UpdateProductDTO>,
  res: MedusaResponse
) => {
  const { result, errors } = await updateProductsWorkflow(req.scope).run({
    input: {
      selector: { id: req.params.id },
      update: req.validatedBody,
    },
    throwOnError: false,
  })

  if (Array.isArray(errors) && errors[0]) {
    throw errors[0].error
  }

  res.status(200).json({ product: result[0] })
}

export const DELETE = async (
  req: AuthenticatedMedusaRequest,
  res: MedusaResponse
) => {
  const id = req.params.id

  const { errors } = await deleteProductWorkflow(req.scope).run({
    input: { ids: [id] },
    throwOnError: false,
  })

  if (Array.isArray(errors) && errors[0]) {
    throw errors[0].error
  }

  res.status(200).json({
    id,
    object: "product",
    deleted: true,
  })
}
