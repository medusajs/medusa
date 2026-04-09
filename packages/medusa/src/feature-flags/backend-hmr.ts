import { FlagSettings } from "@medusajs/framework/feature-flags"

const BackendHmrFeatureFlag: FlagSettings = {
  key: "backend_hmr",
  default_val: false,
  env_key: "MEDUSA_FF_BACKEND_HMR",
  description:
    "Enable experimental Hot Module Replacement (HMR) for backend development. " +
    "When enabled, route, middleware, workflows and steps changes reload in <10ms without restarting the server. " +
    "Database connections and container state persist across reloads.",
}

export default BackendHmrFeatureFlag
