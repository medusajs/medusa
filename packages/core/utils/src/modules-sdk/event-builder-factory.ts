import { Context, EventBusTypes } from "@medusajs/types"

/**
 * Factory function to create event builders for different entities
 *
 * @example
 * const createdFulfillment = eventBuilderFactory({
 *   service: Modules.FULFILLMENT,
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
 * @param isMainEntity
 * @param action
 * @param object
 * @param eventsEnum
 * @param service
 */
export function eventBuilderFactory({
  isMainEntity,
  action,
  object,
  eventsEnum,
  service,
}: {
  isMainEntity?: boolean
  action: string
  object: string
  eventsEnum: Record<string, string>
  service: string
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

    data.forEach((dataItem) => {
      messages.push({
        service,
        action,
        context: sharedContext,
        data: { id: dataItem.id },
        eventName: isMainEntity
          ? eventsEnum[action]
          : eventsEnum[`${object}_${action}`],
        object,
      })
    })

    aggregator.saveRawMessageData(messages)
  }
}
