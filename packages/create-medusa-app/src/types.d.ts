declare module "medusa-telemetry"

type CreateOptions = {
  repoUrl?: string
  seed?: boolean
  // commander passed --no-boilerplate as boilerplate
  boilerplate?: boolean
}
