import EasyPostApi from "@easypost/api"
import crypto from "crypto"

/**
 * Notes on the real, installed `@easypost/api` SDK (v8.9.0), confirmed by
 * reading its type definitions (`node_modules/@easypost/api/types`) and its
 * JS source (`node_modules/@easypost/api/src`) rather than guessing:
 *
 * - Constructor: the SDK's own client is `EasyPostApi` (its default export,
 *   named `EasyPostClient` internally), constructed as
 *   `new EasyPostApi(apiKey: string, options?: IEasyPostOptions)` -- a
 *   positional API key string, NOT an options object. Our own
 *   `EasyPostClient` wrapper below takes `{ apiKey }` per this package's
 *   task brief, and adapts that to the SDK's positional constructor
 *   internally.
 *
 * - The client exposes one property per resource (e.g. `client.CarrierAccount`,
 *   `client.Shipment`, `client.Refund`, `client.Utils`), each a small
 *   service class bound to the client instance in its constructor
 *   (`this._attachServices(...)`). Methods are called directly on these,
 *   e.g. `client.Shipment.create(params)`.
 *
 * - Carrier accounts: `client.CarrierAccount.all(): Promise<CarrierAccount[]>`
 *   hits `GET /carrier_accounts` and returns a bare JSON array (unlike
 *   `Shipment.all()`, which returns `{ shipments, has_more }` -- carrier
 *   accounts are not paginated). Each account has `id`, `type` (carrier
 *   type name, e.g. "USPS"), `readable` (display name), and `fields`
 *   (credentials metadata).
 *
 *   IMPORTANT, CONFIRMED AGAINST THE REAL API (not just the SDK's typings):
 *   this endpoint requires a PRODUCTION API key. The SDK's own `.d.ts`
 *   documents this ("Only Production API keys may be used to retrieve
 *   this list, as there is no test mode equivalent. @requires production
 *   API Key."), and calling it with this task's real test-mode key
 *   reproduces exactly that: the request is rejected with
 *   "This resource requires a production API Key to access." This
 *   contradicts the plan brief's assumption that a fresh test-mode
 *   account's default USPS carrier could be listed this way -- it cannot.
 *   `listCarrierAccounts()` below is still a correct, faithful wrapper
 *   around the real SDK method; the limitation is in EasyPost's API
 *   itself for test-mode keys, not in this wrapper. Carrier/rate info for
 *   rating and buying (which DO work with a test-mode key, see
 *   `createShipment`/`buyShipment` below) comes from the `rates` array on
 *   a created `Shipment`, not from this endpoint.
 *
 * - Creating a shipment: `client.Shipment.create(params)` hits
 *   `POST /shipments` with `params` wrapped as `{ shipment: params }`
 *   internally by the SDK. `params` takes `to_address`, `from_address`
 *   (each an address object or address id string), `parcel` (object or
 *   parcel id string), and optional `carrier_accounts` (array of
 *   `ca_...` ids). A successful create returns a `Shipment` whose `rates`
 *   array is already populated (no separate "get rates" call needed).
 *   Each `Rate` has `id` (`rate_...`), `carrier`, `service`, `rate` (a
 *   decimal amount as a STRING, not a number), and `currency`.
 *
 * - Buying a shipment: `client.Shipment.buy(shipmentId, rate, insuranceAmount?, endShipperId?)`
 *   hits `POST /shipments/:id/buy` with `{ rate: { id: rateId } }` (the
 *   `rate` argument may be a rate id string or a `Rate` object -- the SDK
 *   unwraps `.id` from an object itself). The returned `Shipment` has
 *   `tracking_code` populated and a `postage_label` object with
 *   `label_url` (plus `label_pdf_url`/`label_zpl_url`/`label_epl2_url`
 *   variants); `label_url` defaults to a PNG unless a different
 *   `label_format` option was requested at shipment-creation time.
 *
 * - Refunding a shipment: `client.Shipment.refund(shipmentId)` hits
 *   `POST /shipments/:id/refund` (note: this is a method on `Shipment`,
 *   not a separate `Refund.create` call -- `Refund.create` is a distinct,
 *   bulk-refund endpoint the brief does not need). The returned `Shipment`
 *   has `refund_status` set to one of `"submitted"`, `"refunded"`, or
 *   `"rejected"`.
 *
 * - Buying a shipment TWICE: confirmed empirically against the real
 *   EasyPost test-mode API (while building Task 5's `createFulfillment`)
 *   -- a second `client.Shipment.buy(...)` call against an
 *   already-purchased shipment is REJECTED, not idempotent and not a
 *   fresh rate: it throws with HTTP 422, `code: "SHIPMENT.POSTAGE.EXISTS"`,
 *   message `"Postage already exists for this shipment."`. This wrapper
 *   does not catch or special-case that -- it propagates, which is the
 *   desired behavior for `createFulfillment`.
 *
 * - Tracking info after a buy: a bought `Shipment` also gets a `tracker`
 *   object (`Shipment.tracker`), confirmed via the SDK's own
 *   `types/Tracker/Tracker.d.ts`. `tracker.id` (begins with `trk_`) and
 *   `tracker.public_url` (a hosted tracking page) are what `createFulfillment`
 *   needs for `easypost_tracker_id` and the returned label's `tracking_url`
 *   -- `shipment.tracking_code` and `tracker.tracking_code` are the same
 *   value, so this wrapper keeps reading the former (already mapped below).
 *
 * - Webhook signature verification: the SDK ships its own
 *   `client.Utils.validateWebhook(eventBody: Buffer, headers: object, webhookSecret: string)`
 *   (an instance method on `new Utils()`, despite the shipped `.d.ts`
 *   incorrectly marking it `static` -- confirmed by reading
 *   `src/easypost.js`, which does `this.Utils = new Utils()`). Reading its
 *   real implementation (`src/utils/util.js`) pins down the exact scheme:
 *     - The signature travels in an `X-Hmac-Signature` request header.
 *     - The digest is HMAC-SHA256, computed over the raw request body,
 *       keyed with the webhook secret (the SDK normalizes the secret with
 *       `.normalize("NFKD")` and encodes it as a UTF-8 buffer first).
 *     - The expected header value is the hex digest PREFIXED with the
 *       literal string `"hmac-sha256-hex="` (e.g.
 *       `"hmac-sha256-hex=<64 hex chars>"`), not the bare hex digest.
 *     - Comparison is constant-time (`crypto.timingSafeEqual`), not `===`.
 *   The SDK's own `validateWebhook` additionally rewrites integer `weight`
 *   fields to floats (e.g. `16` -> `16.0`) in the body before hashing, to
 *   work around a float/int round-tripping issue in some callers' JSON
 *   re-serialization (see easypost-node#467). That rewrite is a
 *   workaround for bodies that have already been re-serialized by
 *   something upstream; our `verifyWebhookSignature` below is documented
 *   to take the true raw request body bytes, so it intentionally does not
 *   repeat that rewrite -- hashing the exact bytes EasyPost signed is the
 *   correct general-purpose behavior. A caller that cannot get true raw
 *   bytes (e.g. a framework that only hands back a re-serialized JSON
 *   object) may need to account for this separately.
 */

