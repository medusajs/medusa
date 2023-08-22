import { WorkflowArguments } from "../../helper"

enum Aliases {
  CreatedLineItems = "created_line_items",
  LineItems = "line_items",
}

export async function createLineItems({
  container,
  context,
  data,
}: WorkflowArguments) {
  const { manager } = context
  const lineItemService = container.resolve("lineItemService")

  let lineItems = data[Aliases.LineItems] || []

  const items = await lineItemService.withTransaction(manager).create(lineItems)

  return items
}

createLineItems.aliases = Aliases
