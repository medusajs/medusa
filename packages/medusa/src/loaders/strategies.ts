import glob from "glob"
import path from "path"
import { asFunction, aliasTo } from "awilix"

import formatRegistrationName from "../utils/format-registration-name"
import { isBatchJobStrategy } from "../interfaces"
import { MedusaContainer } from "../types/global"
import { isDefined } from "../utils"
import { isAuthStrategy } from "../interfaces/authentication-strategy"
import { Express } from "express"

type LoaderOptions = {
  container: MedusaContainer
  configModule: object
  isTest?: boolean
}

/**
 * Registers all strategies in the strategies directory
 * @returns void
 */
export default ({ container, configModule, isTest }: LoaderOptions): void => {
  const useMock = isDefined(isTest) ? isTest : process.env.NODE_ENV === "test"

  const corePath = useMock
    ? "../strategies/__mocks__/[!__]*.js"
    : "../strategies/**/[!__]*.js"

  const coreFull = path.join(__dirname, corePath)

  const core = glob.sync(coreFull, {
    cwd: __dirname,
    ignore: [
      "**/__fixtures__/**",
      "**/index.js",
      "**/index.ts",
      "**/utils.js",
      "**/utils.ts",
      "**/types.js",
      "**/types.ts",
    ],
  })

  for (const fn of core) {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const loaded = require(fn).default
    const name = formatRegistrationName(fn)

    if (isBatchJobStrategy(loaded.prototype)) {
      container.registerAdd(
        "batchJobStrategies",
        asFunction((cradle) => new loaded(cradle, configModule))
      )

      container.register({
        [name]: asFunction(
          (cradle) => new loaded(cradle, configModule)
        ).singleton(),
        [`batch_${loaded.identifier}`]: aliasTo(name),
        [`batchType_${loaded.batchType}`]: aliasTo(name),
      })
    } else {
      container.register({
        [name]: asFunction(
          (cradle) => new loaded(cradle, configModule)
        ).singleton(),
      })
    }
  }
}

type AuthLoaderOptions = {
  container: MedusaContainer
  configModule: object
  app: Express
}

/**
 * Registers all authentication strategies in the strategies directory
 * @returns void
 */
export async function authStrategies({
  container,
  configModule,
  app,
}: AuthLoaderOptions): Promise<void> {
  const isTest = process.env.NODE_ENV === "test"

  const corePath = isTest
    ? "../strategies/authentication/**/[!__]*.{js,ts}"
    : "../strategies/authentication/**/[!__]*.js"

  const coreFull = path.join(__dirname, corePath)

  const core = glob.sync(coreFull, {
    cwd: __dirname,
    ignore: ["**/__fixtures__/**", "**/__tests__/**"],
  })

  for (const fn of core) {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const loaded = require(fn).default
    const name = formatRegistrationName(fn)

    if (isAuthStrategy(loaded.prototype)) {
      if (loaded.beforeInit) {
        await loaded.beforeInit(app, container, configModule)
      }

      container.registerAdd(
        "authenticationStrategies",
        asFunction((cradle) => new loaded(cradle, configModule))
      )

      container.register({
        [name]: asFunction(
          (cradle) => new loaded(cradle, configModule)
        ).singleton(),
        [`auth_${loaded.identifier}`]: aliasTo(name),
      })
    }
  }
}
