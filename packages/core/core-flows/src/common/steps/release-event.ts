import { ModuleRegistrationName } from "@medusajs/utils"
import { createStep } from "@medusajs/workflows-sdk"

export const releaseEventsStepId = "emit-event-step"
export const releaseEventsStep = createStep(
  releaseEventsStepId,
  async (
    input: void,
    {
      container,
      metadata: {
        /* eventGroupId */
      },
    }
  ) => {
    const eventBus = container.resolve(ModuleRegistrationName.EVENT_BUS)
    // await eventBus.release
  },
  async (data: void) => {}
)
