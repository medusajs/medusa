import {
  moduleLoader,
  ModulesDefinition,
  registerMedusaModule,
} from "@medusajs/modules-sdk"
import { MedusaContainer } from "@medusajs/types"
import { ContainerRegistrationKeys, generateJwtToken } from "@medusajs/utils"
import { asValue } from "../../../deps/awilix"
import express from "express"
import querystring from "querystring"
import supertest from "supertest"
import { configManager } from "../../../config"
import { container } from "../../../container"
import { featureFlagsLoader } from "../../../feature-flags"
import { logger as defaultLogger } from "../../../logger"
import { ApiLoader } from "../../router"
import { MedusaRequest } from "../../types"
import { config } from "../mocks"

function asArray(resolvers) {
  return {
    resolve: (container) =>
      resolvers.map((resolver) => container.build(resolver)),
  }
}

/**
 * Sets up a test server that injects API Routes using the RoutesLoader
 *
 * @param {String} rootDir - The root directory of the project
 */
export const createServer = async (rootDir) => {
  const app = express()

  const moduleResolutions = {}
  Object.entries(ModulesDefinition).forEach(([moduleKey, module]) => {
    moduleResolutions[moduleKey] = registerMedusaModule({
      moduleKey,
      moduleDeclaration: module.defaultModuleDeclaration,
      moduleExports: undefined,
      definition: module,
    })[moduleKey]
  })

  configManager.loadConfig({
    projectConfig: config,
    baseDir: rootDir,
  })

  container.registerAdd = function (this: MedusaContainer, name, registration) {
    const storeKey = name + "_STORE"

    if (this.registrations[storeKey] === undefined) {
      this.register(storeKey, asValue([]))
    }
    const store = this.resolve(storeKey) as Array<any>

    if (this.registrations[name] === undefined) {
      this.register(name, asArray(store))
    }
    store.unshift(registration)

    return this
  }.bind(container)

  container.register(ContainerRegistrationKeys.PG_CONNECTION, asValue({}))
  container.register("configModule", asValue(config))
  container.register(ContainerRegistrationKeys.LOGGER, asValue(defaultLogger))
  container.register({
    manager: asValue({}),
  })

  app.set("trust proxy", 1)
  app.use((req, _res, next) => {
    req["session"] = {}
    const data = req.get("Cookie")
    if (data) {
      req["session"] = {
        ...req["session"],
        ...JSON.parse(data),
      }
    }
    next()
  })

  await featureFlagsLoader()
  await moduleLoader({ container, moduleResolutions, logger: defaultLogger })

  app.use((req, res, next) => {
    ;(req as MedusaRequest).scope = container.createScope() as MedusaContainer
    next()
  })

  await new ApiLoader({
    app,
    sourceDir: rootDir,
    container,
  }).load()

  const superRequest = supertest(app)

  return {
    request: async (method, url, opts: any = {}) => {
      const { payload, query, headers = {} } = opts

      const queryParams = query && querystring.stringify(query)
      const req = superRequest[method.toLowerCase()](
        `${url}${queryParams ? "?" + queryParams : ""}`
      )
      headers.Cookie = headers.Cookie || ""

      if (opts.adminSession) {
        const token = generateJwtToken(
          {
            actor_id: opts.adminSession.userId || opts.adminSession.jwt?.userId,
            actor_type: "user",
            app_metadata: {
              user_id:
                opts.adminSession.userId || opts.adminSession.jwt?.userId,
            },
          },
          {
            secret: config.projectConfig.http.jwtSecret!,
            expiresIn: "1d",
          }
        )

        headers.Authorization = `Bearer ${token}`
      }

      if (opts.clientSession) {
        const token = generateJwtToken(
          {
            actor_id:
              opts.clientSession.customer_id ||
              opts.clientSession.jwt?.customer_id,
            actor_type: "customer",
            app_metadata: {
              customer_id:
                opts.clientSession.customer_id ||
                opts.clientSession.jwt?.customer_id,
            },
          },
          { secret: config.projectConfig.http.jwtSecret!, expiresIn: "1d" }
        )

        headers.Authorization = `Bearer ${token}`
      }

      for (const name in headers) {
        if ({}.hasOwnProperty.call(headers, name)) {
          req.set(name, headers[name])
        }
      }

      if (payload && !req.get("content-type")) {
        req.set("Content-Type", "application/json")
      }

      if (!req.get("accept")) {
        req.set("Accept", "application/json")
      }

      req.set("Host", "localhost")

      let res
      try {
        res = await req.send(JSON.stringify(payload))
      } catch (e) {
        if (e.response) {
          res = e.response
        } else {
          throw e
        }
      }

      return res
    },
  }
}
