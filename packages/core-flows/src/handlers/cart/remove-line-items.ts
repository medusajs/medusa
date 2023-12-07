
enum Aliases {
  LineItems = "created_line_items",
}

export async function removeLineItems({
  container,
  context,
  data,
}): Promise<void> {
  const { manager } = context

  const lineItemService = container.resolve("lineItemService")

  const lineItems = data[Aliases.LineItems]

  return await lineItemService
    .withTransaction(manager)
    .delete(lineItems.map((li) => li.id))
}

removeLineItems.aliases = Aliases
