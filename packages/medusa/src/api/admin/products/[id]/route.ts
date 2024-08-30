import {
  deleteProductsWorkflow,
  updateProductsWorkflow,
} from "@medusajs/core-flows"
import {
  AuthenticatedMedusaRequest,
  MedusaResponse,
} from "../../../../types/routing"
import { remapKeysForProduct, remapProductResponse } from "../helpers"
import { MedusaError } from "@medusajs/utils"
import { AdditionalData, HttpTypes } from "@medusajs/types"
import { refetchEntity } from "../../../utils/refetch-entity"

export const GET = async (
  req: AuthenticatedMedusaRequest,
  res: MedusaResponse<HttpTypes.AdminProductResponse>
) => {
  const selectFields = remapKeysForProduct(req.remoteQueryConfig.fields ?? [])
  const product = await refetchEntity(
    "product",
    req.params.id,
    req.scope,
    selectFields
  )

  if (!product) {
    throw new MedusaError(MedusaError.Types.NOT_FOUND, "Product not found")
  }

  res.status(200).json({ product: remapProductResponse(product) })
}

export const POST = async (
  req: AuthenticatedMedusaRequest<
    HttpTypes.AdminUpdateProduct & AdditionalData
  >,
  res: MedusaResponse<HttpTypes.AdminProductResponse>
) => {
  const { additional_data, ...update } = req.validatedBody

  /**
   * Check 1
   *
   * Check if the product exists with the id or not before calling the workflow.
   * Please look at the Check 2 as well. If we have Check 2, then do we need
   * Check 1?
   */
  if (!(await refetchEntity("product", req.params.id, req.scope, ["id"]))) {
    throw new MedusaError(MedusaError.Types.NOT_FOUND, "Product not found")
  }

  const { result } = await updateProductsWorkflow(req.scope).run({
    input: {
      selector: { id: req.params.id },
      update,
      additional_data,
    },
  })

  /**
   * Check 2
   *
   * In order to prevent ourselves from reading the `results[0].id`, we
   * should first check if the workflow returned an array with items
   * or not.
   *
   * If not, should we consider that the product was not found? Or
   * how do we handle this case.
   */
  if (!result.length) {
    throw new MedusaError(MedusaError.Types.NOT_FOUND, "Product not found")
  }

  const product = await refetchEntity(
    "product",
    result[0].id,
    req.scope,
    remapKeysForProduct(req.remoteQueryConfig.fields ?? [])
  )

  res.status(200).json({ product: remapProductResponse(product) })
}

export const DELETE = async (
  req: AuthenticatedMedusaRequest,
  res: MedusaResponse<HttpTypes.AdminProductDeleteResponse>
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
