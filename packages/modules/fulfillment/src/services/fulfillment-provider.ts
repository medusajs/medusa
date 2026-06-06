import {
  CalculateShippingOptionPriceDTO,
  Constructor,
  CreateFulfillmentResult,
  CreateShippingOptionDTO,
  DAL,
  FulfillmentDTO,
  FulfillmentItemDTO,
  FulfillmentOption,
  FulfillmentOrderDTO,
  FulfillmentTypes,
  IFulfillmentProvider,
  Logger,
  ValidateFulfillmentDataContext,
} from "@zjedene-medusa/framework/types"
import {
  MedusaError,
  ModulesSdkUtils,
  promiseAll,
} from "@zjedene-medusa/framework/utils"
import { FulfillmentProvider } from "@models"

type InjectedDependencies = {
  logger?: Logger
  fulfillmentProviderRepository: DAL.RepositoryService
  [key: `fp_${string}`]: FulfillmentTypes.IFulfillmentProvider
}

// TODO rework DTO's

export default class FulfillmentProviderService extends ModulesSdkUtils.MedusaInternalService<InjectedDependencies>(
  FulfillmentProvider
) {
  protected readonly fulfillmentProviderRepository_: DAL.RepositoryService
  #logger: Logger

  constructor(container: InjectedDependencies) {
    super(container)
    this.fulfillmentProviderRepository_ =
      container.fulfillmentProviderRepository
    this.#logger = container["logger"]
      ? container.logger
      : (console as unknown as Logger)
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
      if (err.name === "AwilixResolutionError") {
        const errMessage = `
Unable to retrieve the fulfillment provider with id: ${providerId}
Please make sure that the provider is registered in the container and it is configured correctly in your project configuration file.`

        // Log full error for debugging
        this.#logger.error(`AwilixResolutionError: ${err.message}`, err)

        throw new Error(errMessage)
      }

      const errMessage = `Unable to retrieve the fulfillment provider with id: ${providerId}, the following error occurred: ${err.message}`
      this.#logger.error(errMessage)

      throw new Error(errMessage)
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
  ): Promise<FulfillmentOption[]> {
    const provider = this.retrieveProviderRegistration(providerId)
    return await provider.getFulfillmentOptions()
  }

  async validateFulfillmentData(
    providerId: string,
    optionData: Record<string, unknown>,
    data: Record<string, unknown>,
    context: ValidateFulfillmentDataContext
  ) {
    const provider = this.retrieveProviderRegistration(providerId)
    return await provider.validateFulfillmentData(optionData, data, context)
  }

  async validateOption(providerId: string, data: Record<string, unknown>) {
    const provider = this.retrieveProviderRegistration(providerId)
    return await provider.validateOption(data)
  }

  async canCalculate(providerId: string, data: CreateShippingOptionDTO) {
    const provider = this.retrieveProviderRegistration(providerId)
    return await provider.canCalculate(data)
  }

  async calculatePrice(
    providerId: string,
    optionData: CalculateShippingOptionPriceDTO["optionData"],
    data: CalculateShippingOptionPriceDTO["data"],
    context: CalculateShippingOptionPriceDTO["context"]
  ) {
    const provider = this.retrieveProviderRegistration(providerId)
    return await provider.calculatePrice(optionData, data, context)
  }

  async createFulfillment(
    providerId: string,
    data: Record<string, unknown>,
    items: Partial<Omit<FulfillmentItemDTO, "fulfillment">>[],
    order: Partial<FulfillmentOrderDTO> | undefined,
    fulfillment: Partial<Omit<FulfillmentDTO, "provider_id" | "data" | "items">>
  ): Promise<CreateFulfillmentResult> {
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
