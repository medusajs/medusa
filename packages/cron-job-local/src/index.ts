import { ModuleExports } from "@medusajs/medusa"
import Loader from "./loaders"
import LocalCronJob from "./services/cron-job-local"

export const services = [LocalCronJob]
export const loaders = [Loader]

export default {
  services,
  loaders,
} as ModuleExports
