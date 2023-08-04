import { WorkflowArguments } from "../../helper"

type AttachContextDTO = {
  context?: Record<any, any>
}

enum Aliases {
  Cart = "cart"
}

type HandlerInputData = {
  cart: {
    context?: Record<any, any>
  }
}

export async function attachContextToCart({
  container,
  context,
  data,
}: WorkflowArguments<HandlerInputData>): Promise<AttachContextDTO> {
  const contextDTO: AttachContextDTO = {
    context: data[Aliases.Cart].context
  }

  return contextDTO
}

attachContextToCart.aliases = Aliases
