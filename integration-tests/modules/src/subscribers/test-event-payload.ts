import { SubscriberConfig } from "@medusajs/medusa"

const testEventPayloadHandlerMock = jest.fn()

export default testEventPayloadHandlerMock

export const config: SubscriberConfig = {
  event: "test-event-payload",
}
