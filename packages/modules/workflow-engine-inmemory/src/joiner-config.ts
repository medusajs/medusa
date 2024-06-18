import { Modules } from "@medusajs/modules-sdk"
import { ModuleJoinerConfig } from "@medusajs/types"
import { MapToConfig } from "@medusajs/utils"
import { WorkflowExecution } from "@models"
import moduleSchema from "./schema"

export const LinkableKeys = {
  workflow_execution_id: WorkflowExecution.name,
}

const entityLinkableKeysMap: MapToConfig = {}
Object.entries(LinkableKeys).forEach(([key, value]) => {
  entityLinkableKeysMap[value] ??= []
  entityLinkableKeysMap[value].push({
    mapTo: key,
    valueFrom: key.split("_").pop()!,
  })
})

export const entityNameToLinkableKeysMap: MapToConfig = entityLinkableKeysMap

export const joinerConfig: ModuleJoinerConfig = {
  serviceName: Modules.WORKFLOW_ENGINE,
  primaryKeys: ["id"],
  schema: moduleSchema,
  linkableKeys: LinkableKeys,
  alias: {
    name: ["workflow_execution", "workflow_executions"],
    args: {
      entity: WorkflowExecution.name,
      methodSuffix: "WorkflowExecutions",
    },
  },
}
