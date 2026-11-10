import path from "path"

import { InMemoryConfigStore } from "./util/in-memory-config"
import isTruthy from "./util/is-truthy"
import OutboxStore from "./util/outbox-store"

class Store {
  constructor() {
    try {
      // configstore is ESM-only; requiring it here lets Jest (which can't load
      // ESM from node_modules) fall back to the in-memory store below.
      const { default: Configstore } = require("configstore")
      this.config_ = new Configstore(`medusa`, {}, { globalConfigPath: true })
    } catch (e) {
      this.config_ = new InMemoryConfigStore()
    }

    const baseDir = path.dirname(this.config_.path)
    this.outbox_ = new OutboxStore(baseDir)

    this.disabled_ = isTruthy(process.env.MEDUSA_DISABLE_TELEMETRY)
  }

  getQueueSize() {
    return this.outbox_.getSize()
  }

  getQueueCount() {
    return this.outbox_.getCount()
  }

  addEvent(event) {
    if (this.disabled_) {
      return
    }

    const eventString = JSON.stringify(event)
    return this.outbox_.appendToBuffer(eventString + `\n`)
  }

  async flushEvents(handler) {
    return await this.outbox_.startFlushEvents(async (eventData) => {
      const events = eventData
        .split(`\n`)
        .filter((e) => e && e.length > 2)
        .map((e) => JSON.parse(e))

      return await handler(events)
    })
  }

  getConfig(path) {
    return this.config_.get(path)
  }

  setConfig(path, val) {
    return this.config_.set(path, val)
  }
}

export default Store
