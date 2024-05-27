import {
  moduleLoader,
  ModulesDefinition,
  registerMedusaModule,
} from "@medusajs/modules-sdk"
import {
  ContainerRegistrationKeys,
  createMedusaContainer,
} from "@medusajs/utils"
import { asValue } from "awilix"
import express from "express"
import jwt from "jsonwebtoken"
import querystring from "querystring"
import supertest from "supertest"
import apiLoader from "../../../../api"
import { getResolvedPlugins } from "../../../../helpers/resolve-plugins"
import featureFlagLoader, { featureFlagRouter } from "../../../../feature-flags"

import RoutesLoader from "../.."
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
    moduleResolutions[moduleKey] = registerMedusaModule(
      moduleKey,
      module.defaultModuleDeclaration,
      undefined,
      module
    )[moduleKey]
  })

  const container = createMedusaContainer()

  container.registerAdd = function (name, registration) {
    const storeKey = name + "_STORE"

    if (this.registrations[storeKey] === undefined) {
      this.register(storeKey, asValue([]))
    }
    const store = this.resolve(storeKey)

    if (this.registrations[name] === undefined) {
      this.register(name, asArray(store))
    }
    store.unshift(registration)

    return this
  }.bind(container)

  container.register(ContainerRegistrationKeys.PG_CONNECTION, asValue({}))
  container.register("featureFlagRouter", asValue(featureFlagRouter))
  container.register("configModule", asValue(config))
  container.register({
    logger: asValue({
      error: () => {},
    }),
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

  const plugins = getResolvedPlugins(rootDir, config) || []

  featureFlagLoader(config)
  await moduleLoader({ container, moduleResolutions })

  app.use((req, res, next) => {
    req.scope = container.createScope()
    next()
  })

  // This where plugins normally load, but we simply load the routes
  await new RoutesLoader({
    app,
    rootDir,
    configModule: config,
  }).load()

  // the apiLoader needs to be called after plugins otherwise the core middleware bleads into the plugins
  await apiLoader({
    container,
    app: app,
    plugins,
  })

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
        const token = jwt.sign(
          {
            actor_id: opts.adminSession.userId || opts.adminSession.jwt?.userId,
            actor_type: "user",
            app_metadata: {
              user_id:
                opts.adminSession.userId || opts.adminSession.jwt?.userId,
            },
          },
          config.projectConfig.http.jwtSecret!
        )

        headers.Authorization = `Bearer ${token}`
      }

      if (opts.clientSession) {
        const token = jwt.sign(
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
          config.projectConfig.http.jwtSecret!
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
