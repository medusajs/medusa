import { LoadedModule, MedusaContainer } from "@medusajs/types"
import { ModuleRegistrationName } from "../../definitions"
import { findMedusaContext } from "../../loaders/utils/clients/find-medusa-context"

export default function (
  container: MedusaContainer,
  loadedModules: Record<string, LoadedModule | LoadedModule[]>
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

      if (method === "__joinerConfig") {
        const result = JSON.stringify(resolvedModule[method])

        return callback(null, { result })
      } else if (typeof resolvedModule[method] !== "function") {
        return callback({
          code: grpc.status.NOT_FOUND,
          message: `Method "${method}" not found in "${modName}"`,
        })
      }

      const args_ = JSON.parse(args)
      try {
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

    const medusaAppService = protoDescriptor.medusaAppService as any

    const server = new grpc.Server()
    server.addService(medusaAppService.MedusaAppService.service, {
      Call: handleCall,
    })

    return server.bindAsync(
      "0.0.0.0:" + port,
      grpc.ServerCredentials.createInsecure(),
      () => {}
    )
  }
}
