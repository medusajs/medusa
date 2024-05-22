import { MessageAggregator } from "../../event-bus"
import { InjectIntoContext } from "./inject-into-context"
import { MessageAggregatorFormat } from "@medusajs/types"

export function EmitEvents(
  options: MessageAggregatorFormat = {} as MessageAggregatorFormat
) {
  return function (
    target: any,
    propertyKey: string | symbol,
    descriptor: any
  ): void {
    const aggregator = new MessageAggregator()
    InjectIntoContext({
      messageAggregator: () => aggregator,
    })(target, propertyKey, descriptor)

    const original = descriptor.value

    descriptor.value = async function (...args: any[]) {
      const result = await original.apply(this, args)

      if (!target.emitEvents_) {
        const logger = this.__container__?.["logger"]
          ? this.__container__?.["logger"]
          : console
        logger.warn(
          `No emitEvents_ method found on ${target.constructor.name}. No events emitted. To be able to use the @EmitEvents() you need to have the emitEvents_ method implemented in the class.`
        )
      }

      await target.emitEvents_.apply(this, [aggregator.getMessages(options)])

      aggregator.clearMessages()
      return result
    }
  }
}
