import { Logger } from "@medusajs/framework/types"
import {
  AbstractFulfillmentProviderService,
  MedusaError,
} from "@medusajs/framework/utils"
import {
  CalculatedShippingOptionPrice,
  CalculateShippingOptionPriceContext,
  CartPropsForFulfillment,
  CreateFulfillmentResult,
  CreateShippingOptionDTO,
  FulfillmentDTO,
  FulfillmentItemDTO,
  FulfillmentOption,
  FulfillmentOrderDTO,
  ValidateFulfillmentDataContext,
} from "@medusajs/types"
import { CARRIER_SERVICE_MAP } from "../core/carrier-services"
import {
  EasyPostAddressInput,
  EasyPostClient,
  EasyPostParcelInput,
  EasyPostShipment,
  EasyPostShipmentDetails,
  EasyPostStoredAddress,
  isPostageExistsError,
  Rate,
} from "../core/easypost-client"
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
   * The price `calculatePrice` returns when EasyPost's shipment response
   * comes back successfully but its `rates[]` simply has no entry for the
   * requested carrier+service at this destination -- a routine outcome
   * (not every carrier reaches every address), not an error. See the
   * comment on `calculatePrice` below for why this can't just throw.
   * Defaults to `DEFAULT_UNQUOTABLE_FALLBACK_PRICE` if not configured.
   */
  unquotableFallbackPrice?: number
  /**
   * Lets tests substitute a fake `EasyPostClient` instead of constructing a
   * real one from `apiKey`. Not meant to be set outside of tests.
   */
  client?: EasyPostClient
}

/**
 * Deliberately high, deliberately unattractive price used by `calculatePrice`
 * when EasyPost genuinely can't quote a requested carrier+service for a
 * destination. See the comment on `calculatePrice` for why.
 */
