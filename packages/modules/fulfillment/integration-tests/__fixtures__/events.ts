import { EventBusTypes } from "@medusajs/types"

export function buildExpectedEventMessageShape(options: {
  eventName: string
  action: string
  object: string
  eventGroupId?: string
  data: any
  options?: Record<string, unknown>
}): EventBusTypes.Message {
  return {
    eventName: options.eventName,
    metadata: {
      action: options.action,
      eventGroupId: options.eventGroupId,
      source: "fulfillment",
      object: options.object,
    },
    data: options.data,
    options: options.options,
  }
}
