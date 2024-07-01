import { Context, LoadedModule, MedusaContainer } from "@medusajs/types"
import { createMedusaContainer } from "@medusajs/utils"
import { asValue } from "awilix"

import {
  DistributedTransaction,
  DistributedTransactionEvents,
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
        const registrationName = mod.__definition.registrationName
        container.register(registrationName, asValue(mod))
      }
    }

    this.container = container
    this.context = context ?? {}
    this.subscribe = subscribe ?? {}
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
  ): Promise<DistributedTransaction> {
    if (!WorkflowManager.workflows.has(workflowId)) {
      throw new Error(`Workflow with id "${workflowId}" not found.`)
    }

    const workflow = WorkflowManager.workflows.get(workflowId)!
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

    return await workflow.orchestrator.registerStepFailure(
      idempotencyKey,
      error,
      workflow.handler(this.container, this.context)
    )
  }
}
