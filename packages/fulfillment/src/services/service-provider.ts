import { DAL, FulfillmentTypes } from "@medusajs/types"
import { ModulesSdkUtils, promiseAll } from "@medusajs/utils"
import { MedusaError } from "medusa-core-utils"
import { FulfillmentOptions } from "@medusajs/medusa/dist/types/fulfillment-provider"
import BaseFulfillmentService from "medusa-interfaces"
import { ServiceProvider } from "@models"

type InjectedDependencies = {
  serviceProviderRepository: DAL.RepositoryService
  [key: `fp_${string}`]: FulfillmentTypes.IFulfillmentProvider
}

export default class ServiceProviderService extends ModulesSdkUtils.internalModuleServiceFactory<InjectedDependencies>(
  ServiceProvider
) {
  protected readonly container_: InjectedDependencies
  protected readonly serviceProviderRepository_: DAL.RepositoryService

  constructor(container: InjectedDependencies) {
    super(container)
    this.serviceProviderRepository_ = container.serviceProviderRepository
  }

  async listFulfillmentOptions(
    providerIds: string[]
  ): Promise<FulfillmentOptions[]> {
    return await promiseAll(
      providerIds.map(async (p) => {
        const provider = this.retrieveProvider(p)
        return {
          provider_id: p,
          options: (await provider.getFulfillmentOptions()) as Record<
            string,
            unknown
          >[],
        }
      })
    )
  }

  /**
   * @param providerId - the provider id
   * @return the payment fulfillment provider
   */
  retrieveProvider(providerId: string): typeof BaseFulfillmentService {
    try {
      return this.container_[`fp_${providerId}`]
    } catch (err) {
      throw new MedusaError(
        MedusaError.Types.NOT_FOUND,
        `Could not find a fulfillment provider with id: ${providerId}`
      )
    }
  }
}
