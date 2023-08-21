import { WorkflowArguments } from "../../helper"

enum Aliases {
  LineItems = "line_items",
}

export async function createLineItems({
  container,
  data,
}: WorkflowArguments) {
  const lineItemService = container.resolve("lineItemService")
  
  let lineItems = data[Aliases.LineItems] || []

  return await lineItemService.create(lineItems)
}

createLineItems.aliases = Aliases