const DEFAULT_UNQUOTABLE_FALLBACK_PRICE = 999_999

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
   *
   * **Why "no matching rate" returns a fallback price instead of throwing:**
   * `FulfillmentModuleService.calculateShippingOptionsPrices` batches every
   * requested option's `calculatePrice` call through `promiseAll`, which
   * re-throws the first rejection rather than dropping just that one
   * option's result -- so throwing here would fail the ENTIRE cart's
   * shipping-options lookup (every option, every carrier) over ONE
   * carrier+service this account's EasyPost setup can't reach for this
   * particular destination, which is a routine occurrence, not a bug. This
   * provider has no mechanism to hide or drop a single shipping option from
   * checkout dynamically once it exists, so -- per the abstract base
   * class's own doc comment, which suggests exactly this -- the honest
   * mitigation is to make an effectively-unavailable option deliberately
   * unattractive (`unquotableFallbackPrice`, a very high number by default)
   * rather than block checkout for every option over one unreachable one.
   * A genuine API/connectivity/auth failure (the `createShipment` call
   * itself rejecting) is a different, real failure and is NOT caught here
   * -- it propagates and still throws, since that's worth surfacing loudly.
   *
   * **An incomplete origin (stock location) or destination address gets the
   * same fallback, for the same batching reason**: one stock location
   * without a street/province/postal code would otherwise throw for every
   * cart's shipping-options lookup, not just its own. It is checked here,
   * before any EasyPost call, rather than by relaxing `toEasyPostAddress`
   * itself -- `validateFulfillmentData` and `createFulfillment` still throw
   * on an incomplete address, since those run on an explicit action and
   * have no safe fallback.
   */
  async calculatePrice(
    optionData: Record<string, unknown>,
    data: Record<string, unknown>,
    context: CalculateShippingOptionPriceContext
  ): Promise<CalculatedShippingOptionPrice> {
    const { carrier, service } = extractCarrierAndService(
      optionData,
      "calculate a price"
    )

    const incomplete = [
      { label: "origin", address: context.from_location?.address },
      { label: "destination", address: context.shipping_address },
    ]
      .map(({ label, address }) => ({
        label,
        missing: missingAddressFields(address),
      }))
      .filter(({ missing }) => missing.length > 0)

    if (incomplete.length > 0) {
      const described = incomplete
        .map(
          ({ label, missing }) =>
            `${label} address (missing ${missing.join(", ")})`
        )
        .join(" and ")
      this.logger_.warn(
        `EasyPost fulfillment provider: cannot quote carrier "${carrier}" service "${service}" for an incomplete ${described}. Falling back to the configured unquotable-fallback price rather than failing the whole cart's shipping options.`
      )

      return this.unquotableFallbackPrice()
    }

    // A rejection here is a genuine API/connectivity/auth failure -- it
    // propagates and throws, unlike the "no matching rate" case below.
    const { shipment, rate } = await this.createShipmentAndMatchRate(
      carrier,
      service,
      context
    )

    if (!rate) {
      const quoted = describeQuotedRates(shipment)
      this.logger_.warn(
        `EasyPost fulfillment provider: no rate was returned for carrier "${carrier}" service "${service}" -- EasyPost quoted [${quoted}] for this shipment. Falling back to the configured unquotable-fallback price rather than failing the whole cart's shipping options.`
      )

      return this.unquotableFallbackPrice()
    }

    return {
      calculated_amount: Number(rate.rate),
      is_calculated_price_tax_inclusive: false,
    }
  }

  private unquotableFallbackPrice(): CalculatedShippingOptionPrice {
    return {
      calculated_amount:
        this.options_.unquotableFallbackPrice ??
        DEFAULT_UNQUOTABLE_FALLBACK_PRICE,
      is_calculated_price_tax_inclusive: false,
    }
  }

  /**
   * Validates the `data` property of a shipping method when a customer (or
   * the storefront on their behalf) explicitly adds this shipping option to
   * their cart, and persists the real EasyPost shipment/rate ids that
   * `createFulfillment` will later need to actually buy the label.
   *
   * **Why this throws instead of using `calculatePrice`'s fallback
   * pattern:** this method has the same mechanical batching hazard
   * `calculatePrice` had -- `validateAndReturnShippingMethodsDataStep`
   * batches every shipping method's `validateFulfillmentData` call through
   * core's `promiseAll`, which re-throws the first rejection across the
   * whole batch rather than dropping just one method's result. But unlike
   * `calculatePrice` (called automatically and speculatively every time a
   * cart is priced), this method only runs on an explicit customer action
   * (adding a shipping method), and it has no sensible fake-data fallback:
   * its whole job is to persist the REAL shipment/rate ids `createFulfillment`
   * will use to buy an actual label, so inventing placeholder ids would only
   * move the failure to order-fulfillment time -- after the customer has
   * already paid, and can't ship. Failing cleanly at checkout is the better
   * customer experience here. So this throws on a no-match rate, with a
   * message naming the specific carrier+service that failed, so a batch
   * failure (if one ever happens) stays legible about which option broke.
   */
  async validateFulfillmentData(
    optionData: Record<string, unknown>,
    data: Record<string, unknown>,
    context: ValidateFulfillmentDataContext
  ): Promise<Record<string, unknown>> {
    const { carrier, service } = extractCarrierAndService(
      optionData,
      "validate fulfillment data"
    )

    const { shipment, rate } = await this.createShipmentAndMatchRate(
      carrier,
      service,
      context
    )

    if (!rate) {
      const quoted = describeQuotedRates(shipment)
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        `EasyPost fulfillment provider: cannot validate fulfillment data for carrier "${carrier}" service "${service}" -- EasyPost quoted [${quoted}] for this shipment, which doesn't include the requested carrier+service for this destination.`
      )
    }

    return {
      ...data,
      easypost_shipment_id: shipment.id,
      easypost_rate_id: rate.id,
      easypost_carrier: rate.carrier,
      easypost_service: rate.service,
    }
  }

  /**
   * Shared by `calculatePrice` and `validateFulfillmentData`: builds a
   * parcel from the cart's real items, creates a real EasyPost shipment
   * against the cart's real destination/origin addresses, and looks up the
   * rate (if any) EasyPost quoted for the requested carrier+service. Each
   * caller decides for itself what "no matching rate" means for its own
   * purpose -- this helper only reports what EasyPost returned.
   */
  private async createShipmentAndMatchRate(
    carrier: string,
    service: string,
    context: Pick<
      CalculateShippingOptionPriceContext,
      "shipping_address" | "from_location" | "items"
    >
  ): Promise<{ shipment: EasyPostShipment; rate: Rate | undefined }> {
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

    return { shipment, rate }
  }

  /**
   * Buys a label for this fulfillment. Normally that's the EXACT
   * shipment/rate `validateFulfillmentData` persisted onto the shipping
   * method's `data` (`easypost_shipment_id`/`easypost_rate_id`) at checkout
   * -- the rate the customer was quoted and agreed to pay.
   *
   * **But that persisted shipment can't always be bought blindly**, so it's
   * read back from EasyPost first (`retrieveShipment`) and compared against
   * this fulfillment's real, current state. A FRESH shipment is created and
   * bought instead, for the same carrier+service, when:
   *
   * - **its postage was already purchased** -- a split order's second
   *   fulfillment, or re-fulfilling after a cancel, reuses the same
   *   shipping-method data. EasyPost rejects a second `buy` with HTTP 422
   *   `SHIPMENT.POSTAGE.EXISTS` (confirmed against the real test-mode API).
   *   That 422 is also caught on the `buy` itself, for the race where the
   *   shipment gets bought between the read and the buy.
   * - **the destination changed** -- `fulfillment.delivery_address` is the
   *   order's current shipping address (merged with any recipient override)
   *   as resolved by core's `createOrderFulfillmentWorkflow`. Neither
   *   `refreshCartShippingMethodsWorkflow` (price only) nor an admin's
   *   post-checkout address edit re-creates the persisted shipment, so
   *   buying it as-is could ship to the wrong place.
   * - **the parcel changed** -- when the fulfilled items can be matched to
   *   the order's items (with variant weights/dimensions), the parcel is
   *   rebuilt from only the items in THIS fulfillment (e.g. part of a split
   *   order) and compared with the persisted one.
   *
   * The origin address isn't on the fulfillment context (only
   * `location_id`), so a fresh shipment reuses the persisted shipment's own
   * `from_address`. A fresh shipment can be priced differently from the
   * checkout quote; that is logged, since buying a correct label beats
   * buying a stale one.
   *
   * Unlike `calculatePrice`/`validateFulfillmentData`, Medusa core invokes
   * `createFulfillment` ONE AT A TIME per fulfillment (`createFulfillmentStep`
   * takes a single `CreateFulfillmentDTO`, not a batch) -- there's no
   * `promiseAll` batching hazard here, so a genuine failure (API error,
   * incomplete current delivery address, carrier+service no longer quoted)
   * is allowed to throw and propagate.
   */
  async createFulfillment(
    data: Record<string, unknown>,
    items: Partial<Omit<FulfillmentItemDTO, "fulfillment">>[],
    order: Partial<FulfillmentOrderDTO> | undefined,
    fulfillment: Partial<Omit<FulfillmentDTO, "provider_id" | "data" | "items">>
  ): Promise<CreateFulfillmentResult> {
    const { easypost_shipment_id: shipmentId, easypost_rate_id: rateId } =
      data as {
        easypost_shipment_id?: unknown
        easypost_rate_id?: unknown
      }

    if (typeof shipmentId !== "string" || typeof rateId !== "string") {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        `EasyPost fulfillment provider: cannot create a fulfillment without "easypost_shipment_id" and "easypost_rate_id" on the shipping method's data (normally persisted by validateFulfillmentData) -- got ${JSON.stringify(
          data
        )}.`
      )
    }

    const persisted = await this.client_.retrieveShipment(shipmentId)

    // Throws on an incomplete current delivery address, same as at checkout.
    const currentToAddress = fulfillment?.delivery_address
      ? toEasyPostAddress(
          fulfillment.delivery_address as AddressLike,
          "destination"
        )
      : undefined
    const currentParcel = buildFulfilledParcel(
      items,
      order,
      this.options_.defaultParcel
    )

    const staleReasons: string[] = []
    if (persisted.purchased) {
      staleReasons.push("its postage was already purchased")
    }
    if (
      currentToAddress &&
      !addressesMatch(currentToAddress, persisted.toAddress)
    ) {
      staleReasons.push("the delivery address changed since checkout")
    }
    if (currentParcel && !parcelsMatch(currentParcel, persisted.parcel)) {
      staleReasons.push("the fulfilled items' parcel differs from checkout")
    }

    const reshop = (reason: string) =>
      this.buyFreshShipment(data, persisted, rateId, reason, {
        toAddress: currentToAddress,
        parcel: currentParcel,
      })

    if (staleReasons.length > 0) {
      return await reshop(staleReasons.join("; "))
    }

    let bought: EasyPostShipment
    try {
      bought = await this.client_.buyShipment(shipmentId, rateId)
    } catch (error) {
      if (isPostageExistsError(error)) {
        return await reshop(
          "EasyPost reported its postage already exists (SHIPMENT.POSTAGE.EXISTS)"
        )
      }
      throw error
    }

    return buildCreateFulfillmentResult(data, bought)
  }

  /**
   * Re-shops and buys a fresh shipment for the same carrier+service as the
   * persisted one, for `createFulfillment` when the persisted shipment
   * can't (or shouldn't) be bought as-is. `current` overrides the persisted
   * shipment's destination/parcel with the fulfillment's real current ones
   * where known; the origin is always the persisted shipment's own.
   */
  private async buyFreshShipment(
    data: Record<string, unknown>,
    persisted: EasyPostShipmentDetails,
    persistedRateId: string,
    reason: string,
    current: { toAddress?: EasyPostAddressInput; parcel?: ParcelDimensions }
  ): Promise<CreateFulfillmentResult> {
    const persistedRate = persisted.rates.find(
      (candidate) => candidate.id === persistedRateId
    )
    const carrier =
      typeof data.easypost_carrier === "string"
        ? data.easypost_carrier
        : persistedRate?.carrier
    const service =
      typeof data.easypost_service === "string"
        ? data.easypost_service
        : persistedRate?.service

    if (!carrier || !service) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        `EasyPost fulfillment provider: shipment "${persisted.id}" can't be bought as-is (${reason}), and the carrier+service to re-shop it for couldn't be determined from the shipping method's data or the persisted rate "${persistedRateId}".`
      )
    }

    const toAddress =
      current.toAddress ??
      fromStoredAddress(persisted.toAddress, "destination", persisted.id)
    const fromAddress = fromStoredAddress(
      persisted.fromAddress,
      "origin",
      persisted.id
    )
    const parcel =
      current.parcel ??
      (persisted.parcel as ParcelDimensions | undefined) ??
      this.options_.defaultParcel

    const fresh = await this.client_.createShipment({
      toAddress,
      fromAddress,
      parcel,
    })

    const rate = fresh.rates.find(
      (candidate) =>
        candidate.carrier === carrier && candidate.service === service
    )

    if (!rate) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        `EasyPost fulfillment provider: shipment "${
          persisted.id
        }" can't be bought as-is (${reason}), and a fresh shipment no longer quotes carrier "${carrier}" service "${service}" -- EasyPost quoted [${describeQuotedRates(
          fresh
        )}].`
      )
    }

    this.logger_.warn(
      `EasyPost fulfillment provider: not buying persisted shipment "${
        persisted.id
      }" (${reason}) -- bought fresh shipment "${
        fresh.id
      }" for carrier "${carrier}" service "${service}" at ${rate.rate} ${
        rate.currency
      }${
        persistedRate
          ? ` (checkout quote was ${persistedRate.rate} ${persistedRate.currency})`
          : ""
      }.`
    )

    const bought = await this.client_.buyShipment(fresh.id, rate.id)

    return buildCreateFulfillmentResult(
      {
        ...data,
        easypost_shipment_id: fresh.id,
        easypost_rate_id: rate.id,
        easypost_carrier: carrier,
        easypost_service: service,
      },
      bought
    )
  }

  /**
   * Buys a return label. A return fulfillment context is NOT the same
   * shape as an outbound one, confirmed by reading the real Medusa core
   * code (`packages/modules/fulfillment/src/services/fulfillment-module-service.ts`,
   * `createReturnFulfillment`) rather than assumed:
   *
   * - `fromData.shipping_option.data` DOES carry the original shipping
   *   option's `{ id, name, carrier, service }` -- the same shape
   *   `getFulfillmentOptions` produces and `validateOption` validates. So
   *   this reuses that carrier+service rather than picking the cheapest
   *   quoted rate, same as the brief suggested.
   * - `fromData.delivery_address` is always the return's own destination:
   *   the merchant's stock location address (every return-creating
   *   workflow comments this explicitly: "delivery address is the stock
   *   location address"). It is the return shipment's `to_address`.
   * - `fromData.order` -- and therefore `order.shipping_address`, the
   *   customer's own address -- is NEVER forwarded to this method today:
   *   `fulfillment-module-service.ts`'s `createReturnFulfillment`
   *   destructures `order` out of its input before persisting the
   *   fulfillment and never includes it in what's passed to the provider,
   *   in EVERY return-creating workflow (plain return, exchange, claim,
   *   create-and-complete-return) -- confirmed by reading all of them, not
   *   just one. This looks like a real gap/bug in core (outbound
   *   `createFulfillment` DOES forward `order` the same way), but fixing
   *   core is out of scope here. This method still checks
   *   `order?.shipping_address` first, in case that's ever fixed upstream
   *   or a custom caller supplies it anyway, but falls back to this
   *   provider's own documented extension point --
   *   `fromData.metadata.return_from_address`, an `EasyPostAddressInput`-shaped
   *   object -- which is, as of today, the ONLY way to actually get a
   *   working return label out of this provider. If neither is present,
   *   this throws rather than silently using a fabricated address.
   *
   * **Returns are descoped for v1.** No standard return-creating workflow
   * can set either source today, so the product decision was to not
   * support EasyPost return labels in this version rather than patch core.
   * The thrown error says exactly that (`NOT_ALLOWED`, "not supported in
   * this version, pending a Medusa core fix") instead of reading like an
   * address data problem. See the package README's "Returns" section.
   */
  async createReturnFulfillment(
    fromData: Record<string, unknown>
  ): Promise<CreateFulfillmentResult> {
    const typed = fromData as {
      delivery_address?: AddressLike
      shipping_option?: { data?: Record<string, unknown> }
      order?: { shipping_address?: AddressLike }
      metadata?: Record<string, unknown> | null
      items?: CartPropsForFulfillment["items"]
    }

    const { carrier, service } = extractCarrierAndService(
      (typed.shipping_option?.data ?? {}) as Record<string, unknown>,
      "create a return fulfillment"
    )

    const fromAddressSource =
      typed.order?.shipping_address ??
      (typed.metadata?.return_from_address as AddressLike | undefined)

    if (!fromAddressSource) {
      throw new MedusaError(
        MedusaError.Types.NOT_ALLOWED,
        `EasyPost fulfillment provider: EasyPost return labels are not supported in this version, pending a Medusa core fix. Buying a return label needs the customer's origin address, but Medusa core's return-creating workflows don't forward the order (or its shipping_address) to fulfillment providers. Outbound shipping, tracking and cancellation are unaffected. Use a different fulfillment provider for returns; see the @dtc/fulfillment-easypost README ("Returns") for details.`
      )
    }

    const parcel = buildParcel(typed.items ?? [], this.options_.defaultParcel)

    // The return ships FROM the customer TO the merchant's stock location
    // -- the reverse of an outbound shipment's to/from.
    const shipment = await this.client_.createShipment({
      toAddress: toEasyPostAddress(
        typed.delivery_address,
        "return destination"
      ),
      fromAddress: toEasyPostAddress(fromAddressSource, "return origin"),
      parcel,
    })

    const rate = shipment.rates.find(
      (candidate) =>
        candidate.carrier === carrier && candidate.service === service
    )

    if (!rate) {
      const quoted = describeQuotedRates(shipment)
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        `EasyPost fulfillment provider: cannot create a return fulfillment for carrier "${carrier}" service "${service}" -- EasyPost quoted [${quoted}] for this return shipment.`
      )
    }

    const bought = await this.client_.buyShipment(shipment.id, rate.id)

    // `easypost_shipment_id` is what `cancelFulfillment` refunds by -- core
    // also calls it as createReturnFulfillmentStep's compensation, so it
    // must be here or a rollback leaves a paid, unrefunded label.
    return buildCreateFulfillmentResult(
      {
        easypost_shipment_id: shipment.id,
        easypost_rate_id: rate.id,
        easypost_carrier: carrier,
        easypost_service: service,
      },
      bought
    )
  }

  /**
   * Submits a refund request for a previously-bought shipment. EasyPost's
   * own documented behavior is that a submitted refund doesn't necessarily
   * resolve to "refunded" immediately (it can take up to 30 days depending
   * on the carrier) -- the returned `refundStatus` of `"submitted"` is the
   * expected, successful outcome of THIS call, not `"refunded"` itself.
   */
  async cancelFulfillment(data: Record<string, unknown>): Promise<unknown> {
    const { easypost_shipment_id: shipmentId } = data as {
      easypost_shipment_id?: unknown
    }

    if (typeof shipmentId !== "string") {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        `EasyPost fulfillment provider: cannot cancel a fulfillment without "easypost_shipment_id" -- got ${JSON.stringify(
          data
        )}.`
      )
    }

    return await this.client_.refundShipment(shipmentId)
  }
}

