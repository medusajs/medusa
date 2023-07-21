import { Context, LoadedModule, MedusaContainer } from "@medusajs/types"
import { WorkflowDefinition, WorkflowManager } from "./workflow-manager"

import { DistributedTransaction } from "../transaction"
import { asValue } from "awilix"
import { createMedusaContainer } from "@medusajs/utils"

export class GlobalWorkflow extends WorkflowManager {
  protected static workflows: Map<string, WorkflowDefinition> = new Map()
  protected container: MedusaContainer
  protected context: Context

  constructor(
    modulesLoaded?: LoadedModule[] | MedusaContainer,
    context?: Context
  ) {
    super()

    const container = createMedusaContainer()

    // Medusa container
    if (!Array.isArray(modulesLoaded) && modulesLoaded) {
      const cradle = modulesLoaded.cradle
      for (const key in cradle) {
        container.register(key, asValue(cradle[key]))
      }
    }
    // Array of modules
    else if (modulesLoaded?.length) {
      for (const mod of modulesLoaded) {
        const registrationName = mod.__definition.registrationName
        container.register(registrationName, asValue(mod))
      }
    }

    this.container = container
    this.context = context ?? {}
  }

  async run(workflowId: string, uniqueTransactionId: string, input?: unknown) {
    if (!WorkflowManager.workflows.has(workflowId)) {
      throw new Error(`Workflow with id "${workflowId}" not found.`)
    }

    const workflow = WorkflowManager.workflows.get(workflowId)!

    const orchestrator = workflow.orchestrator

    const transaction = await orchestrator.beginTransaction(
      uniqueTransactionId,
      workflow.handler(this.container, this.context),
      input
    )

    await orchestrator.resume(transaction)

    return transaction
  }

  async registerStepSuccess(
    workflowId: string,
    idempotencyKey: string,
    response?: unknown
  ): Promise<DistributedTransaction> {
    if (!WorkflowManager.workflows.has(workflowId)) {
      throw new Error(`Workflow with id "${workflowId}" not found.`)
    }

    const workflow = WorkflowManager.workflows.get(workflowId)!
    return await workflow.orchestrator.registerStepSuccess(
      idempotencyKey,
      workflow.handler(this.container, this.context),
      undefined,
      response
    )
  }

  async registerStepFailure(
    workflowId: string,
    idempotencyKey: string,
    error?: Error | any
  ): Promise<DistributedTransaction> {
    if (!WorkflowManager.workflows.has(workflowId)) {
      throw new Error(`Workflow with id "${workflowId}" not found.`)
    }

    const workflow = WorkflowManager.workflows.get(workflowId)!
    return await workflow.orchestrator.registerStepFailure(
      idempotencyKey,
      error,
      workflow.handler(this.container, this.context)
    )
  }
}
