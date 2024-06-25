import { Context, EventBusTypes } from "@medusajs/types"

/**
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
  source,
}: {
  action: string
  object: string
  eventsEnum: Record<string, string>
  source: string
}) {
  return function ({
    data,
    sharedContext,
  }: {
    data: { id: string }[]
    sharedContext: Context
  }) {
    if (!data.length) {
      return
    }

    const aggregator = sharedContext.messageAggregator!
    const messages: EventBusTypes.RawMessageFormat[] = []

    // The event enums contains event formatted like so [object]_[action] e.g. PRODUCT_CREATED
    // We expect the keys of events to be fully uppercased
    const eventName = eventsEnum[`${object.toUpperCase()}_${action.toUpperCase()}`]

    data.forEach((dataItem) => {
      messages.push({
        source,
        action,
        context: sharedContext,
        data: { id: dataItem.id },
        eventName,
        object,
      })
    })

    aggregator.saveRawMessageData(messages)
  }
}
