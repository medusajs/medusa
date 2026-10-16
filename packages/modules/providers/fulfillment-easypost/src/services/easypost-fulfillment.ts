import { Logger } from "@medusajs/framework/types"
import {
  AbstractFulfillmentProviderService,
  MedusaError,
} from "@medusajs/framework/utils"
import {
  CalculatedShippingOptionPrice,
  CalculateShippingOptionPriceContext,
  CreateShippingOptionDTO,
  FulfillmentOption,
} from "@medusajs/types"
import { CARRIER_SERVICE_MAP } from "../core/carrier-services"
import { EasyPostAddressInput, EasyPostClient } from "../core/easypost-client"
import { buildParcel, ParcelDimensions } from "../core/parcel"

type InjectedDependencies = {
  logger: Logger
}

export type EasyPostFulfillmentServiceOptions = {
  apiKey: string
  /**
   * The fallback parcel used whenever a cart's items don't supply enough of
   * their own weight/dimension data (see `buildParcel` in `../core/parcel`).
   * Unlike `EasyPostAddressInput`'s optional dimensions, every field here is
   * required -- a default parcel with a missing dimension can't serve as a
   * fallback for that same dimension.
   */
  defaultParcel: ParcelDimensions
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

  /**
   * Checks whether a shipping option being created can have its price
   * calculated by this provider. No API call is needed -- it's a pure
   * shape check on the fulfillment option id this provider itself produced
   * in `getFulfillmentOptions()`.
   *
   * `data` here is the *whole* shipping-option-creation DTO: the id to
   * check lives on its nested `data` property (`data.data?.id`), not on
   * `data` itself. See `validateOption`/`calculatePrice` below, which
   * receive that nested data directly -- a real, confirmed asymmetry
   * between these three methods, not a typo.
   */
  async canCalculate(data: CreateShippingOptionDTO): Promise<boolean> {
    return isCarrierServiceOptionId((data.data as { id?: unknown })?.id)
  }

  /**
   * Validates the `data` property of a shipping option when it's created.
   * Unlike `canCalculate`, `data` here is already the option's own `data`
   * property (no extra `data.data` nesting), per the abstract class's own
   * doc comment for this method.
   */
  async validateOption(data: Record<string, unknown>): Promise<boolean> {
    return isCarrierServiceOptionId(data?.id)
  }

  /**
   * Calculates the real price of a shipping option by building a parcel
   * from the cart's real items, creating a shipment against the cart's real
   * destination/origin addresses, and reading off the rate EasyPost quoted
   * for this option's carrier+service.
   *
   * `optionData` is the shipping option's own `data` property (the same
   * shape `getFulfillmentOptions()` returned: `{ id, name, carrier,
   * service }`) -- not nested, like `validateOption`'s `data` and unlike
   * `canCalculate`'s `data`.
   */
  async calculatePrice(
    optionData: Record<string, unknown>,
    data: Record<string, unknown>,
    context: CalculateShippingOptionPriceContext
  ): Promise<CalculatedShippingOptionPrice> {
    const carrier = optionData?.carrier
    const service = optionData?.service

    if (typeof carrier !== "string" || typeof service !== "string") {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        `EasyPost fulfillment provider: cannot calculate a price without a carrier and service -- got option data ${JSON.stringify(
          optionData
        )}.`
      )
    }

    const parcel = buildParcel(context.items, this.options_.defaultParcel)

    const shipment = await this.client_.createShipment({
      toAddress: toEasyPostAddress(context.shipping_address, "destination"),
      fromAddress: toEasyPostAddress(context.from_location?.address, "origin"),
      parcel,
    })

    const rate = shipment.rates.find(
      (candidate) =>
        candidate.carrier === carrier && candidate.service === service
    )

    if (!rate) {
      const quoted = shipment.rates
        .map((candidate) => `${candidate.carrier}:${candidate.service}`)
        .join(", ")
      throw new MedusaError(
        MedusaError.Types.NOT_FOUND,
        `EasyPost fulfillment provider: no rate was returned for carrier "${carrier}" service "${service}" -- EasyPost quoted [${quoted}] for this shipment.`
      )
    }

    return {
      calculated_amount: Number(rate.rate),
      is_calculated_price_tax_inclusive: false,
    }
  }
}

/**
 * This provider's fulfillment option ids are always shaped `"carrier:service"`
 * (see `getFulfillmentOptions` above). Used by both `canCalculate` and
 * `validateOption` to check that shape -- deliberately a shape check only,
 * not a lookup against `CARRIER_SERVICE_MAP`, since a shipping option can be
 * created before this account's live carriers are re-verified.
 */
function isCarrierServiceOptionId(id: unknown): boolean {
  return typeof id === "string" && /^[^:]+:[^:]+$/.test(id)
}

/**
 * A loose shape covering both `CartAddressDTO` (the cart's
 * `shipping_address`) and `StockLocationAddressDTO` (a stock location's
 * `address`) -- the two real address shapes `calculatePrice` receives via
 * its `context` parameter.
 */
type AddressLike = {
  first_name?: string | null
  last_name?: string | null
  company?: string | null
  address_1?: string | null
  address_2?: string | null
  city?: string | null
  province?: string | null
  postal_code?: string | null
  country_code?: string | null
  phone?: string | null
}

/**
 * Maps a real Medusa address (cart shipping address or stock location
 * address) into EasyPost's address shape. Throws a descriptive error if the
 * address is missing a field EasyPost requires to rate a shipment, rather
 * than silently sending an incomplete address and getting back an opaque
 * EasyPost-side error.
 */
function toEasyPostAddress(
  address: AddressLike | null | undefined,
  label: string
): EasyPostAddressInput {
  const missing = (
    ["address_1", "city", "province", "postal_code", "country_code"] as const
  ).filter((field) => !address?.[field])

  if (missing.length > 0) {
    throw new MedusaError(
      MedusaError.Types.INVALID_DATA,
      `EasyPost fulfillment provider: cannot calculate a price without a complete ${label} address -- missing ${missing.join(
        ", "
      )}.`
    )
  }

  const name =
    [address?.first_name, address?.last_name].filter(Boolean).join(" ") ||
    undefined

  return {
    name,
    company: address?.company ?? undefined,
    street1: address!.address_1!,
    street2: address?.address_2 ?? undefined,
    city: address!.city!,
    state: address!.province!,
    zip: address!.postal_code!,
    country: address!.country_code!,
    phone: address?.phone ?? undefined,
  }
}
