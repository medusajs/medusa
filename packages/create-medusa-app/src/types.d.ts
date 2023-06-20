import { Ora } from "ora"
import ProcessManager from "./utils/process-manager.js"

declare module "medusa-telemetry"

export type CreateOptions = {
  repoUrl?: string
  seed?: boolean
  // commander passed --no-boilerplate as boilerplate
  boilerplate?: boolean
}

export type FactBoxOptions = {
  interval: NodeJS.Timer | null
  spinner: Ora
  processManager: ProcessManager
  message?: string
  title?: string
}
