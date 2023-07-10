import { MedusaContainer } from "@medusajs/types"
import { DistributedTransaction } from "./distributed-transaction"
import { TransactionOrchestrator } from "./transaction-orchestrator"
import { TransactionStepHandler } from "./transaction-step"
import { TransactionHandlerType, TransactionStepsDefinition } from "./types"

interface Workflow {
  id: string
  handler: (container: MedusaContainer) => TransactionStepHandler
  orchestrator: TransactionOrchestrator
  flow_: TransactionStepsDefinition
  handlers_: Map<string, { invoke: Function; compensate?: Function }>
  requiredModules?: string[]
  optionalModules?: string[]
}

type InvokeHandler = (
  container: MedusaContainer,
  payload: any,
  invoke: { [actions: string]: any }
) => Promise<any>

type CompensateHandler = (
  container: MedusaContainer,
  payload: any,
  invoke: { [actions: string]: any },
  compensate: { [actions: string]: any }
) => Promise<any>

export class WorkflowManager {
  private static workflows: Map<string, Workflow> = new Map()
  private container: MedusaContainer

  constructor(container: MedusaContainer) {
    this.container = container
  }

  static register(
    workflowId: string,
    flow: TransactionStepsDefinition,
    handlers: Map<
      string,
      { invoke: InvokeHandler; compensate?: CompensateHandler }
    >,
    requiredModules?: string[],
    optionalModules?: string[]
  ) {
    WorkflowManager.workflows.set(workflowId, {
      id: workflowId,
      flow_: flow,
      orchestrator: new TransactionOrchestrator(workflowId, flow),
      handler: WorkflowManager.getHandler(handlers),
      handlers_: handlers,
      requiredModules,
      optionalModules,
    })
  }

  static getTransactionDefinition(workflowId) {
    if (!WorkflowManager.workflows.has(workflowId)) {
      throw new Error(`Workflow with id "${workflowId}" not found.`)
    }

    const workflow = WorkflowManager.workflows.get(workflowId)!
    return new TransactionOrchestrator(workflowId, workflow.flow_)
  }

  static update(workflowId, flow, handlers) {
    if (!WorkflowManager.workflows.has(workflowId)) {
      throw new Error(`Workflow with id "${workflowId}" not found.`)
    }

    const workflow = WorkflowManager.workflows.get(workflowId)!
    workflow.flow_ = flow
    workflow.handlers_ = handlers
    workflow.handler = WorkflowManager.getHandler(handlers)
  }

  static getHandler(
    handlers
  ): (container: MedusaContainer) => TransactionStepHandler {
    return (container: MedusaContainer): TransactionStepHandler => {
      return (
        actionId: string,
        functionHandlerType: TransactionHandlerType,
        payload?: any
      ) => {
        const command = handlers.get(actionId)
        if (!command) {
          throw new Error(`Handler for action "${actionId}" not found.`)
        } else if (!command[functionHandlerType]) {
          throw new Error(
            `"${functionHandlerType}" handler for action "${actionId}" not found.`
          )
        }

        const { invoke, compensate, payload: input } = payload.context

        if (functionHandlerType === TransactionHandlerType.COMPENSATE) {
          return command[functionHandlerType]!(
            container,
            input,
            invoke,
            compensate
          )
        }

        return command[functionHandlerType]!(container, input, invoke)
      }
    }
  }

  async begin(workflowId: string, uniqueTransactionId: string, input: any) {
    if (!WorkflowManager.workflows.has(workflowId)) {
      throw new Error(`Workflow with id "${workflowId}" not found.`)
    }

    const workflow = WorkflowManager.workflows.get(workflowId)!

    const orchestrator = workflow.orchestrator

    return orchestrator.beginTransaction(
      uniqueTransactionId,
      workflow.handler(this.container),
      input
    )
  }

  async registerStepSuccess(
    workflowId: string,
    idempotencyKey: string,
    response: any
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
    error: Error | unknown
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
