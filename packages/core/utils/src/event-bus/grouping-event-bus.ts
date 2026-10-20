import type { EventBusTypes, IEventBusModuleService } from "@medusajs/types"

/**
 * Takes over grouped events for the groups it owns, for example the event
 * group of a running workflow.
 */
export interface EventGroupRouter {
  owns(eventGroupId: string): boolean
  stage(
    eventGroupId: string,
    messages: EventBusTypes.Message<unknown>[]
  ): Promise<void>
  release(eventGroupId: string): Promise<void>
  discard(
    eventGroupId: string,
    options?: { eventNames?: string[] }
  ): Promise<void>
}

export const SET_EVENT_GROUP_ROUTER = Symbol.for(
  "medusa.eventBus.setGroupRouter"
)

/**
 * The bus `withEventGrouping` wraps. Releasing or clearing a group on it
 * touches only the events it grouped itself, never those a router staged.
 */
export const GROUPED_EVENT_BUS_TARGET = Symbol.for("medusa.eventBus.target")

// Options that only apply to staging on the wrapped bus.
const STAGING_OPTIONS = ["groupedEventsTTL"]

/**
 * Wraps an event bus so that a group router can take over grouped events. Until
 * a router is set, and for groups it does not own, everything goes to the
 * wrapped bus unchanged.
 */
export function withEventGrouping<T extends IEventBusModuleService>(
  bus: T
): T {
  let router: EventGroupRouter | undefined

  const emit = async (
    data:
      | EventBusTypes.Message<unknown>
      | EventBusTypes.Message<unknown>[],
    options: Record<string, unknown> = {}
  ) => {
    if (!router) {
      return bus.emit(data as any, options)
    }

    const messages = Array.isArray(data) ? data : [data]
    const staged = new Map<string, EventBusTypes.Message<unknown>[]>()
    const passThrough: EventBusTypes.Message<unknown>[] = []

    for (const message of messages) {
      const eventGroupId = message?.metadata?.eventGroupId
      if (eventGroupId && router.owns(eventGroupId)) {
        staged.set(eventGroupId, [...(staged.get(eventGroupId) ?? []), message])
      } else {
        passThrough.push(message)
      }
    }

    // The router's API takes no emit options, so they are kept on each
    // message, where the bus reads them when the group is published.
    const messageOptions = Object.fromEntries(
      Object.entries(options).filter(([key]) => !STAGING_OPTIONS.includes(key))
    )
    const withOptions = (message: EventBusTypes.Message<unknown>) =>
      Object.keys(messageOptions).length
        ? { ...message, options: { ...messageOptions, ...message.options } }
        : message

    for (const [eventGroupId, groupMessages] of staged) {
      await router.stage(eventGroupId, groupMessages.map(withOptions))
    }
    if (passThrough.length) {
      await bus.emit(
        (Array.isArray(data) ? passThrough : passThrough[0]) as any,
        options
      )
    }
  }

  const setRouter = (next: EventGroupRouter | undefined) => {
    router = next
  }
  const releaseGroupedEvents = (eventGroupId: string) =>
    router?.owns(eventGroupId)
      ? router.release(eventGroupId)
      : bus.releaseGroupedEvents(eventGroupId)
  const clearGroupedEvents = (
    eventGroupId: string,
    options?: { eventNames?: string[] }
  ) =>
    router?.owns(eventGroupId)
      ? router.discard(eventGroupId, options)
      : bus.clearGroupedEvents(eventGroupId, options)

  const overrides = new Map<PropertyKey, unknown>([
    [SET_EVENT_GROUP_ROUTER, setRouter],
    [GROUPED_EVENT_BUS_TARGET, bus],
    ["emit", emit],
    ["releaseGroupedEvents", releaseGroupedEvents],
    ["clearGroupedEvents", clearGroupedEvents],
  ])
  const defaults = new Map(overrides)
  const bound = new WeakMap<Function, Function>()

  return new Proxy(bus, {
    // Replacing an overridden method, as a test spy does, replaces the
    // override: written to the wrapped bus, it would call itself through it.
    set(target, prop, value) {
      if (overrides.has(prop)) {
        overrides.set(prop, value)
        return true
      }
      return Reflect.set(target, prop, value)
    },
    deleteProperty(target, prop) {
      if (defaults.has(prop)) {
        overrides.set(prop, defaults.get(prop))
        return true
      }
      return Reflect.deleteProperty(target, prop)
    },
    get(target, prop) {
      if (overrides.has(prop)) {
        return overrides.get(prop)
      }
      const value = Reflect.get(target, prop, target)
      if (typeof value !== "function" || prop === "constructor") {
        return value
      }
      let fn = bound.get(value)
      if (!fn) {
        fn = value.bind(target)
        bound.set(value, fn!)
      }
      return fn
    },
  })
}
