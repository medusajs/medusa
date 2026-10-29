import { randomUUID } from "crypto"
import os from "os"
import { join } from "path"

export class InMemoryConfigStore {
  config = {}
  path = join(os.tmpdir(), `medusa`)

  constructor() {
    this.config = this.createBaseConfig()
  }

  createBaseConfig() {
    return {
      "telemetry.enabled": true,
      "telemetry.machine_id": `not-a-machine-id-${randomUUID()}`,
    }
  }

  get(key) {
    return this.config[key]
  }

  set(key, value) {
    this.config[key] = value
  }

  all() {
    return this.config
  }

  size() {
    return Object.keys(this.config).length
  }

  has(key) {
    return !!this.config[key]
  }

  del(key) {
    delete this.config[key]
  }

  clear() {
    this.config = this.createBaseConfig()
  }
}
