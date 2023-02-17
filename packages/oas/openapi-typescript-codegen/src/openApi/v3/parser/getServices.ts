import type { Service } from "../../../client/interfaces/Service"
import type { OpenApi } from "../interfaces/OpenApi"
import { listOperations } from "./listOperations"

/**
 * Get the OpenAPI services
 */
export const getServices = (openApi: OpenApi): Service[] => {
  const services = new Map<string, Service>()
  const operations = listOperations(openApi)
  for (const operation of operations) {
    // If we have already declared a service, then we should fetch that and
    // append the new method to it. Otherwise we should create a new service object.
    const service: Service = services.get(operation.service) || {
      name: operation.service,
      operations: [],
      imports: [],
    }

    // Push the operation in the service
    service.operations.push(operation)
    service.imports.push(...operation.imports)
    services.set(operation.service, service)
  }
  return Array.from(services.values())
}
