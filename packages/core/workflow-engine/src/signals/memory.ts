import { EventEmitter } from "node:events"
import { Notifier, NotifierMessage } from "./notifier"

/**
 * Delivers messages to every engine in this process that shares it.
 */
export function createMemoryNotifier(): Notifier {
  const emitter = new EventEmitter()
  emitter.setMaxListeners(0)
  return {
    async publish(message: NotifierMessage) {
      setImmediate(() => emitter.emit("message", message))
    },
    async subscribe(listener) {
      emitter.on("message", listener)
      return () => {
        emitter.off("message", listener)
      }
    },
  }
}
