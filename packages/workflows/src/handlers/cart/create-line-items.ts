import { WorkflowArguments } from "../../helper"

enum Aliases {
  CreatedLineItems = "created_line_items",
  LineItems = "line_items",
}

export async function createLineItems({
  container,
  data,
}: WorkflowArguments) {
  const lineItemService = container.resolve("lineItemService")
  
  let lineItems = data[Aliases.LineItems] || []

  const items = await lineItemService.create(lineItems)

  return items
}

createLineItems.aliases = Aliases

