import { MessageAggregator } from "../../event-bus"
import { InjectIntoContext } from "./inject-into-context"

export function EmitEvents() {
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

      await target.emitEvents_.apply(this, [aggregator.getMessages()])

      aggregator.clearMessages()
      return result
    }
  }
}
