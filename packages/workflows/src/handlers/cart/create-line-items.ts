import { WorkflowArguments } from "../../helper"
import { LineItem } from "../../../../medusa/dist"

enum Aliases {
  LineItems = "line_items",
}

type HandlerOutputData = {
  lineItems: LineItem[]
}

export async function createLineItems({
  container,
  data,
}: WorkflowArguments): Promise<HandlerOutputData> {
  const lineItemService = container.resolve("lineItemService")
  
  let lineItems = data[Aliases.LineItems] || []

  return await lineItemService.create(lineItems)
}

createLineItems.aliases = Aliases