export type EasyPostAddressInput = {
  name?: string
  company?: string
  street1: string
  street2?: string
  city: string
  state: string
  zip: string
  country: string
  phone?: string
  email?: string
}

export type EasyPostParcelInput = {
  weight: number
  length?: number
  width?: number
  height?: number
}

export type CreateShipmentInput = {
  toAddress: EasyPostAddressInput
  fromAddress: EasyPostAddressInput
  parcel: EasyPostParcelInput
  /**
   * Optional `ca_...` ids to restrict rating to specific carrier accounts.
   */
  carrierAccountIds?: string[]
}

export type CarrierAccount = {
  id: string
  type: string
  readable: string
  fields: Record<string, unknown>
}

export type Rate = {
  id: string
  carrier: string
  service: string
  /**
   * Decimal amount as a string, exactly as returned by EasyPost (e.g. "5.49").
   */
  rate: string
  currency: string
  deliveryDays: number | null
}

export type EasyPostShipment = {
  id: string
  rates: Rate[]
  trackingCode?: string
  labelUrl?: string
  refundStatus?: string
  /**
   * The id of the `Tracker` EasyPost automatically creates when a shipment
   * is bought (`trk_...`). Undefined until the shipment is purchased.
   */
  trackerId?: string
  /**
   * The tracker's hosted public tracking page URL. Undefined until the
   * shipment is purchased.
   */
  trackingUrl?: string
}

