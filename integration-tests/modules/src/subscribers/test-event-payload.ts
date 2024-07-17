import { SubscriberConfig } from "@medusajs/medusa/src"

const testEventPayloadHandlerMock = jest.fn()

export default testEventPayloadHandlerMock

export const config: SubscriberConfig = {
  event: "test-event-payload",
}
