import {
  deleteProductTypesWorkflow,
  updateProductTypesWorkflow,
} from "@medusajs/core-flows"
import {
  AuthenticatedMedusaRequest,
  MedusaResponse,
} from "@medusajs/framework/http"

import { refetchProductType } from "../helpers"
import {
  AdminGetProductTypeParamsType,
  AdminUpdateProductTypeType,
} from "../validators"
import { HttpTypes } from "@medusajs/framework/types"
import { MedusaError } from "@medusajs/framework/utils"

export const GET = async (
  req: AuthenticatedMedusaRequest<AdminGetProductTypeParamsType>,
  res: MedusaResponse<HttpTypes.AdminProductTypeResponse>
) => {
  const productType = await refetchProductType(
    req.params.id,
    req.scope,
    req.remoteQueryConfig.fields
  )

  res.status(200).json({ product_type: productType })
}

export const POST = async (
  req: AuthenticatedMedusaRequest<AdminUpdateProductTypeType>,
  res: MedusaResponse<HttpTypes.AdminProductTypeResponse>
) => {
  const existingProductType = await refetchProductType(
    req.params.id,
    req.scope,
    ["id"]
  )

  if (!existingProductType) {
    throw new MedusaError(
      MedusaError.Types.NOT_FOUND,
      `Product type with id "${req.params.id}" not found`
    )
  }

  const { result } = await updateProductTypesWorkflow(req.scope).run({
    input: {
      selector: { id: req.params.id },
      update: req.validatedBody,
    },
  })

  const productType = await refetchProductType(
    result[0].id,
    req.scope,
    req.remoteQueryConfig.fields
  )

  res.status(200).json({ product_type: productType })
}

export const DELETE = async (
  req: AuthenticatedMedusaRequest,
  res: MedusaResponse<HttpTypes.AdminProductTypeDeleteResponse>
) => {
  const id = req.params.id

  await deleteProductTypesWorkflow(req.scope).run({
    input: { ids: [id] },
  })

  res.status(200).json({
    id,
    object: "product_type",
    deleted: true,
  })
}
