import { WorkflowArguments } from "../../helper"

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

export async function attachContext({
  container,
  context,
  data,
}: WorkflowArguments<HandlerInputData>): Promise<ContextDTO> {
  const contextDTO: ContextDTO = {
    context: data[Aliases.Context].context,
  }

  return contextDTO
}

attachContext.aliases = Aliases
