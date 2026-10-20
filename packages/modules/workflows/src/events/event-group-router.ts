import type {
  EventBusTypes,
  IEventBusModuleService,
  MedusaContainer,
} from "@medusajs/framework/types"
import type { EventGroupRouter } from "@medusajs/framework/utils"
import {
  GROUPED_EVENT_BUS_TARGET,
  Modules,
  SET_EVENT_GROUP_ROUTER,
} from "@medusajs/framework/utils"
import type { Outbox } from "@medusajs/workflow-engine"

/**
 * Sends a workflow's grouped events to the outbox, which publishes them when
 * the root workflow succeeds.
 */
function createEventGroupRouter(outbox: Outbox): EventGroupRouter {
  return {
    owns: (eventGroupId) => outbox.owns(eventGroupId),
    stage: (eventGroupId, messages) => outbox.stage(eventGroupId, messages),
    release: (eventGroupId) => outbox.release(eventGroupId),
    discard: (eventGroupId, options) =>
      outbox.discard(eventGroupId, { names: options?.eventNames }),
  }
}

/**
 * Makes the event bus stage grouped events with the run that emits them.
 * Returns whether the event bus supports it.
 */
export function installEventGroupRouter(
  container: MedusaContainer | undefined,
  outbox: Outbox
): boolean {
  const eventBus = container?.resolve<IEventBusModuleService>(
    Modules.EVENT_BUS,
    { allowUnregistered: true }
  )
  const setRouter = eventBus?.[SET_EVENT_GROUP_ROUTER]
  if (!setRouter) {
    return false
  }
  setRouter(createEventGroupRouter(outbox))
  return true
}

/**
 * Publishes released messages through the event bus, as plain events: the
 * group is removed so the provider emits them instead of staging them. They go
 * to the wrapped bus, since they already went through the grouping wrapper
 * when they were staged.
 */
export function createEventPublisher(
  resolveEventBus: () => IEventBusModuleService | undefined
) {
  return async (messages: unknown[]) => {
    const eventBus = resolveEventBus()
    if (!eventBus || !messages.length) {
      return
    }
    const ungrouped = (messages as EventBusTypes.Message<unknown>[]).map(
      (message) => {
        const { eventGroupId, ...metadata } = message.metadata ?? {}
        void eventGroupId
        return { ...message, metadata }
      }
    )
    const target = (eventBus[GROUPED_EVENT_BUS_TARGET] ??
      eventBus) as IEventBusModuleService
    await target.emit(ungrouped, {})
  }
}
