import { Notifier, NotifierMessage } from "./notifier"

type RedisLike = {
  publish(channel: string, message: string): Promise<unknown>
  subscribe(channel: string): Promise<unknown>
  unsubscribe(channel: string): Promise<unknown>
  on(
    event: "message",
    listener: (channel: string, message: string) => void
  ): unknown
  off?(
    event: "message",
    listener: (channel: string, message: string) => void
  ): unknown
}

/**
 * Redis pub/sub. Works behind any connection pooler. Redis holds no state, so
 * losing it only means falling back to polling.
 */
export function createRedisNotifier(options: {
  publisher: RedisLike
  subscriber: RedisLike
  channel?: string
}): Notifier {
  const channel = options.channel ?? "workflow_engine"
  return {
    async publish(message: NotifierMessage) {
      await options.publisher.publish(channel, JSON.stringify(message))
    },
    async subscribe(handler) {
      const listener = (incoming: string, message: string) => {
        if (incoming !== channel) {
          return
        }
        try {
          handler(JSON.parse(message))
        } catch {
          // A malformed message is dropped.
        }
      }
      options.subscriber.on("message", listener)
      await options.subscriber.subscribe(channel)
      return async () => {
        options.subscriber.off?.("message", listener)
        await options.subscriber.unsubscribe(channel)
      }
    },
  }
}
