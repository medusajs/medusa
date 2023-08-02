import { InputAlias } from "../../../definitions"
import { WorkflowArguments } from "../../../helper"

type UpdateLineItemsShippingDTO = {
  items: any // line items
  methods: any // shipping methods to validate against
}

export async function updateLineItemShipping({
  container,
  context,
  data,
}: Omit<WorkflowArguments, "data"> & {
  data: { [InputAlias.LineItems]: UpdateLineItemsShippingDTO }
}) {
  const { transactionManager: manager } = context

  const dataToValidate = data[InputAlias.LineItems]

  const lineItemService = container
    .resolve("lineItemService")
    .withTransaction(manager)

  const items = await Promise.all(
    dataToValidate.items.map(async (item) => {
      return lineItemService.update(item.id, {
        has_shipping: lineItemService.validateLineItemShipping_(
          dataToValidate.methods,
          item
        ),
      })
    })
  )

  return {
    lineItems: items,
  }
}
