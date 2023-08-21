import { WorkflowArguments } from "../../helper"

enum Aliases {
  LineItems = "created_line_items",
}

export async function removeLineItems({
  container,
  data,
}: WorkflowArguments): Promise<void> {
  const lineItemService = container.resolve("lineItemService")

  const lineItems = data[Aliases.LineItems]

  return await lineItemService.delete(lineItems.map((li) => li.id))
}

removeLineItems.aliases = Aliases
