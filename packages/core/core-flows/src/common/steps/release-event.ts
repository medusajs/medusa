import { ModuleRegistrationName } from "@medusajs/utils"
import { createStep } from "@medusajs/workflows-sdk"

export const releaseEventsStepId = "release-events-step"
export const releaseEventsStep = createStep(
  releaseEventsStepId,
  async (input: void, { container, eventGroupId }) => {
    const eventBusService = container.resolve(
      ModuleRegistrationName.EVENT_BUS,
      { allowUnregistered: true }
    )
    if (!eventBusService) {
      return
    }

    await eventBusService.releaseGroupedEvents(eventGroupId)
  },
  async (data: void) => {}
)
