import type { Model } from "./Model"
import type { Service } from "./Service"

export interface Client {
  version: string
  server: string
  models: Model[]
  services: Service[]
}
