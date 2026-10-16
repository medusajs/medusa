import { Logger } from "@medusajs/framework/types"
import { AbstractFulfillmentProviderService } from "@medusajs/framework/utils"
import { FulfillmentOption } from "@medusajs/types"
import { CARRIER_SERVICE_MAP } from "../core/carrier-services"
import { EasyPostClient, EasyPostParcelInput } from "../core/easypost-client"

type InjectedDependencies = {
  logger: Logger
}

export type EasyPostFulfillmentServiceOptions = {
  apiKey: string
  defaultParcel: EasyPostParcelInput
  /**
   * Lets tests substitute a fake `EasyPostClient` instead of constructing a
   * real one from `apiKey`. Not meant to be set outside of tests.
   */
  client?: EasyPostClient
}

/**
 * A generic domestic US from/to address pair used only to discover which
 * carrier+service combinations are quotable on this account (see
 * `getFulfillmentOptions` below) -- it is never used to actually ship
 * anything.
 */
const REPRESENTATIVE_SHIPMENT_ADDRESSES = {
  toAddress: {
    name: "Test Buyer",
    street1: "417 montgomery st",
    city: "San Francisco",
    state: "CA",
    zip: "94104",
    country: "US",
  },
  fromAddress: {
    name: "Test Seller",
    street1: "118 2nd street",
    city: "San Francisco",
    state: "CA",
    zip: "94105",
    country: "US",
  },
}

export class EasyPostFulfillmentService extends AbstractFulfillmentProviderService {
  static identifier = "easypost"

  protected logger_: Logger
  protected options_: EasyPostFulfillmentServiceOptions
  protected client_: EasyPostClient

  constructor(
    { logger }: InjectedDependencies,
    options: EasyPostFulfillmentServiceOptions
  ) {
    super()

    this.logger_ = logger
    this.options_ = options
    this.client_ =
      options.client ?? new EasyPostClient({ apiKey: options.apiKey })
  }

  /**
   * Discovers which carrier+service combinations this account can actually
   * quote by creating one representative shipment and reading its returned
   * `rates[]` -- EasyPost's `GET /carrier_accounts` endpoint requires a
   * production API key (confirmed in Task 1), so it can't be used here.
   * Each returned rate's `carrier`/`service` are looked up in
   * `CARRIER_SERVICE_MAP`; a carrier or service this provider doesn't yet
   * model is skipped with a warning rather than failing the whole call.
   */
  async getFulfillmentOptions(): Promise<FulfillmentOption[]> {
    const shipment = await this.client_.createShipment({
      ...REPRESENTATIVE_SHIPMENT_ADDRESSES,
      parcel: this.options_.defaultParcel,
    })

    const options: FulfillmentOption[] = []
    const seenIds = new Set<string>()

    for (const rate of shipment.rates) {
      const services = CARRIER_SERVICE_MAP[rate.carrier]
      if (!services) {
        this.logger_.warn(
          `EasyPost fulfillment provider: carrier "${rate.carrier}" is not mapped to any known service -- skipping rate for it.`
        )
        continue
      }

      const service = services.find((entry) => entry.code === rate.service)
      if (!service) {
        this.logger_.warn(
          `EasyPost fulfillment provider: service "${rate.service}" for carrier "${rate.carrier}" is not mapped -- skipping rate for it.`
        )
        continue
      }

      const id = `${rate.carrier}:${rate.service}`
      if (seenIds.has(id)) {
        continue
      }
      seenIds.add(id)

      options.push({
        id,
        name: service.name,
        carrier: rate.carrier,
        service: rate.service,
      })
    }

    return options
  }
}
