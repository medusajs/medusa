import type {
  IEventBusModuleService,
  Logger,
  MedusaContainer,
} from "@medusajs/framework/types"
import { GROUPED_EVENT_BUS_TARGET, Modules } from "@medusajs/framework/utils"

/**
 * Run metadata flag set on runs started before the event group router was
 * installed, whose events are grouped on the event bus itself.
 */
export const EVENTS_GROUPED_ON_BUS = "eventsGroupedOnBus"

/**
 * Releases, or clears when the run did not succeed, the events grouped on the
 * event bus itself under the run's event group. Events staged with the run
 * are released by the outbox instead.
 */
export async function releaseEventGroup(
  context: Record<string, any> | undefined,
  status: string,
  container: MedusaContainer | undefined,
  logger: Pick<Logger, "error">
) {
  const eventGroupId = context?.eventGroupId
  if (!eventGroupId || context?.preventReleaseEvents) {
    return
  }

  const resolved = container?.resolve?.<IEventBusModuleService>(
    Modules.EVENT_BUS,
    { allowUnregistered: true }
  )
  const eventBus = (resolved?.[GROUPED_EVENT_BUS_TARGET] ?? resolved) as
    | IEventBusModuleService
    | undefined
  if (!eventBus) {
    return
  }

  // A failed release is logged; it never undoes a run that succeeded.
  try {
    if (status === "succeeded") {
      await eventBus.releaseGroupedEvents(eventGroupId)
    } else {
      await eventBus.clearGroupedEvents(eventGroupId)
    }
  } catch (error) {
    logger.error(
      `Failed to ${
        status === "succeeded" ? "release" : "clear"
      } grouped events for ${eventGroupId}: ${error}`
    )
  }
}
