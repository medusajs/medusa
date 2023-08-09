import { WorkflowArguments } from "../../../../helper"

export function setRetrieveConfig(config) {
  return async function (_: WorkflowArguments) {
    return {
      alias: "config",
      value: {
        retrieveConfig: {
          select: config.select,
          relations: config.relations,
        },
      },
    }
  }
}