/**
 * A shipment as read back from EasyPost (`retrieveShipment`), carrying the
 * addresses/parcel EasyPost actually stored for it and whether postage has
 * already been purchased -- what `createFulfillment` needs to decide whether
 * a shipment persisted at checkout time can still be bought as-is.
 */
export type EasyPostShipmentDetails = EasyPostShipment & {
  toAddress?: EasyPostStoredAddress
  fromAddress?: EasyPostStoredAddress
  parcel?: EasyPostParcelInput
  /**
   * True once postage has been bought for this shipment (EasyPost sets
   * `selected_rate`/`postage_label` on purchase). Buying it again is
   * rejected with HTTP 422 `SHIPMENT.POSTAGE.EXISTS`.
   */
  purchased: boolean
}

/**
 * An address as EasyPost stores and returns it. Unlike `EasyPostAddressInput`
 * every field may come back `null`/missing, and `country` is upper-cased by
 * EasyPost (confirmed against the real test-mode API).
 */
export type EasyPostStoredAddress = {
  name?: string | null
  company?: string | null
  street1?: string | null
  street2?: string | null
  city?: string | null
  state?: string | null
  zip?: string | null
  country?: string | null
  phone?: string | null
  email?: string | null
}

export type EasyPostClientOptions = {
  apiKey: string
}

/**
 * EasyPost's error code for a `buy` against a shipment whose postage was
 * already purchased (HTTP 422). Confirmed against the real test-mode API:
 * the SDK's thrown error carries it on `.code`.
 */
export const POSTAGE_EXISTS_ERROR_CODE = "SHIPMENT.POSTAGE.EXISTS"

export function isPostageExistsError(error: unknown): boolean {
  return (
    !!error &&
    typeof error === "object" &&
    (error as { code?: unknown }).code === POSTAGE_EXISTS_ERROR_CODE
  )
}

/**
 * Thin wrapper around the official `@easypost/api` SDK, exposing only the
 * operations this provider needs with camelCase, Medusa-shaped inputs and
 * outputs. See the comment block above for the real SDK shapes this was
 * built against.
 */
export class EasyPostClient {
  private client: InstanceType<typeof EasyPostApi>

  constructor({ apiKey }: EasyPostClientOptions) {
    this.client = new EasyPostApi(apiKey)
  }

  async listCarrierAccounts(): Promise<CarrierAccount[]> {
    const accounts = await this.client.CarrierAccount.all()

    return accounts.map((account) => ({
      id: account.id,
      type: account.type,
      readable: account.readable,
      fields: account.fields as unknown as Record<string, unknown>,
    }))
  }

  async createShipment(input: CreateShipmentInput): Promise<EasyPostShipment> {
    const shipment = await this.client.Shipment.create({
      to_address: toEasyPostAddress(input.toAddress),
      from_address: toEasyPostAddress(input.fromAddress),
      parcel: toEasyPostParcel(input.parcel),
      carrier_accounts: input.carrierAccountIds,
    })

    return toEasyPostShipmentResult(shipment)
  }

  /**
   * Reads a shipment back from EasyPost (`GET /shipments/:id`), including
   * the addresses/parcel it was created with and whether its postage has
   * already been purchased.
   */
  async retrieveShipment(shipmentId: string): Promise<EasyPostShipmentDetails> {
    const shipment = await this.client.Shipment.retrieve(shipmentId)

    return toEasyPostShipmentDetails(shipment)
  }

  async buyShipment(
    shipmentId: string,
    rateId: string
  ): Promise<EasyPostShipment> {
    const shipment = await this.client.Shipment.buy(shipmentId, rateId)

    return toEasyPostShipmentResult(shipment)
  }

