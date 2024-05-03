import type { Client } from "../client/interfaces/Client"
import { postProcessModel } from "./postProcessModel"
import { postProcessService } from "./postProcessService"

/**
 * Post process client
 * @param client Client object with all the models, services, etc.
 */
export const postProcessClient = (client: Client): Client => {
  return {
    ...client,
    models: client.models.map((model) => postProcessModel(model)),
    services: client.services.map((service) => postProcessService(service)),
  }
}
