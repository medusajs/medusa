import {
  ContainerRegistrationKeys,
  createMedusaContainer,
  getConfigFile,
  isObject,
} from "@medusajs/utils"
import { asValue } from "awilix"
import { migrateMedusaApp } from "@medusajs/medusa/dist/loaders/medusa-app"
import { ConfigModule } from "@medusajs/types"

export async function initDb({
  cwd,
  env = {},
}: {
  cwd: string
  env?: Record<any, any>
}) {
  if (isObject(env)) {
    Object.entries(env).forEach(([k, v]) => (process.env[k] = v))
  }

  const { configModule } = getConfigFile(cwd, `medusa-config`) as {
    configModule: ConfigModule
  }

  const pgConnectionLoader =
    require("@medusajs/medusa/dist/loaders/pg-connection").default

  const featureFlagLoader =
    require("@medusajs/medusa/dist/loaders/feature-flags").default

  const container = createMedusaContainer()

  const featureFlagRouter = await featureFlagLoader(configModule)

  const pgConnection = await pgConnectionLoader({ configModule, container })

  container.register({
    [ContainerRegistrationKeys.CONFIG_MODULE]: asValue(configModule),
    [ContainerRegistrationKeys.LOGGER]: asValue(console),
    [ContainerRegistrationKeys.PG_CONNECTION]: asValue(pgConnection),
    featureFlagRouter: asValue(featureFlagRouter),
  })

  await migrateMedusaApp({ configModule, container })

  return pgConnection
}
