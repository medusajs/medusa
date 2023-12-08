import { Context, MedusaContainer } from "@medusajs/types"
import {
  DistributedTransaction,
  OrchestratorBuilder,
  TransactionHandlerType,
  TransactionMetadata,
  TransactionOrchestrator,
  TransactionStepHandler,
  TransactionStepsDefinition,
} from "../transaction"

export interface WorkflowDefinition {
  id: string
  handler: (
    container: MedusaContainer,
    context?: Context
  ) => TransactionStepHandler
  orchestrator: TransactionOrchestrator
  flow_: TransactionStepsDefinition
  handlers_: Map<
    string,
    { invoke: WorkflowStepHandler; compensate?: WorkflowStepHandler }
  >
  requiredModules?: Set<string>
  optionalModules?: Set<string>
}

export type WorkflowHandler = Map<
  string,
  { invoke: WorkflowStepHandler; compensate?: WorkflowStepHandler }
>

export type WorkflowStepHandler = (args: {
  container: MedusaContainer
  payload: unknown
  invoke: { [actions: string]: unknown }
  compensate: { [actions: string]: unknown }
  metadata: TransactionMetadata
  transaction: DistributedTransaction
  context?: Context
}) => unknown

export class WorkflowManager {
  protected static workflows: Map<string, WorkflowDefinition> = new Map()

  static unregister(workflowId: string) {
    WorkflowManager.workflows.delete(workflowId)
  }

  static unregisterAll() {
    WorkflowManager.workflows.clear()
  }

  static getWorkflows() {
    return WorkflowManager.workflows
  }

  static getWorkflow(workflowId: string) {
    return WorkflowManager.workflows.get(workflowId)
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
    flow: TransactionStepsDefinition | OrchestratorBuilder | undefined,
    handlers: WorkflowHandler,
    requiredModules?: Set<string>,
    optionalModules?: Set<string>
  ) {
    const finalFlow = flow instanceof OrchestratorBuilder ? flow.build() : flow

    if (WorkflowManager.workflows.has(workflowId)) {
      const areStepsEqual = finalFlow
        ? JSON.stringify(finalFlow) ===
          JSON.stringify(WorkflowManager.workflows.get(workflowId)!.flow_)
        : true

      if (!areStepsEqual) {
        throw new Error(
          `Workflow with id "${workflowId}" and step definition already exists.`
        )
      }
    }

    WorkflowManager.workflows.set(workflowId, {
      id: workflowId,
      flow_: finalFlow!,
      orchestrator: new TransactionOrchestrator(workflowId, finalFlow ?? {}),
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
      { invoke: WorkflowStepHandler; compensate?: WorkflowStepHandler }
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

  public static buildHandlers(
    handlers: Map<
      string,
      { invoke: WorkflowStepHandler; compensate?: WorkflowStepHandler }
    >
  ): (container: MedusaContainer, context?: Context) => TransactionStepHandler {
    return (
      container: MedusaContainer,
      context?: Context
    ): TransactionStepHandler => {
      return async (
        actionId: string,
        handlerType: TransactionHandlerType,
        payload?: any,
        transaction?: DistributedTransaction
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

        return await command[handlerType]!({
          container,
          payload: input,
          invoke,
          compensate,
          metadata,
          transaction: transaction as DistributedTransaction,
          context,
        })
      }
    }
  }
}

global.WorkflowManager ??= WorkflowManager
exports.WorkflowManager = global.WorkflowManager
