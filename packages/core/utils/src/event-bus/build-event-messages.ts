import { Context, EventBusTypes } from "@medusajs/types"

/**
 * Helper function to compose and normalize a Message to be emitted by EventBus Module
 * @param eventName  Name of the event to be emitted
 * @param data The content of the message
 * @param metadata Metadata of the message
 * @param context Context from the caller service
 * @param options Options to be passed to the event bus
 */
export function composeMessage(
  eventName: string,
  {
    data,
    service,
    object,
    action,
    context = {},
    options,
  }: {
    data: any
    service: string
    object: string
    action?: string
    context?: Context
    options?: Record<string, any>
  }
): EventBusTypes.Message {
  const act = action || eventName.split(".").pop()
  if (
    !action /* && !Object.values(CommonEvents).includes(act as CommonEvents)*/
  ) {
    throw new Error("Action is required if eventName is not a CommonEvent")
  }

  const metadata: EventBusTypes.MessageBody["metadata"] = {
    service,
    object,
    action: act!,
  }

  if (context.eventGroupId) {
    metadata.eventGroupId = context.eventGroupId
  }

  return {
    eventName,
    body: {
      metadata,
      data,
    },
    options,
  }
}
