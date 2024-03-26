import { LoadedModule, MedusaAppOutput, MedusaContainer } from "@medusajs/types"
import { isString } from "@medusajs/utils"
import { ModuleRegistrationName } from "../../definitions"
import { findMedusaContext } from "../../loaders/utils/clients/find-medusa-context"

export default function (
  container: MedusaContainer,
  loadedModules: Record<string, LoadedModule | LoadedModule[]>,
  remoteQuery: MedusaAppOutput["query"]
) {
  return async (port: number, options?: Record<string, any>) => {
    let grpc
    let protoLoader
    try {
      grpc = await import("@grpc/grpc-js")
      protoLoader = await import("@grpc/proto-loader")
    } catch (err) {
      throw new Error(
        "@grpc/grpc-js and @grpc/proto-loader are not installed. Please install them to serve MedusaApp as a web gRPC server."
      )
    }

    const PROTO_PATH = __dirname + "/medusa-app.proto"
    const packageDefinition = protoLoader.loadSync(PROTO_PATH)
    const protoDescriptor = grpc.loadPackageDefinition(packageDefinition)

    async function handleCall(call, callback) {
      const { module, method, args } = call.request

      const modName = module ?? ""
      const resolutionName =
        ModuleRegistrationName[modName.toUpperCase()] ??
        Object.values(loadedModules[modName])[0]?.__definition?.registrationName

      const resolvedModule = container.resolve(resolutionName, {
        allowUnregistered: true,
      })

      if (!resolvedModule) {
        return callback({
          code: grpc.status.NOT_FOUND,
          message: `Module ${modName} not found.`,
        })
      }

      if (method === "__joinerConfig" || method == "__definition") {
        const result = JSON.stringify(resolvedModule[method])

        return callback(null, { result })
      } else if (typeof resolvedModule[method] !== "function") {
        return callback({
          code: grpc.status.NOT_FOUND,
          message: `Method "${method}" not found in "${modName}"`,
        })
      }

      try {
        const args_ = JSON.parse(args)

        const requestId = call.metadata.get("request-id")?.[0]
        if (requestId) {
          const medusaContext = findMedusaContext(args_)
          if (medusaContext) {
            medusaContext.requestId ??= requestId
          }
        }

        const result = await resolvedModule[method].apply(resolvedModule, args_)
        return callback(null, {
          result: JSON.stringify(result),
        })
      } catch (err) {
        callback({
          code: grpc.status.UNKNOWN,
          message: err.message,
        })
      }
    }

    async function handleQuery(call, callback) {
      const { args } = call.request

      try {
        const input = JSON.parse(args)

        let query
        let variables = {}
        if (isString(input.query)) {
          query = input.query
          variables = input.variables ?? {}
        } else {
          query = input
        }

        try {
          const result = await remoteQuery(query, variables)

          return callback(null, { result })
        } catch (err) {
          return callback({
            code: grpc.status.UNKNOWN,
            message: err.message,
          })
        }
      } catch (error) {
        return callback({
          code: grpc.status.UNKNOWN,
          message: error.message,
        })
      }
    }

    const medusaAppService = protoDescriptor.medusaAppService as any

    const server = new grpc.Server()
    server.addService(medusaAppService.MedusaAppService.service, {
      Call: handleCall,
      Query: handleQuery,
    })

    return server.bindAsync(
      "0.0.0.0:" + port,
      grpc.ServerCredentials.createInsecure(),
      () => {
        server.start()
      }
    )
  }
}
