import { WorkflowArguments } from "../../helper"

type AttachContextDTO = {
  context?: Record<any, any>
}

enum Aliases {
  Cart = "cart"
}

export async function attachContextToCart({
  container,
  context,
  data,
}: WorkflowArguments): Promise<AttachContextDTO> {
  const contextDTO: AttachContextDTO = {
    context: data[Aliases.Cart].context
  }

  return contextDTO
}

attachContextToCart.aliases = Aliases
