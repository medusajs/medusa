import { addToCartWorkflowId } from "@zjedene-medusa/core-flows"
import { MedusaRequest, MedusaResponse } from "@zjedene-medusa/framework/http"
import { HttpTypes } from "@zjedene-medusa/framework/types"
import { AdditionalData } from "@zjedene-medusa/types"
import { Modules } from "@zjedene-medusa/utils"
import { refetchCart } from "../../helpers"

export const POST = async (
  req: MedusaRequest<
    HttpTypes.StoreAddCartLineItem & AdditionalData,
    HttpTypes.SelectParams
  >,
  res: MedusaResponse<HttpTypes.StoreCartResponse>
) => {
  const we = req.scope.resolve(Modules.WORKFLOW_ENGINE)
  await we.run(addToCartWorkflowId, {
    input: {
      cart_id: req.params.id,
      items: [req.validatedBody],
      additional_data: req.validatedBody.additional_data,
    },
  })

  const cart = await refetchCart(
    req.params.id,
    req.scope,
    req.queryConfig.fields
  )

  res.status(200).json({ cart })
}