/**
 * Pulls the `carrier`/`service` strings off a shipping option's own `data`
 * (the shape `getFulfillmentOptions()` returned). Shared by `calculatePrice`
 * and `validateFulfillmentData`, which both require these before they can
 * call EasyPost at all. `action` is interpolated into the error message to
 * say what the caller was trying to do.
 */
function extractCarrierAndService(
  optionData: Record<string, unknown>,
  action: string
): { carrier: string; service: string } {
  const carrier = optionData?.carrier
  const service = optionData?.service

  if (typeof carrier !== "string" || typeof service !== "string") {
    throw new MedusaError(
      MedusaError.Types.INVALID_DATA,
      `EasyPost fulfillment provider: cannot ${action} without a carrier and service -- got option data ${JSON.stringify(
        optionData
      )}.`
    )
  }

  return { carrier, service }
}

/**
 * Renders a shipment's quoted rates as a human-readable `"carrier:service"`
 * list, for use in warning/error messages when a requested carrier+service
 * wasn't among them.
 */
function describeQuotedRates(shipment: EasyPostShipment): string {
  return shipment.rates
    .map((candidate) => `${candidate.carrier}:${candidate.service}`)
    .join(", ")
}

/**
 * Maps a bought `EasyPostShipment` into the exact `CreateFulfillmentResult`
 * shape (`packages/core/types/src/fulfillment/provider.ts`) shared by
 * `createFulfillment` and `createReturnFulfillment`. `existingData` is
 * spread onto the result's `data` first -- critically, this is what keeps
 * `easypost_tracking_code` alongside whatever ids/carrier/service the
 * caller already had (e.g. `easypost_shipment_id`/`easypost_rate_id` from
 * `validateFulfillmentData`'s output), since `easypost_tracking_code` is
 * what Task 8's webhook route looks fulfillments up by.
 */
