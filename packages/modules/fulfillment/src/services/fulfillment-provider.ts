import {
  Constructor,
  DAL,
  FulfillmentTypes,
  IFulfillmentProvider,
} from "@medusajs/framework/types"
import {
  MedusaError,
  ModulesSdkUtils,
  promiseAll,
} from "@medusajs/framework/utils"
import { FulfillmentProvider } from "@models"

type InjectedDependencies = {
  fulfillmentProviderRepository: DAL.RepositoryService
  [key: `fp_${string}`]: FulfillmentTypes.IFulfillmentProvider
}

// TODO rework DTO's

export default class FulfillmentProviderService extends ModulesSdkUtils.MedusaInternalService<InjectedDependencies>(
  FulfillmentProvider
) {
  protected readonly fulfillmentProviderRepository_: DAL.RepositoryService

  constructor(container: InjectedDependencies) {
    super(container)
    this.fulfillmentProviderRepository_ =
      container.fulfillmentProviderRepository
  }

  static getRegistrationIdentifier(
    providerClass: Constructor<IFulfillmentProvider>,
    optionName?: string
  ) {
    if (!(providerClass as any).identifier) {
      throw new MedusaError(
        MedusaError.Types.INVALID_ARGUMENT,
        `Trying to register a fulfillment provider without an identifier.`
      )
    }
    return `${(providerClass as any).identifier}_${optionName}`
  }

  protected retrieveProviderRegistration(
    providerId: string
  ): FulfillmentTypes.IFulfillmentProvider {
    try {
      return this.__container__[`fp_${providerId}`]
    } catch (err) {
      throw new MedusaError(
        MedusaError.Types.NOT_FOUND,
        `Could not find a fulfillment provider with id: ${providerId}`
      )
    }
  }

  async listFulfillmentOptions(providerIds: string[]): Promise<any[]> {
    return await promiseAll(
      providerIds.map(async (p) => {
        const provider = this.retrieveProviderRegistration(p)
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

  async getFulfillmentOptions(
    providerId: string
  ): Promise<Record<string, unknown>[]> {
    const provider = this.retrieveProviderRegistration(providerId)
    return await provider.getFulfillmentOptions()
  }

  async validateFulfillmentData(
    providerId: string,
    optionData: Record<string, unknown>,
    data: Record<string, unknown>,
    context: Record<string, unknown>
  ) {
    const provider = this.retrieveProviderRegistration(providerId)
    return await provider.validateFulfillmentData(optionData, data, context)
  }

  async validateOption(providerId: string, data: Record<string, unknown>) {
    const provider = this.retrieveProviderRegistration(providerId)
    return await provider.validateOption(data)
  }

  async createFulfillment(
    providerId: string,
    data: object,
    items: object[],
    order: object | undefined,
    fulfillment: Record<string, unknown>
  ): Promise<Record<string, unknown>> {
    const provider = this.retrieveProviderRegistration(providerId)
    return await provider.createFulfillment(data, items, order, fulfillment)
  }

  async cancelFulfillment(
    providerId: string,
    fulfillment: Record<string, unknown>
  ): Promise<any> {
    const provider = this.retrieveProviderRegistration(providerId)
    return await provider.cancelFulfillment(fulfillment)
  }

  async createReturn(providerId: string, fulfillment: Record<string, unknown>) {
    const provider = this.retrieveProviderRegistration(providerId)
    return await provider.createReturnFulfillment(fulfillment)
  }
}
