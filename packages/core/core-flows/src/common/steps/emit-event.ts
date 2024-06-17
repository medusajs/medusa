import { EventBusTypes, IEventBusModuleService } from "@medusajs/types"
import { ModuleRegistrationName } from "@medusajs/utils"
import { StepExecutionContext, createStep } from "@medusajs/workflows-sdk"

type Input = {
  eventName: string
  options?: Record<string, any>
  metadata?: Record<string, any>
  data:
    | ((context: StepExecutionContext) => Promise<Record<any, any>>)
    | Record<any, any>
}

export const emitEventStepId = "emit-event-step"
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

    const metadata: EventBusTypes.MessageBody["metadata"] = {
      ...input.metadata,
    }

    if (context.eventGroupId) {
      metadata.eventGroupId = context.eventGroupId
    }

    const message = {
      eventName: input.eventName,
      data: data_,
      options: input.options,
      metadata,
    }

    await eventBus.emit(message)
  },
  async (data: void) => {}
)
