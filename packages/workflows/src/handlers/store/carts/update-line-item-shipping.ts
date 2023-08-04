import { WorkflowTypes } from "@medusajs/types"
import { WorkflowArguments } from "../../../helper"

type UpdateLineItemsShippingInputData =
  WorkflowTypes.CartTypes.EnsureCorrectLineItemShippingDTO

export async function ensureCorrectLineItemShipping({
  container,
  context,
  data,
}: WorkflowArguments<{ lineItems: UpdateLineItemsShippingInputData }>) {
  const { transactionManager: manager } = context

  const data_ = data.lineItems

  const lineItemService = container
    .resolve("lineItemService")
    .withTransaction(manager)

  const items = await Promise.all(
    data_.items.map(async (item) => {
      return lineItemService.update(item.id, {
        has_shipping: lineItemService.validateLineItemShipping_(
          data_.methods,
          item
        ),
      })
    })
  )

  return {
    lineItems: items,
  }
}

ensureCorrectLineItemShipping.aliases = {
  lineItems: "lineItems",
}
