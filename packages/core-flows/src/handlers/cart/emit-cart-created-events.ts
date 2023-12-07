import { WorkflowArguments } from "@medusajs/workflows-sdk"

enum Aliases {
  Cart = "cart",
}

export async function emitCartCreatedEvents({
  container,
  context,
  data,
}: WorkflowArguments): Promise<void> {
  const { manager } = context
  const eventBusService = container.resolve("eventBusService")

  const cart = data[Aliases.Cart]

  // await eventBusService
  //   .withTransaction(manager)
  //   .emit(CartService.Events.CREATED, {
  //     id: cart.id,
  //   })
}
