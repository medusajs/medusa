import { MedusaContainer } from "@medusajs/types"
import {
  DistributedTransaction,
  TransactionMetadata,
} from "./distributed-transaction"
import { TransactionOrchestrator } from "./transaction-orchestrator"
import { TransactionStepHandler } from "./transaction-step"
import { TransactionHandlerType, TransactionStepsDefinition } from "./types"
import { OrchestratorBuilder } from "./orchestrator-builder"

interface Workflow {
  id: string
  handler: (container: MedusaContainer) => TransactionStepHandler
  orchestrator: TransactionOrchestrator
  flow_: TransactionStepsDefinition
  handlers_: Map<
    string,
    { invoke: InvokeHandler; compensate?: CompensateHandler }
  >
  requiredModules?: Set<string>
  optionalModules?: Set<string>
}

type InvokeHandler = (
  container: MedusaContainer,
  payload: any,
  invoke: { [actions: string]: any },
  metadata: TransactionMetadata
) => Promise<any>

type CompensateHandler = (
  container: MedusaContainer,
  payload: any,
  invoke: { [actions: string]: any },
  compensate: { [actions: string]: any },
  metadata: TransactionMetadata
) => Promise<any>

export class WorkflowManager {
  protected static workflows: Map<string, Workflow> = new Map()
  protected container: MedusaContainer

  constructor(container?: MedusaContainer) {
    this.container = container as MedusaContainer
  }

  static unregister(workflowId: string) {
    WorkflowManager.workflows.delete(workflowId)
  }

  static unregisterAll() {
    WorkflowManager.workflows.clear()
  }

  static getWorkflows() {
    return WorkflowManager.workflows
  }

  static getTransactionDefinition(workflowId): OrchestratorBuilder {
    if (!WorkflowManager.workflows.has(workflowId)) {
      throw new Error(`Workflow with id "${workflowId}" not found.`)
    }

    const workflow = WorkflowManager.workflows.get(workflowId)!
    return new OrchestratorBuilder(workflow.flow_)
  }

  static register(
    workflowId: string,
    flow: TransactionStepsDefinition | OrchestratorBuilder,
    handlers: Map<
      string,
      { invoke: InvokeHandler; compensate?: CompensateHandler }
    >,
    requiredModules?: Set<string>,
    optionalModules?: Set<string>
  ) {
    if (WorkflowManager.workflows.has(workflowId)) {
      throw new Error(`Workflow with id "${workflowId}" is already defined.`)
    }

    const finalFlow = flow instanceof OrchestratorBuilder ? flow.build() : flow

    WorkflowManager.workflows.set(workflowId, {
      id: workflowId,
      flow_: finalFlow,
      orchestrator: new TransactionOrchestrator(workflowId, finalFlow),
      handler: WorkflowManager.buildHandlers(handlers),
      handlers_: handlers,
      requiredModules,
      optionalModules,
    })
  }

  static update(
    workflowId: string,
    flow: TransactionStepsDefinition | OrchestratorBuilder,
    handlers: Map<
      string,
      { invoke: InvokeHandler; compensate?: CompensateHandler }
    >,
    requiredModules?: Set<string>,
    optionalModules?: Set<string>
  ) {
    if (!WorkflowManager.workflows.has(workflowId)) {
      throw new Error(`Workflow with id "${workflowId}" not found.`)
    }

    const workflow = WorkflowManager.workflows.get(workflowId)!

    for (const [key, value] of handlers.entries()) {
      workflow.handlers_.set(key, value)
    }

    const finalFlow = flow instanceof OrchestratorBuilder ? flow.build() : flow

    WorkflowManager.workflows.set(workflowId, {
      id: workflowId,
      flow_: finalFlow,
      orchestrator: new TransactionOrchestrator(workflowId, finalFlow),
      handler: WorkflowManager.buildHandlers(workflow.handlers_),
      handlers_: workflow.handlers_,
      requiredModules,
      optionalModules,
    })
  }

  private static buildHandlers(
    handlers: Map<
      string,
      { invoke: InvokeHandler; compensate?: CompensateHandler }
    >
  ): (container: MedusaContainer) => TransactionStepHandler {
    return (container: MedusaContainer): TransactionStepHandler => {
      return async (
        actionId: string,
        handlerType: TransactionHandlerType,
        payload?: any
      ) => {
        const command = handlers.get(actionId)

        if (!command) {
          throw new Error(`Handler for action "${actionId}" not found.`)
        } else if (!command[handlerType]) {
          throw new Error(
            `"${handlerType}" handler for action "${actionId}" not found.`
          )
        }

        const { invoke, compensate, payload: input } = payload.context
        const { metadata } = payload

        if (handlerType === TransactionHandlerType.COMPENSATE) {
          return await command[handlerType]!(
            container,
            input,
            invoke,
            compensate,
            metadata
          )
        }

        return await command[handlerType](container, input, invoke, metadata)
      }
    }
  }

  async begin(
    workflowId: string,
    uniqueTransactionId: string,
    input?: unknown
  ) {
    if (!WorkflowManager.workflows.has(workflowId)) {
      throw new Error(`Workflow with id "${workflowId}" not found.`)
    }

    const workflow = WorkflowManager.workflows.get(workflowId)!

    const orchestrator = workflow.orchestrator

    const transaction = await orchestrator.beginTransaction(
      uniqueTransactionId,
      workflow.handler(this.container),
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
      workflow.handler(this.container),
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
      workflow.handler(this.container)
    )
  }
}
