import { Context, LoadedModule, MedusaContainer } from "@medusajs/types"
import {
  MedusaContext,
  MedusaContextType,
  MedusaModuleType,
  createMedusaContainer,
  isDefined,
  isString,
} from "@medusajs/utils"
import { asValue } from "awilix"
import {
  DistributedTransaction,
  DistributedTransactionEvent,
  DistributedTransactionEvents,
  TransactionModelOptions,
  TransactionOrchestrator,
  TransactionStepsDefinition,
} from "../transaction"
import { OrchestratorBuilder } from "../transaction/orchestrator-builder"
import {
  WorkflowDefinition,
  WorkflowManager,
  WorkflowStepHandler,
} from "./workflow-manager"

type StepHandler = {
  invoke: WorkflowStepHandler
  compensate?: WorkflowStepHandler
}

export class LocalWorkflow {
  protected container: MedusaContainer
  protected workflowId: string
  protected flow: OrchestratorBuilder
  protected customOptions: Partial<TransactionModelOptions> = {}
  protected workflow: WorkflowDefinition
  protected handlers: Map<string, StepHandler>
  protected medusaContext?: Context

  constructor(
    workflowId: string,
    modulesLoaded: LoadedModule[] | MedusaContainer
  ) {
    const globalWorkflow = WorkflowManager.getWorkflow(workflowId)
    if (!globalWorkflow) {
      throw new Error(`Workflow with id "${workflowId}" not found.`)
    }

    this.flow = new OrchestratorBuilder(globalWorkflow.flow_)
    this.workflowId = workflowId
    this.workflow = globalWorkflow
    this.handlers = new Map(globalWorkflow.handlers_)

    let container

    if (!Array.isArray(modulesLoaded) && modulesLoaded) {
      if (!("cradle" in modulesLoaded)) {
        container = createMedusaContainer(modulesLoaded)
      } else {
        container = createMedusaContainer({}, modulesLoaded) // copy container
      }
    } else if (Array.isArray(modulesLoaded) && modulesLoaded.length) {
      container = createMedusaContainer()

      for (const mod of modulesLoaded) {
        const registrationName = mod.__definition.registrationName
        container.register(registrationName, asValue(mod))
      }
    }

    this.container = this.contextualizedMedusaModules(container)
  }

  private contextualizedMedusaModules(container) {
    if (!container) {
      return createMedusaContainer()
    }

    // eslint-disable-next-line
    const this_ = this
    const originalResolver = container.resolve
    container.resolve = function (registrationName, opts) {
      const resolved = originalResolver(registrationName, opts)
      if (resolved?.constructor?.__type !== MedusaModuleType) {
        return resolved
      }

      return new Proxy(resolved, {
        get: function (target, prop) {
          if (typeof target[prop] !== "function") {
            return target[prop]
          }

          return async (...args) => {
            const ctxIndex = MedusaContext.getIndex(target, prop as string)

            const hasContext = args[ctxIndex!]?.__type === MedusaContextType
            if (!hasContext && isDefined(ctxIndex)) {
              const context = this_.medusaContext
              if (context?.__type === MedusaContextType) {
                delete context?.manager
                delete context?.transactionManager

                args[ctxIndex] = context
              }
            }
            return await target[prop].apply(target, [...args])
          }
        },
      })
    }
    return container
  }

  protected commit() {
    const finalFlow = this.flow.build()

    const globalWorkflow = WorkflowManager.getWorkflow(this.workflowId)
    const customOptions = {
      ...globalWorkflow?.options,
      ...this.customOptions,
    }

    this.workflow = {
      id: this.workflowId,
      flow_: finalFlow,
      orchestrator: new TransactionOrchestrator(
        this.workflowId,
        finalFlow,
        customOptions
      ),
      options: customOptions,
      handler: WorkflowManager.buildHandlers(this.handlers),
      handlers_: this.handlers,
    }
  }

  public getFlow() {
    if (this.flow.hasChanges) {
      this.commit()
    }

    return this.workflow.flow_
  }

