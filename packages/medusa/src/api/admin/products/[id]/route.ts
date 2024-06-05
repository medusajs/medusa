import {
  deleteProductsWorkflow,
  updateProductsWorkflow,
} from "@medusajs/core-flows"
import {
  AuthenticatedMedusaRequest,
  MedusaResponse,
} from "../../../../types/routing"

import { UpdateProductDTO } from "@medusajs/types"
import {
  ContainerRegistrationKeys,
  remoteQueryObjectFromString,
} from "@medusajs/utils"
import {
  refetchProduct,
  remapKeysForProduct,
  remapProductResponse,
} from "../helpers"
import { AdminUpdateProductType } from "../validators"
import { MedusaError } from "@medusajs/utils"

export const GET = async (
  req: AuthenticatedMedusaRequest,
  res: MedusaResponse
) => {
  const remoteQuery = req.scope.resolve(ContainerRegistrationKeys.REMOTE_QUERY)

  const variables = { id: req.params.id }

  const selectFields = remapKeysForProduct(req.remoteQueryConfig.fields ?? [])
  const queryObject = remoteQueryObjectFromString({
    entryPoint: "product",
    variables,
    fields: selectFields,
  })

  const [product] = await remoteQuery(queryObject)
  if (!product) {
    throw new MedusaError(MedusaError.Types.NOT_FOUND, "Product not found")
  }

  res.status(200).json({ product: remapProductResponse(product) })
}

export const POST = async (
  req: AuthenticatedMedusaRequest<AdminUpdateProductType>,
  res: MedusaResponse
) => {
  const { result } = await updateProductsWorkflow(req.scope).run({
    input: {
      selector: { id: req.params.id },
      update: req.validatedBody as UpdateProductDTO,
    },
  })

  const product = await refetchProduct(
    result[0].id,
    req.scope,
    req.remoteQueryConfig.fields
  )
  res.status(200).json({ product: remapProductResponse(product) })
}

export const DELETE = async (
  req: AuthenticatedMedusaRequest,
  res: MedusaResponse
) => {
  const id = req.params.id

  await deleteProductsWorkflow(req.scope).run({
    input: { ids: [id] },
  })

  res.status(200).json({
    id,
    object: "product",
    deleted: true,
  })
}
