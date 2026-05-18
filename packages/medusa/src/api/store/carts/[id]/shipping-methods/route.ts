import { addShippingMethodToCartWorkflow } from "@medusajs/core-flows"
import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { AdditionalData, HttpTypes } from "@medusajs/framework/types"
import { refetchCart } from "../../helpers"

export const POST = async (
  req: MedusaRequest<
    HttpTypes.StoreAddCartShippingMethods & AdditionalData,
    HttpTypes.SelectParams
  >,
  res: MedusaResponse<HttpTypes.StoreCartResponse>
) => {
  const payload = req.validatedBody

  const isMulti = "option_ids" in payload && Array.isArray(payload.option_ids)
  const optionIds: string[] = isMulti
    ? (payload as { option_ids: string[] }).option_ids
    : [(payload as { option_id: string }).option_id]
  const dataPerOption = (idx: number) => {
    if (!isMulti || !Array.isArray(payload.data)) {
      return payload.data
    }
    return (payload.data as Record<string, unknown>[])[idx]
  }

  await addShippingMethodToCartWorkflow(req.scope).run({
    input: {
      options: optionIds.map((id, idx) => ({ id, data: dataPerOption(idx) })),
      cart_id: req.params.id,
      additional_data: payload.additional_data,
    },
  })

  const cart = await refetchCart(
    req.params.id,
    req.scope,
    req.queryConfig.fields
  )

  res.status(200).json({ cart })
}
