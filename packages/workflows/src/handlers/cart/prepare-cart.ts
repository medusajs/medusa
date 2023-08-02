import { InputAlias } from "../../definitions"
import { PipelineHandlerResult, WorkflowArguments } from "../../helper"

export async function prepareCart<T>({
  container,
  context,
  data,
}: WorkflowArguments): Promise<PipelineHandlerResult<T>> {
  // Do things to prepare the create input
  return data[InputAlias.Cart]
}
