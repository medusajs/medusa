import { LoadedModule, MedusaContainer } from "@medusajs/types"
import { ModuleRegistrationName } from "../../definitions"
import { findMedusaContext } from "../../loaders/utils/clients/find-medusa-context"

export default function (
  container: MedusaContainer,
  loadedModules: Record<string, LoadedModule | LoadedModule[]>
) {
  return async (port: number, options?: Record<string, any>) => {
    let serverDependency
    let fastifyCompress

    try {
      serverDependency = await import("fastify")
      fastifyCompress = await import("@fastify/compress")
    } catch (err) {
      throw new Error(
        `"fastify" and "@fastify/compress" are not installed. Please install them to serve MedusaApp as a web server.`
      )
    }

    const fastify = serverDependency.default({
      logger: true,
      keepAliveTimeout: 1000 * 60 * 2,
      connectionTimeout: 1000 * 60 * 1,
      ...(options ?? {}),
    })

    fastify.register(fastifyCompress)

    fastify.addHook("onSend", async (request, response) => {
      const requestId = request.headers["x-request-id"]
      if (requestId) {
        response.header("X-Request-Id", request.headers["x-request-id"])
      }
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

      if (method === "__joinerConfig") {
        return resolvedModule[method]
      } else if (typeof resolvedModule[method] !== "function") {
        return response
          .status(500)
          .send(`Method "${method}" not found in "${modName}"`)
      }

      try {
        const requestId = request.headers["x-request-id"]
        if (requestId) {
          const medusaContext = findMedusaContext(args)
          if (medusaContext) {
            medusaContext.requestId ??= requestId
          }
        }

        return await resolvedModule[method].apply(resolvedModule, args)
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
