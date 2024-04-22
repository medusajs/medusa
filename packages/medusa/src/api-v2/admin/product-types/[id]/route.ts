import {
  deleteProductTypesWorkflow,
  updateProductTypesWorkflow,
} from "@medusajs/core-flows"
import {
  AuthenticatedMedusaRequest,
  MedusaResponse,
} from "../../../../types/routing"

import { refetchProductType } from "../helpers"
import {
  AdminGetProductTypeParamsType,
  AdminUpdateProductTypeType,
} from "../validators"

export const GET = async (
  req: AuthenticatedMedusaRequest<AdminGetProductTypeParamsType>,
  res: MedusaResponse
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
  res: MedusaResponse
) => {
  const { result, errors } = await updateProductTypesWorkflow(req.scope).run({
    input: {
      selector: { id: req.params.id },
      update: req.validatedBody,
    },
    throwOnError: false,
  })

  if (Array.isArray(errors) && errors[0]) {
    throw errors[0].error
  }

  const productType = await refetchProductType(
    result[0].id,
    req.scope,
    req.remoteQueryConfig.fields
  )

  res.status(200).json({ product_type: productType })
}

export const DELETE = async (
  req: AuthenticatedMedusaRequest,
  res: MedusaResponse
) => {
  const id = req.params.id

  const { errors } = await deleteProductTypesWorkflow(req.scope).run({
    input: { ids: [id] },
    throwOnError: false,
  })

  if (Array.isArray(errors) && errors[0]) {
    throw errors[0].error
  }

  res.status(200).json({
    id,
    object: "product_type",
    deleted: true,
  })
}
