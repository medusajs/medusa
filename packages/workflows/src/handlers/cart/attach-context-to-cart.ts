import { CartInputAlias } from "../../definition"
import { PipelineHandlerResult, WorkflowArguments } from "../../helper"

type AttachContextDTO = {
  context?: Record<any, any>
}

export async function attachContextToCart({
  container,
  context,
  data,
}: WorkflowArguments): Promise<AttachContextDTO> {
  const contextDTO: AttachContextDTO = {
    context: data[CartInputAlias.Cart].context
  }

  return contextDTO
}
