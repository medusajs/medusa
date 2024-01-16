import * as defaultRepositories from "@repositories"

import { LoaderOptions } from "@medusajs/modules-sdk"
import { ModulesSdkTypes } from "@medusajs/types"
import { loadCustomRepositories } from "@medusajs/utils"
import * as defaultServices from "@services"
import { asClass } from "awilix"
import { InMemoryDistributedTransactionStorage } from "../utils"

export default async ({
  container,
  options,
  logger,
}: LoaderOptions<
  | ModulesSdkTypes.ModuleServiceInitializeOptions
  | ModulesSdkTypes.ModuleServiceInitializeCustomDataLayerOptions
>): Promise<void> => {
  logger?.warn(
    "Workflow Orchestrator In Memory installed. This is not recommended for production."
  )

  const customRepositories = (
    options as ModulesSdkTypes.ModuleServiceInitializeCustomDataLayerOptions
  )?.repositories

  container.register({
    workflowExecutionService: asClass(
      defaultServices.WorkflowExecutionService
    ).singleton(),
    workflowOrchestratorService: asClass(
      defaultServices.WorkflowOrchestratorService
    ).singleton(),

    inMemoryDistributedTransactionStorage: asClass(
      InMemoryDistributedTransactionStorage
    ).singleton(),
  })

  if (customRepositories) {
    loadCustomRepositories({
      defaultRepositories,
      customRepositories,
      container,
    })
  } else {
    loadDefaultRepositories({ container })
  }
}

function loadDefaultRepositories({ container }) {
  container.register({
    baseRepository: asClass(defaultRepositories.BaseRepository).singleton(),
    workflowExecutionRepository: asClass(
      defaultRepositories.WorkflowExecutionRepository
    ).singleton(),
  })
}
