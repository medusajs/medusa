import { EventBusTypes, IEventBusModuleService } from "@medusajs/types"
import { ModuleRegistrationName } from "@medusajs/utils"
import { StepExecutionContext, createStep } from "@medusajs/workflows-sdk"

/**
 * The event's details.
 */
type Input = {
  /**
   * The event's name.
   */
  eventName: string
  /**
   * Options to emit the event.
   */
  options?: Record<string, any>
  /**
   * Metadata that the subscriber receives in the `metadata` property 
   * of its first parameter.
   */
  metadata?: Record<string, any>
  /**
   * The data payload that the subscriber receives in the `data` property
   * of its first parameter. Use this property to pass data relevant for the
   * subscriber, such as the ID of a created record.
   */
  data:
    | ((context: StepExecutionContext) => Promise<Record<any, any>>)
    | Record<any, any>
}

export const emitEventStepId = "emit-event-step"

/**
 * Emit an event.
 * 
 * @example
 * import { 
 *   createWorkflow
 * } from "@medusajs/workflows-sdk"
 * import {
 *   emitEventStep
 * } from "@medusajs/core-flows"
 * 
 * const helloWorldWorkflow = createWorkflow(
 *   "hello-world",
 *   () => {
 *     emitEventStep({
 *       eventName: "custom.created",
 *       data: {
 *         id: "123"
 *       }
 *     })
 *   }
 * )
 */
export const emitEventStep = createStep(
  emitEventStepId,
  async (input: Input, context) => {
    if (!input) {
      return
    }

    const { container } = context

    const eventBus: IEventBusModuleService = container.resolve(
      ModuleRegistrationName.EVENT_BUS
    )

    const data_ =
      typeof input.data === "function" ? await input.data(context) : input.data

    const metadata: EventBusTypes.Event["metadata"] = {
      ...input.metadata,
    }

    if (context.eventGroupId) {
      metadata.eventGroupId = context.eventGroupId
    }

    const message: EventBusTypes.Message = {
      name: input.eventName,
      data: data_,
      options: input.options,
      metadata,
    }

    await eventBus.emit(message)
  },
  async (data: void) => {}
)
