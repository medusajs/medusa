import { Context, LoadedModule, MedusaContainer } from "@medusajs/types"
import { createMedusaContainer } from "@medusajs/utils"
import { asValue } from "@medusajs/deps/awilix"

import {
  DistributedTransactionEvents,
  DistributedTransactionType,
} from "../transaction"
import { WorkflowDefinition, WorkflowManager } from "./workflow-manager"

export class GlobalWorkflow extends WorkflowManager {
  protected static workflows: Map<string, WorkflowDefinition> = new Map()
  protected container: MedusaContainer
  protected context: Context
  protected subscribe: DistributedTransactionEvents

  constructor(
    modulesLoaded?: LoadedModule[] | MedusaContainer,
    context?: Context,
    subscribe?: DistributedTransactionEvents
  ) {
    super()

    let container

    if (!Array.isArray(modulesLoaded) && modulesLoaded) {
      if (!("cradle" in modulesLoaded)) {
        container = createMedusaContainer(modulesLoaded)
      } else {
        container = modulesLoaded
      }
    } else if (Array.isArray(modulesLoaded) && modulesLoaded.length) {
      container = createMedusaContainer()

      for (const mod of modulesLoaded || []) {
        const keyName = mod.__definition.key
        container.register(keyName, asValue(mod))
      }
    }

    this.container = container
    this.context = context ?? {}
    this.subscribe = subscribe ?? {}
  }

  async run(workflowId: string, uniqueTransactionId: string, input?: unknown) {
    // Goes through the accessor so a workflow a build manifest deferred loads
    const workflow = WorkflowManager.getWorkflow(workflowId)
    if (!workflow) {
      throw new Error(`Workflow with id "${workflowId}" not found.`)
    }

    const orchestrator = workflow.orchestrator

    const transaction = await orchestrator.beginTransaction({
      transactionId: uniqueTransactionId,
      handler: workflow.handler(this.container, this.context),
      payload: input,
    })

    if (this.subscribe.onStepBegin) {
      transaction.once("stepBegin", this.subscribe.onStepBegin)
    }

    if (this.subscribe.onStepSuccess) {
      transaction.once("stepSuccess", this.subscribe.onStepSuccess)
    }

    if (this.subscribe.onStepFailure) {
      transaction.once("stepFailure", this.subscribe.onStepFailure)
    }

    if (this.subscribe.onStepAwaiting) {
      transaction.once("stepAwaiting", this.subscribe.onStepAwaiting)
    }

    await orchestrator.resume(transaction)

    return transaction
  }

  async registerStepSuccess(
    workflowId: string,
    idempotencyKey: string,
    response?: unknown
  ): Promise<DistributedTransactionType> {
    // Goes through the accessor so a workflow a build manifest deferred loads
    const workflow = WorkflowManager.getWorkflow(workflowId)
    if (!workflow) {
      throw new Error(`Workflow with id "${workflowId}" not found.`)
    }
    const orchestrator = workflow.orchestrator
    orchestrator.once("resume", (transaction) => {
      if (this.subscribe.onStepBegin) {
        transaction.once("stepBegin", this.subscribe.onStepBegin)
      }

      if (this.subscribe.onStepSuccess) {
        transaction.once("stepSuccess", this.subscribe.onStepSuccess)
      }

      if (this.subscribe.onStepFailure) {
        transaction.once("stepFailure", this.subscribe.onStepFailure)
      }
    })

    return await workflow.orchestrator.registerStepSuccess({
      responseIdempotencyKey: idempotencyKey,
      handler: workflow.handler(this.container, this.context),
      response,
    })
  }

  async registerStepFailure(
    workflowId: string,
    idempotencyKey: string,
    error?: Error | any
  ): Promise<DistributedTransactionType> {
    // Goes through the accessor so a workflow a build manifest deferred loads
    const workflow = WorkflowManager.getWorkflow(workflowId)
    if (!workflow) {
      throw new Error(`Workflow with id "${workflowId}" not found.`)
    }
    const orchestrator = workflow.orchestrator
    orchestrator.once("resume", (transaction) => {
      if (this.subscribe.onStepBegin) {
        transaction.once("stepBegin", this.subscribe.onStepBegin)
      }

      if (this.subscribe.onStepSuccess) {
        transaction.once("stepSuccess", this.subscribe.onStepSuccess)
      }

      if (this.subscribe.onStepFailure) {
        transaction.once("stepFailure", this.subscribe.onStepFailure)
      }
    })

    return await workflow.orchestrator.registerStepFailure({
      responseIdempotencyKey: idempotencyKey,
      error,
      handler: workflow.handler(this.container, this.context),
    })
  }
}
