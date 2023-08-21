import { WorkflowArguments } from "../../helper"

enum Aliases {
  LineItems = "line_items",
}

export async function removeLineItems({
  container,
  context,
  data,
}: WorkflowArguments): Promise<void> {
  const lineItemService = container.resolve("lineItemService")

  const lineItems = data[Aliases.LineItems]

  await lineItemService.delete(lineItems)
}

removeLineItems.aliases = Aliases
