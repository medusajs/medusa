import { Context, LoadedModule, MedusaContainer } from "@medusajs/types"
import {
  DistributedTransaction,
  TransactionOrchestrator,
  TransactionStepsDefinition,
} from "../transaction"
import {
  WorkflowDefinition,
  WorkflowManager,
  WorkflowStepHandler,
} from "./workflow-manager"

import { OrchestratorBuilder } from "../transaction/orchestrator-builder"
import { asValue } from "awilix"
import { createMedusaContainer } from "@medusajs/utils"

type StepHandler = {
  invoke: WorkflowStepHandler
  compensate?: WorkflowStepHandler
}

export class LocalWorkflow {
  protected container: MedusaContainer
  protected workflowId: string
  protected flow: OrchestratorBuilder
  protected workflow: WorkflowDefinition
  protected handlers: Map<string, StepHandler>

  constructor(
    workflowId: string,
    modulesLoaded?: LoadedModule[] | MedusaContainer
  ) {
    const globalWorkflow = WorkflowManager.getWorkflow(workflowId)
    if (!globalWorkflow) {
      throw new Error(`Workflow with id "${workflowId}" not found.`)
    }

    this.flow = new OrchestratorBuilder(globalWorkflow.flow_)
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

  protected commit() {
    const finalFlow = this.flow.build()

    this.workflow = {
      id: this.workflowId,
      flow_: finalFlow,
      orchestrator: new TransactionOrchestrator(this.workflowId, finalFlow),
      handler: WorkflowManager.buildHandlers(this.handlers),
      handlers_: this.handlers,
    }
  }

  async run(uniqueTransactionId: string, input?: unknown, context?: Context) {
    if (this.flow.hasChanges) {
      this.commit()
    }

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

  addAction(
    action: string,
    handler: StepHandler,
    options: Partial<TransactionStepsDefinition> = {}
  ) {
    this.assertHandler(handler, action)
    this.handlers.set(action, handler)

    return this.flow.addAction(action, options)
  }

  replaceAction(
    existingAction: string,
    action: string,
    handler: StepHandler,
    options: Partial<TransactionStepsDefinition> = {}
  ) {
    this.assertHandler(handler, action)
    this.handlers.set(action, handler)

    return this.flow.replaceAction(existingAction, action, options)
  }

  insertActionBefore(
    existingAction: string,
    action: string,
    handler: StepHandler,
    options: Partial<TransactionStepsDefinition> = {}
  ) {
    this.assertHandler(handler, action)
    this.handlers.set(action, handler)

    return this.flow.insertActionBefore(existingAction, action, options)
  }

  insertActionAfter(
    existingAction: string,
    action: string,
    handler: StepHandler,
    options: Partial<TransactionStepsDefinition> = {}
  ) {
    this.assertHandler(handler, action)
    this.handlers.set(action, handler)

    return this.flow.insertActionAfter(existingAction, action, options)
  }

  appendAction(
    action: string,
    to: string,
    handler: StepHandler,
    options: Partial<TransactionStepsDefinition> = {}
  ) {
    this.assertHandler(handler, action)
    this.handlers.set(action, handler)

    return this.flow.appendAction(action, to, options)
  }

  moveAction(actionToMove: string, targetAction: string): OrchestratorBuilder {
    return this.flow.moveAction(actionToMove, targetAction)
  }

  moveAndMergeNextAction(
    actionToMove: string,
    targetAction: string
  ): OrchestratorBuilder {
    return this.flow.moveAndMergeNextAction(actionToMove, targetAction)
  }

  mergeActions(where: string, ...actions: string[]) {
    return this.flow.mergeActions(where, ...actions)
  }

  deleteAction(action: string, parentSteps?) {
    return this.flow.deleteAction(action, parentSteps)
  }

  pruneAction(action: string) {
    return this.flow.pruneAction(action)
  }

  protected assertHandler(handler: StepHandler, action: string): void | never {
    if (!handler?.invoke) {
      throw new Error(
        `Handler for action "${action}" is missing invoke function.`
      )
    }
  }
}
