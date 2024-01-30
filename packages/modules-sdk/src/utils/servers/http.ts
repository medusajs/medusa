import { LoadedModule, MedusaAppOutput, MedusaContainer } from "@medusajs/types"
import { isString } from "@medusajs/utils"
import { ModuleRegistrationName } from "../../definitions"

export function httpServer(
  container: MedusaContainer,
  loadedModules: Record<string, LoadedModule | LoadedModule[]>,
  remoteQuery: MedusaAppOutput["query"]
) {
  return async (port: number, options?: Record<string, any>) => {
    let serverDependency

    try {
      serverDependency = await import("fastify")
    } catch (err) {
      throw new Error(
        "Fastify is not installed. Please install it to serve MedusaApp as a web server."
      )
    }

    const fastify = serverDependency.default({
      logger: true,
      keepAliveTimeout: 1000 * 60 * 2,
      connectionTimeout: 1000 * 60 * 1,
      ...(options ?? {}),
    })

    fastify.post("/modules/:module/:method", async (request, response) => {
      const { module, method } = request.params as {
        module: string
        method: string
      }
      const args = request.body

      const modName = module ?? ""
      const resolutionName =
        ModuleRegistrationName[modName.toUpperCase()] ??
        Object.values(loadedModules[modName])[0]?.__definition?.registrationName

      const resolvedModule = container.resolve(resolutionName, {
        allowUnregistered: true,
      })

      if (!resolvedModule) {
        return response.status(500).send(`Module ${modName} not found.`)
      }

      if (method === "__joinerConfig" || method == "__definition") {
        return resolvedModule[method]
      } else if (typeof resolvedModule[method] !== "function") {
        return response
          .status(500)
          .send(`Method "${method}" not found in "${modName}"`)
      }

      try {
        return await resolvedModule[method].apply(resolvedModule, args)
      } catch (err) {
        return response.status(500).send(err.message)
      }
    })

    fastify.post("/query", async (request, response) => {
      const input = request.body

      let query
      let variables = {}
      if (isString(input.query)) {
        query = input.query
        variables = input.variables ?? {}
      } else {
        query = input
      }

      try {
        return await remoteQuery(query, variables)
      } catch (err) {
        return response.status(500).send(err.message)
      }
    })

    await fastify.listen({
      port,
      host: "0.0.0.0",
    })
  }
}