function buildCreateFulfillmentResult(
  existingData: Record<string, unknown>,
  shipment: EasyPostShipment
): CreateFulfillmentResult {
  if (!shipment.trackingCode) {
    throw new MedusaError(
      MedusaError.Types.UNEXPECTED_STATE,
      `EasyPost fulfillment provider: buying shipment "${shipment.id}" did not return a tracking code.`
    )
  }

  return {
    data: {
      ...existingData,
      easypost_tracking_code: shipment.trackingCode,
      easypost_label_url: shipment.labelUrl,
      easypost_tracker_id: shipment.trackerId,
    },
    labels: [
      {
        tracking_number: shipment.trackingCode,
        tracking_url: shipment.trackingUrl ?? "",
        label_url: shipment.labelUrl ?? "",
      },
    ],
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
 * `address`) -- the two real address shapes `calculatePrice` and
 * `validateFulfillmentData` receive via their `context` parameter.
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
 * Rebuilds the parcel for exactly the items in one fulfillment, by matching
 * each fulfillment item (`line_item_id` + `quantity`) to the order's line
 * item and its variant's weight/dimensions. Returns `undefined` -- meaning
 * "unknown, keep the persisted parcel" -- unless EVERY fulfilled item can be
 * matched, so a partial match never under-weighs a parcel.
 */
function buildFulfilledParcel(
  items: Partial<Omit<FulfillmentItemDTO, "fulfillment">>[] | undefined,
  order: Partial<FulfillmentOrderDTO> | undefined,
  defaults: ParcelDimensions
): ParcelDimensions | undefined {
  const orderItems = (order?.items ?? []) as {
    id?: string
    variant?: CartPropsForFulfillment["items"][number]["variant"]
  }[]

  if (!items?.length || !orderItems.length) {
    return undefined
  }

  // A managed-inventory line item can produce more than one fulfillment
  // item sharing the same `line_item_id` -- one per inventory reservation,
  // each already scaled by that inventory item's own `required_quantity`
  // (see core's `createOrderFulfillmentWorkflow`). Counting every such
  // entry toward the parcel would add that line item's weight multiple
  // times (once per inventory item in a kit, or once per reservation row
  // for a single inventory item split across lots). There's no reliable
  // way to recover the line's real unit count from these entries alone,
  // so bail to "unknown" -- same as an unmatched item -- rather than risk
  // an inflated weight.
  const lineItemCounts = new Map<string, number>()
  for (const item of items) {
    const key = item?.line_item_id
    if (typeof key !== "string") {
      return undefined
    }
    lineItemCounts.set(key, (lineItemCounts.get(key) ?? 0) + 1)
  }
  if ([...lineItemCounts.values()].some((count) => count > 1)) {
    return undefined
  }

  const fulfilled: CartPropsForFulfillment["items"] = []
  for (const item of items) {
    const orderItem = orderItems.find(
      (candidate) => !!candidate?.id && candidate.id === item?.line_item_id
    )
    if (!orderItem) {
      return undefined
    }
    fulfilled.push({
      quantity: item.quantity,
      variant: orderItem.variant,
    } as CartPropsForFulfillment["items"][number])
  }

  return buildParcel(fulfilled, defaults)
}

const PARCEL_FIELDS = ["weight", "length", "width", "height"] as const

function parcelsMatch(
  current: ParcelDimensions,
  persisted: EasyPostParcelInput | undefined
): boolean {
  if (!persisted) {
    return false
  }

  return PARCEL_FIELDS.every(
    (field) =>
      Math.abs(Number(current[field]) - Number(persisted[field])) < 1e-6
  )
}

const COMPARED_ADDRESS_FIELDS = [
  "name",
  "company",
  "street1",
  "street2",
  "city",
  "state",
  "zip",
  "country",
] as const

/**
 * Compares the fulfillment's current destination with the address EasyPost
 * stored on the persisted shipment. Case- and whitespace-insensitive, and
 * `null`/`undefined`/`""` are treated alike, since EasyPost upper-cases
 * `country` and returns missing fields as `null` (confirmed against the real
 * test-mode API) -- a mismatch only ever triggers a re-shop, never a wrong
 * purchase, so erring towards "changed" is the safe direction.
 */
function addressesMatch(
  current: EasyPostAddressInput,
  stored: EasyPostStoredAddress | undefined
): boolean {
  if (!stored) {
    return false
  }

  const normalize = (value: unknown) =>
    String(value ?? "")
      .trim()
      .toLowerCase()

  return COMPARED_ADDRESS_FIELDS.every(
    (field) => normalize(current[field]) === normalize(stored[field])
  )
}

/**
 * Converts an address EasyPost stored on a shipment back into a
 * `createShipment` input, for re-shopping a fresh shipment from it.
 */
function fromStoredAddress(
  stored: EasyPostStoredAddress | undefined,
  label: string,
  shipmentId: string
): EasyPostAddressInput {
  const { street1, city, state, zip, country } = stored ?? {}

  if (!street1 || !city || !state || !zip || !country) {
    throw new MedusaError(
      MedusaError.Types.UNEXPECTED_STATE,
      `EasyPost fulfillment provider: cannot re-shop shipment "${shipmentId}" -- EasyPost didn't return a complete ${label} address for it.`
    )
  }

  return {
    name: stored?.name ?? undefined,
    company: stored?.company ?? undefined,
    street1,
    street2: stored?.street2 ?? undefined,
    city,
    state,
    zip,
    country,
    phone: stored?.phone ?? undefined,
    email: stored?.email ?? undefined,
  }
}

const REQUIRED_ADDRESS_FIELDS = [
  "address_1",
  "city",
  "province",
  "postal_code",
  "country_code",
] as const

/**
 * The fields EasyPost needs to rate a shipment that `address` is missing.
 * Non-throwing, so `calculatePrice` can route an incomplete address to its
 * fallback price; `toEasyPostAddress` turns a non-empty result into an error.
 */
function missingAddressFields(
  address: AddressLike | null | undefined
): string[] {
  return REQUIRED_ADDRESS_FIELDS.filter((field) => !address?.[field])
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
  const missing = missingAddressFields(address)

  if (missing.length > 0) {
    throw new MedusaError(
      MedusaError.Types.INVALID_DATA,
      `EasyPost fulfillment provider: cannot create a shipment without a complete ${label} address -- missing ${missing.join(
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