  private registerEventCallbacks({
    orchestrator,
    transaction,
    subscribe,
    idempotencyKey,
  }: {
    orchestrator: TransactionOrchestrator
    transaction?: DistributedTransaction
    subscribe?: DistributedTransactionEvents
    idempotencyKey?: string
  }) {
    const modelId = orchestrator.id
    let transactionId

    if (transaction) {
      transactionId = transaction!.transactionId
    } else if (idempotencyKey) {
      const [, trxId] = idempotencyKey!.split(":")
      transactionId = trxId
    }

    const eventWrapperMap = new Map()
    for (const [key, handler] of Object.entries(subscribe ?? {})) {
      eventWrapperMap.set(key, (args) => {
        const { transaction } = args

        if (
          transaction.transactionId !== transactionId ||
          transaction.modelId !== modelId
        ) {
          return
        }

        handler(args)
      })
    }

    if (subscribe?.onBegin) {
      orchestrator.on(
        DistributedTransactionEvent.BEGIN,
        eventWrapperMap.get("onBegin")
      )
    }

    if (subscribe?.onResume) {
      orchestrator.on(
        DistributedTransactionEvent.RESUME,
        eventWrapperMap.get("onResume")
      )
    }

    if (subscribe?.onCompensateBegin) {
      orchestrator.on(
        DistributedTransactionEvent.COMPENSATE_BEGIN,
        eventWrapperMap.get("onCompensateBegin")
      )
    }

    if (subscribe?.onTimeout) {
      orchestrator.on(
        DistributedTransactionEvent.TIMEOUT,
        eventWrapperMap.get("onTimeout")
      )
    }

    if (subscribe?.onFinish) {
      orchestrator.on(
        DistributedTransactionEvent.FINISH,
        eventWrapperMap.get("onFinish")
      )
    }

    const resumeWrapper = ({ transaction }) => {
      if (
        transaction.modelId !== modelId ||
        transaction.transactionId !== transactionId
      ) {
        return
      }

      if (subscribe?.onStepBegin) {
        transaction.on(
          DistributedTransactionEvent.STEP_BEGIN,
          eventWrapperMap.get("onStepBegin")
        )
      }

      if (subscribe?.onStepSuccess) {
        transaction.on(
          DistributedTransactionEvent.STEP_SUCCESS,
          eventWrapperMap.get("onStepSuccess")
        )
      }

      if (subscribe?.onStepFailure) {
        transaction.on(
          DistributedTransactionEvent.STEP_FAILURE,
          eventWrapperMap.get("onStepFailure")
        )
      }

      if (subscribe?.onStepAwaiting) {
        transaction.on(
          DistributedTransactionEvent.STEP_AWAITING,
          eventWrapperMap.get("onStepAwaiting")
        )
      }

      if (subscribe?.onCompensateStepSuccess) {
        transaction.on(
          DistributedTransactionEvent.COMPENSATE_STEP_SUCCESS,
          eventWrapperMap.get("onCompensateStepSuccess")
        )
      }

      if (subscribe?.onCompensateStepFailure) {
        transaction.on(
          DistributedTransactionEvent.COMPENSATE_STEP_FAILURE,
          eventWrapperMap.get("onCompensateStepFailure")
        )
      }
    }

    if (transaction) {
      resumeWrapper({ transaction })
    } else {
      orchestrator.once("resume", resumeWrapper)
    }

    const cleanUp = () => {
      subscribe?.onFinish &&
        orchestrator.removeListener(
          DistributedTransactionEvent.FINISH,
          eventWrapperMap.get("onFinish")
        )
      subscribe?.onResume &&
        orchestrator.removeListener(
          DistributedTransactionEvent.RESUME,
          eventWrapperMap.get("onResume")
        )
      subscribe?.onBegin &&
        orchestrator.removeListener(
          DistributedTransactionEvent.BEGIN,
          eventWrapperMap.get("onBegin")
        )
      subscribe?.onCompensateBegin &&
        orchestrator.removeListener(
          DistributedTransactionEvent.COMPENSATE_BEGIN,
          eventWrapperMap.get("onCompensateBegin")
        )
      subscribe?.onTimeout &&
        orchestrator.removeListener(
          DistributedTransactionEvent.TIMEOUT,
          eventWrapperMap.get("onTimeout")
        )

      orchestrator.removeListener(
        DistributedTransactionEvent.RESUME,
        resumeWrapper
      )

      eventWrapperMap.clear()
    }

    return {
      cleanUpEventListeners: cleanUp,
    }
  }

  async run(
    uniqueTransactionId: string,
    input?: unknown,
    context?: Context,
    subscribe?: DistributedTransactionEvents
  ) {
    if (this.flow.hasChanges) {
      this.commit()
    }
    this.medusaContext = context
    const { handler, orchestrator } = this.workflow

    const transaction = await orchestrator.beginTransaction(
      uniqueTransactionId,
      handler(this.container, context),
      input
    )

    const { cleanUpEventListeners } = this.registerEventCallbacks({
      orchestrator,
      transaction,
      subscribe,
    })

    await orchestrator.resume(transaction)

    cleanUpEventListeners()

    return transaction
  }

  async getRunningTransaction(uniqueTransactionId: string, context?: Context) {
    this.medusaContext = context
    const { handler, orchestrator } = this.workflow

    const transaction = await orchestrator.retrieveExistingTransaction(
      uniqueTransactionId,
      handler(this.container, context)
    )

    return transaction
  }

  async cancel(
    transactionOrTransactionId: string | DistributedTransaction,
    context?: Context,
    subscribe?: DistributedTransactionEvents
  ) {
    this.medusaContext = context
    const { orchestrator } = this.workflow

    const transaction = isString(transactionOrTransactionId)
      ? await this.getRunningTransaction(transactionOrTransactionId, context)
      : transactionOrTransactionId

    const { cleanUpEventListeners } = this.registerEventCallbacks({
      orchestrator,
      transaction,
      subscribe,
    })

    await orchestrator.cancelTransaction(transaction)

    cleanUpEventListeners()

    return transaction
  }

  async registerStepSuccess(
    idempotencyKey: string,
    response?: unknown,
    context?: Context,
    subscribe?: DistributedTransactionEvents
  ): Promise<DistributedTransaction> {
    this.medusaContext = context
    const { handler, orchestrator } = this.workflow

    const { cleanUpEventListeners } = this.registerEventCallbacks({
      orchestrator,
      idempotencyKey,
      subscribe,
    })

    const transaction = await orchestrator.registerStepSuccess(
      idempotencyKey,
      handler(this.container, context),
      undefined,
      response
    )

    cleanUpEventListeners()

    return transaction
  }

  async registerStepFailure(
    idempotencyKey: string,
    error?: Error | any,
    context?: Context,
    subscribe?: DistributedTransactionEvents
  ): Promise<DistributedTransaction> {
    this.medusaContext = context
    const { handler, orchestrator } = this.workflow

    const { cleanUpEventListeners } = this.registerEventCallbacks({
      orchestrator,
      idempotencyKey,
      subscribe,
    })

    const transaction = await orchestrator.registerStepFailure(
      idempotencyKey,
      error,
      handler(this.container, context)
    )

    cleanUpEventListeners()

    return transaction
  }

  setOptions(options: Partial<TransactionModelOptions>) {
    this.customOptions = options
    return this
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
