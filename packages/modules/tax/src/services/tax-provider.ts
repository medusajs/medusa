import { DAL, ITaxProvider, Logger, TaxTypes } from "@zjedene-medusa/framework/types"
import { ModulesSdkUtils } from "@zjedene-medusa/framework/utils"

import TaxProvider from "../models/tax-provider"

type InjectedDependencies = {
  logger?: Logger
  taxProviderRepository: DAL.RepositoryService
  [key: `tp_${string}`]: ITaxProvider
}

export default class TaxProviderService extends ModulesSdkUtils.MedusaInternalService<InjectedDependencies>(
  TaxProvider
) {
  #logger: Logger

  constructor(container: InjectedDependencies) {
    super(container)
    this.#logger = container["logger"]
      ? container.logger
      : (console as unknown as Logger)
  }

  retrieveProvider(providerId: string): ITaxProvider {
    try {
      return this.__container__[providerId] as ITaxProvider
    } catch (err) {
      if (err.name === "AwilixResolutionError") {
        const errMessage = `
  Unable to retrieve the tax provider with id: ${providerId}
  Please make sure that the provider is registered in the container and it is configured correctly in your project configuration file.`

        // Log full error for debugging
        this.#logger.error(`AwilixResolutionError: ${err.message}`, err)

        throw new Error(errMessage)
      }

      const errMessage = `Unable to retrieve the tax provider with id: ${providerId}, the following error occurred: ${err.message}`
      this.#logger.error(errMessage)

      throw new Error(errMessage)
    }
  }

  async getTaxLines(
    providerId: string,
    itemLines: TaxTypes.ItemTaxCalculationLine[],
    shippingLines: TaxTypes.ShippingTaxCalculationLine[],
    context: TaxTypes.TaxCalculationContext
  ): Promise<(TaxTypes.ItemTaxLineDTO | TaxTypes.ShippingTaxLineDTO)[]> {
    const provider = this.retrieveProvider(providerId)
    return provider.getTaxLines(itemLines, shippingLines, context)
  }
}
