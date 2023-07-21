import { Context, LoadedModule, MedusaContainer } from "@medusajs/types"
import { DistributedTransaction, TransactionOrchestrator } from "../transaction"
import {
  WorkflowDefinition,
  WorkflowManager,
  WorkflowStepHandler,
} from "./workflow-manager"

import { OrchestratorBuilder } from "../transaction/orchestrator-builder"
import { asValue } from "awilix"
import { createMedusaContainer } from "@medusajs/utils"

export class LocalWorkflow extends OrchestratorBuilder {
  protected container: MedusaContainer
  private workflowId: string
  private workflow: WorkflowDefinition
  private handlers: Map<
    string,
    { invoke: WorkflowStepHandler; compensate?: WorkflowStepHandler }
  >

  constructor(
    workflowId: string,
    modulesLoaded?: LoadedModule[] | MedusaContainer
  ) {
    const globalWorkflow = WorkflowManager.getWorkflow(workflowId)
    if (!globalWorkflow) {
      throw new Error(`Workflow with id "${workflowId}" not found.`)
    }

    super(globalWorkflow.flow_)

    this.workflowId = workflowId
    this.workflow = globalWorkflow
    this.handlers = new Map(globalWorkflow.handlers_)

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
  }

  commit(
    handlers?: Map<
      string,
      { invoke: WorkflowStepHandler; compensate?: WorkflowStepHandler }
    >
  ) {
    const finalFlow = this.build()

    if (handlers) {
      for (const [key, value] of handlers.entries()) {
        this.handlers.set(key, value)
      }
    }

    this.workflow = {
      id: this.workflowId,
      flow_: finalFlow,
      orchestrator: new TransactionOrchestrator(this.workflowId, finalFlow),
      handler: WorkflowManager.buildHandlers(this.handlers),
      handlers_: this.handlers,
    }
  }

  async begin(uniqueTransactionId: string, input?: unknown, context?: Context) {
    const { handler, orchestrator } = this.workflow

    const transaction = await orchestrator.beginTransaction(
      uniqueTransactionId,
      handler(this.container, context),
      input
    )

    await orchestrator.resume(transaction)

    return transaction
  }

  async registerStepSuccess(
    idempotencyKey: string,
    response?: unknown,
    context?: Context
  ): Promise<DistributedTransaction> {
    const { handler, orchestrator } = this.workflow
    return await orchestrator.registerStepSuccess(
      idempotencyKey,
      handler(this.container, context),
      undefined,
      response
    )
  }

  async registerStepFailure(
    idempotencyKey: string,
    error?: Error | any,
    context?: Context
  ): Promise<DistributedTransaction> {
    const { handler, orchestrator } = this.workflow
    return await orchestrator.registerStepFailure(
      idempotencyKey,
      error,
      handler(this.container, context)
    )
  }
}
