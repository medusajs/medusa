import { WorkflowArguments } from "@medusajs/workflows-sdk"

type ContextDTO = {
  context?: Record<any, any>
}

enum Aliases {
  Context = "context",
}

type HandlerInputData = {
  context: {
    context?: Record<any, any>
  }
}

export async function setContext({
  data,
}: WorkflowArguments<HandlerInputData>): Promise<ContextDTO> {
  const contextDTO: ContextDTO = {
    context: data[Aliases.Context].context,
  }

  return contextDTO
}

setContext.aliases = Aliases