  async refundShipment(shipmentId: string): Promise<EasyPostShipment> {
    const shipment = await this.client.Shipment.refund(shipmentId)

    return toEasyPostShipmentResult(shipment)
  }

  /**
   * Verifies an EasyPost webhook's `X-Hmac-Signature` header value against
   * the raw request body and the webhook secret, using EasyPost's
   * documented HMAC-SHA256 scheme (see the comment block at the top of
   * this file). Uses a constant-time comparison rather than `===`.
   */
  verifyWebhookSignature(
    rawBody: Buffer | string,
    signatureHeader: string,
    secret: string
  ): boolean {
    if (!signatureHeader) {
      return false
    }

    const bodyBuffer =
      typeof rawBody === "string" ? Buffer.from(rawBody, "utf8") : rawBody
    const encodedSecret = Buffer.from(secret.normalize("NFKD"), "utf8")

    const expectedDigest = crypto
      .createHmac("sha256", encodedSecret)
      .update(bodyBuffer)
      .digest("hex")
    const expectedSignature = `hmac-sha256-hex=${expectedDigest}`

    const expectedBuffer = Buffer.from(expectedSignature, "utf8")
    const providedBuffer = Buffer.from(signatureHeader, "utf8")

    if (expectedBuffer.length !== providedBuffer.length) {
      return false
    }

    return crypto.timingSafeEqual(expectedBuffer, providedBuffer)
  }
}

function toEasyPostAddress(address: EasyPostAddressInput) {
  return {
    name: address.name,
    company: address.company,
    street1: address.street1,
    street2: address.street2,
    city: address.city,
    state: address.state,
    zip: address.zip,
    country: address.country,
    phone: address.phone,
    email: address.email,
  }
}

function toEasyPostParcel(parcel: EasyPostParcelInput) {
  return {
    weight: parcel.weight,
    length: parcel.length,
    width: parcel.width,
    height: parcel.height,
  }
}

function toRate(rate: {
  id: string
  carrier: string
  service: string
  rate: string
  currency: string
  delivery_days: number | null
}): Rate {
  return {
    id: rate.id,
    carrier: rate.carrier,
    service: rate.service,
    rate: rate.rate,
    currency: rate.currency,
    deliveryDays: rate.delivery_days ?? null,
  }
}

function toEasyPostShipmentResult(shipment: {
  id: string
  rates?: Parameters<typeof toRate>[0][]
  tracking_code?: string | null
  postage_label?: { label_url?: string } | null
  refund_status?: string | null
  tracker?: { id?: string; public_url?: string } | null
}): EasyPostShipment {
  return {
    id: shipment.id,
    rates: (shipment.rates ?? []).map(toRate),
    trackingCode: shipment.tracking_code ?? undefined,
    labelUrl: shipment.postage_label?.label_url ?? undefined,
    refundStatus: shipment.refund_status ?? undefined,
    trackerId: shipment.tracker?.id ?? undefined,
    trackingUrl: shipment.tracker?.public_url ?? undefined,
  }
}

function toEasyPostShipmentDetails(
  shipment: Parameters<typeof toEasyPostShipmentResult>[0] & {
    to_address?: EasyPostStoredAddress | null
    from_address?: EasyPostStoredAddress | null
    parcel?: {
      weight?: number | null
      length?: number | null
      width?: number | null
      height?: number | null
    } | null
    selected_rate?: unknown
  }
): EasyPostShipmentDetails {
  const parcel =
    shipment.parcel && shipment.parcel.weight != null
      ? {
          weight: shipment.parcel.weight,
          length: shipment.parcel.length ?? undefined,
          width: shipment.parcel.width ?? undefined,
          height: shipment.parcel.height ?? undefined,
        }
      : undefined

  return {
    ...toEasyPostShipmentResult(shipment),
    toAddress: shipment.to_address ?? undefined,
    fromAddress: shipment.from_address ?? undefined,
    parcel,
    purchased: !!shipment.selected_rate || !!shipment.postage_label,
  }
}
