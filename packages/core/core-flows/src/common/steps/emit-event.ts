import { composeMessage, ModuleRegistrationName } from "@medusajs/utils"
import { createStep, StepExecutionContext } from "@medusajs/workflows-sdk"

type Input = {
  eventName: string
  source: string
  object: string
  action?: string
  options?: Record<string, any>
  data: (
    context: StepExecutionContext
  ) => Promise<Record<any, any>> | Record<any, any>
}

export const emitEventStepId = "emit-event-step"
export const emitEventStep = createStep(
  emitEventStepId,
  async (input: Input, context) => {
    if (!input) {
      return
    }

    const { container } = context

    const eventBus = container.resolve(ModuleRegistrationName.EVENT_BUS)

    const data_ =
      typeof input.data === "function" ? await input.data(context) : input.data
    const message = composeMessage(input.eventName, {
      data: data_,
      action: input.action ?? "",
      object: input.object,
      source: input.source,
      options: input.options,
      context,
    })

    await eventBus.emit(message)
  },
  async (data: void) => {}
)
