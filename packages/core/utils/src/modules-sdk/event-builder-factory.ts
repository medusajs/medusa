import { Context, EventBusTypes } from "@medusajs/types"
import { buildEventNameFromObjectName } from "../event-bus"

// TODO should that move closer to the event bus? and maybe be rename to moduleEventBuilderFactory

/**
 *
 * Factory function to create event builders for different entities
 *
 * @example
 * const createdFulfillment = eventBuilderFactory({
 *   source: Modules.FULFILLMENT,
 *   action: CommonEvents.CREATED,
 *   object: "fulfillment",
 *   eventsEnum: FulfillmentEvents,
 * })
 *
 * createdFulfillment({
 *   data,
 *   sharedContext,
 * })
 *
 * @param action
 * @param object
 * @param eventsEnum
 * @param service
 */
export function eventBuilderFactory({
  action,
  object,
  eventsEnum,
  eventName,
  source,
}: {
  action: string
  object: string
  /**
   * @deprecated use eventName instead
   */
  eventsEnum?: Record<string, string>
  eventName?: string
  source: string
}) {
  return function ({
    data,
    sharedContext,
  }: {
    data: { id: string } | { id: string }[]
    sharedContext: Context
  }) {
    data = Array.isArray(data) ? data : [data]

    if (!data.length) {
      return
    }

    const aggregator = sharedContext.messageAggregator!
    const messages: EventBusTypes.RawMessageFormat[] = []

    // The event enums contains event formatted like so [object]_[action] e.g. PRODUCT_CREATED
    // We expect the keys of events to be fully uppercased
    let eventName_ = eventsEnum
      ? eventsEnum[`${object.toUpperCase()}_${action.toUpperCase()}`]
      : eventName

    if (!eventName_) {
      eventName_ = buildEventNameFromObjectName({
        prefix: source,
        objectName: object,
        action,
      })
    }

    data.forEach((dataItem) => {
      messages.push({
        source,
        action,
        context: sharedContext,
        data: { id: dataItem.id },
        eventName: eventName_,
        object,
      })
    })

    aggregator.saveRawMessageData(messages)
  }
}
