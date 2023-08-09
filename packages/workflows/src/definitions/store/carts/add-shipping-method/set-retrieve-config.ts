import { WorkflowArguments } from "../../../../helper"

export function setRetrieveConfig(config) {
  return async function (_: WorkflowArguments) {
    return {
      alias: "config",
      value: {
        select: config.select,
        relations: config.relations,
      },
    }
  }
}
