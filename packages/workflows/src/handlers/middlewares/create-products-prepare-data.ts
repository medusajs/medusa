import { InputAlias } from "../../definitions"
import { PipelineHandlerResult } from "../../helper"

export function createProductsPrepareData({ data }): PipelineHandlerResult {
  return {
    alias: InputAlias.Products as string,
    value: [{}],
  }
}
