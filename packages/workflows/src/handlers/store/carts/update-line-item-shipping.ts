import { WorkflowArguments } from "../../../helper"

type UpdateLineItemsShippingDTO = {
  items: any // line items
  methods: any // shipping methods to validate against
}

export async function updateLineItemShipping({
  container,
  context,
  data,
}: WorkflowArguments & {
  data: UpdateLineItemsShippingDTO
}) {
  const { transactionManager: manager } = context

  const lineItemService = container
    .resolve("lineItemService")
    .withTransaction(manager)

  const items = await Promise.all(
    data.items.map(async (item) => {
      return lineItemService.update(item.id, {
        has_shipping: lineItemService.validateLineItemShipping_(
          data.methods,
          item
        ),
      })
    })
  )

  return {
    alias: "updatedShippingOnLineItems",
    value: items,
  }
}
