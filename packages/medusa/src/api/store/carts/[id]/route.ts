import { updateCartWorkflowId } from "@medusajs/core-flows"
import { AdditionalData, HttpTypes } from "@medusajs/framework/types"
import { MedusaResponse, MedusaStoreRequest } from "@medusajs/framework/http"
import { Modules } from "@medusajs/framework/utils"
import { refetchCart } from "../helpers"

export const GET = async (
  req: MedusaStoreRequest<HttpTypes.StoreGetCartsCart>,
  res: MedusaResponse<HttpTypes.StoreCartResponse>
) => {
  const cart = await refetchCart(
    req.params.id,
    req.scope,
    req.queryConfig.fields,
    req
  )

  res.json({ cart })
}

export const POST = async (
  req: MedusaStoreRequest<
    HttpTypes.StoreUpdateCart & AdditionalData,
    HttpTypes.SelectParams
  >,
  res: MedusaResponse<HttpTypes.StoreCartResponse>
) => {
  const we = req.scope.resolve(Modules.WORKFLOW_ENGINE)

  await we.run(updateCartWorkflowId, {
    input: {
      ...req.validatedBody,
      id: req.params.id,
      additional_data: req.validatedBody.additional_data,
    },
  })

  const cart = await refetchCart(
    req.params.id,
    req.scope,
    req.queryConfig.fields,
    req
  )

  res.status(200).json({ cart })
}
