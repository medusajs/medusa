import {
  Constructor,
  DAL,
  FulfillmentTypes,
  IFulfillmentProvider,
} from "@medusajs/types"
import { ModulesSdkUtils, promiseAll } from "@medusajs/utils"
import { MedusaError } from "medusa-core-utils"
import { ServiceProvider } from "@models"

type InjectedDependencies = {
  serviceProviderRepository: DAL.RepositoryService
  [key: `fp_${string}`]: FulfillmentTypes.IFulfillmentProvider
}

// TODO reword DTO's

export default class ServiceProviderService extends ModulesSdkUtils.internalModuleServiceFactory<InjectedDependencies>(
  ServiceProvider
) {
  protected readonly serviceProviderRepository_: DAL.RepositoryService

  constructor(container: InjectedDependencies) {
    super(container)
    this.serviceProviderRepository_ = container.serviceProviderRepository
  }

  static getRegistrationName(
    providerClass: Constructor<IFulfillmentProvider>,
    optionName?: string
  ) {
    return `fp_${(providerClass as any).identifier}_${optionName}`
  }

  async listFulfillmentOptions(providerIds: string[]): Promise<any[]> {
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
  retrieveProvider(providerId: string): FulfillmentTypes.IFulfillmentProvider {
    try {
      return super.__container__[`fp_${providerId}`]
    } catch (err) {
      throw new MedusaError(
        MedusaError.Types.NOT_FOUND,
        `Could not find a fulfillment provider with id: ${providerId}`
      )
    }
  }

  async getFulfillmentOptions(
    providerId: string
  ): Promise<Record<string, unknown>[]> {
    const provider = this.retrieveProvider(providerId)
    return await provider.getFulfillmentOptions()
  }

  async validateFulfillmentData(optionData: any, data: any, cart: any) {
    const provider = this.retrieveProvider(optionData.provider_id)
    return await provider.validateFulfillmentData(optionData, data, cart)
  }

  async validateOption(data: any) {
    const provider = this.retrieveProvider(data.provider_id)
    return await provider.validateOption(data)
  }

  async createFulfillment(
    data: any,
    items: any,
    order: any,
    fulfillment: any
  ): Promise<any> {
    const provider = this.retrieveProvider(data.provider_id)
    return await provider.createFulfillment(data, items, order, fulfillment)
  }

  async cancelFulfillment(fulfillment: any): Promise<any> {
    const provider = this.retrieveProvider(fulfillment.provider_id)
    return await provider.cancelFulfillment(fulfillment)
  }
}
