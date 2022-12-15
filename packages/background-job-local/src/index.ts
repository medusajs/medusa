import { ModuleExports } from "@medusajs/medusa"
import Loader from "./loaders/index"
import BackgroundJobService from "./services/background-job-local"

export const services = [BackgroundJobService]
export const loaders = [Loader]

export default {
  services,
  loaders,
} as ModuleExports
