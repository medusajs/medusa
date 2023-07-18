import {
  CompensateHandler,
  InvokeHandler,
  WorkflowDefinition,
  WorkflowManager,
} from "./workflow-manager"
import {
  Context,
  JoinerServiceConfig,
  MedusaContainer,
  ModuleDefinition,
} from "@medusajs/types"
import { DistributedTransaction, TransactionOrchestrator } from "../transaction"

import { MedusaModule } from "@medusajs/modules-sdk"
import { OrchestratorBuilder } from "../transaction/orchestrator-builder"
import { asValue } from "awilix"
import { createMedusaContainer } from "@medusajs/utils"

export class LocalWorkflow extends OrchestratorBuilder {
  protected container: MedusaContainer
  protected context: Context
  private workflowId: string
  private workflow: WorkflowDefinition
  private handlers: Map<
    string,
    { invoke: InvokeHandler; compensate?: CompensateHandler }
  >

  constructor(
    workflowId: string,
    modulesLoaded?:
      | (any & {
          __joinerConfig: JoinerServiceConfig
          __definition: ModuleDefinition
        })[]
      | MedusaContainer,
    context?: Context
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
    // Modules loaded
    else {
      for (const [, mod] of MedusaModule.getLoadedModules().entries()) {
        const registrationName = mod.__definition.registrationName
        container.register(registrationName, asValue(mod))
      }
    }

    this.container = container
    this.context = context ?? {}
  }

  commit(
    handlers?: Map<
      string,
      { invoke: InvokeHandler; compensate?: CompensateHandler }
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

  async begin(uniqueTransactionId: string, input?: unknown) {
    const { handler, orchestrator } = this.workflow

    const transaction = await orchestrator.beginTransaction(
      uniqueTransactionId,
      handler(this.container, this.context),
      input
    )

    await orchestrator.resume(transaction)

    return transaction
  }

  async registerStepSuccess(
    idempotencyKey: string,
    response?: unknown
  ): Promise<DistributedTransaction> {
    const { handler, orchestrator } = this.workflow
    return await orchestrator.registerStepSuccess(
      idempotencyKey,
      handler(this.container, this.context),
      undefined,
      response
    )
  }

  async registerStepFailure(
    idempotencyKey: string,
    error?: Error | any
  ): Promise<DistributedTransaction> {
    const { handler, orchestrator } = this.workflow
    return await orchestrator.registerStepFailure(
      idempotencyKey,
      error,
      handler(this.container, this.context)
    )
  }
}
