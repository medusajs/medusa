# @dtc/fulfillment-easypost

EasyPost fulfillment provider for Medusa. It prices calculated shipping options live from EasyPost, buys outbound labels when an order is fulfilled, and refunds them when a fulfillment is cancelled.

## Setup

Register the provider with the Fulfillment Module in `medusa-config.ts`:

```ts
{
  resolve: "@medusajs/medusa/fulfillment",
  options: {
    providers: [
      {
        resolve: "@dtc/fulfillment-easypost",
        id: "easypost",
        options: {
          apiKey: process.env.EASYPOST_API_KEY,
          // Used for any field a cart's items don't supply. Ounces / inches.
          defaultParcel: { weight: 16, length: 10, width: 8, height: 4 },
          // Optional, defaults to 999_999. See "Fallback price" below.
          unquotableFallbackPrice: 999_999,
        },
      },
    ],
  },
}
```

The provider's id in Medusa is `easypost_easypost`.

## Units: ounces and inches

EasyPost reads parcel weight in **ounces** and dimensions in **inches**. Medusa's variant `weight`, `length`, `width` and `height` have no units, and this provider passes them to EasyPost unchanged. Enter variant weights in ounces and dimensions in inches.

If a merchant enters grams, EasyPost reads each gram as an ounce. A product's weight comes out about 28 times too high, and so does the quoted shipping price.

The parcel for a cart or fulfillment adds up the weights of all items (multiplied by quantity). Its dimensions come from the single largest item. If an item has no value for a field, `defaultParcel` fills in that field.

## Stock locations need a complete address

The stock location linked to an EasyPost shipping option is the shipment's origin. It needs a **street (`address_1`), city, province/state, postal code and country**. The customer's shipping address needs the same fields.

If either address is incomplete:

- **Pricing** (`calculatePrice`, when shipping options are listed for a cart): the provider logs a warning and returns the fallback price. It does not throw. Core prices every option of a cart in one batch, so an error here would break shipping options for every cart.
- **Adding the shipping method to the cart** (`validateFulfillmentData`) and **fulfilling the order** (`createFulfillment`): the provider **throws**. These steps need a real, buyable shipment and have no safe fallback.

## Creating shipping options

Each EasyPost shipping option is one carrier and one service, for example `USPS:Priority` or `FedExDefault:FEDEX_GROUND`. Create one calculated shipping option for each carrier and service you want to offer. Each option gets its own live price. The provider does not merge them into a single "cheapest rate" option.

1. In the admin, add a shipping option to a service zone and choose the `easypost_easypost` provider.
2. Pick a fulfillment option. The list comes from `getFulfillmentOptions`, which reads which carrier and service pairs your EasyPost account can quote.
3. Set the price type to **calculated**.
4. Repeat for every carrier and service you want to offer.

Rates that a carrier returns but that the provider doesn't model yet are skipped (see `src/core/carrier-services.ts`).

When a customer adds an option to the cart, the provider creates a real EasyPost shipment and saves its ids on the shipping method's data (`easypost_shipment_id`, `easypost_rate_id`). At fulfillment time, the provider reads that shipment back from EasyPost. It buys the shipment as-is only if the shipment is still valid. Otherwise it creates and buys a fresh shipment for the same carrier and service. A shipment is not valid when:

- its postage was already bought (a split order, or fulfilling again after a cancel),
- the delivery address changed, or
- the fulfilled items make a different parcel.

## Fallback price

`unquotableFallbackPrice` (default `999_999`) is **not a real quote**. `calculatePrice` returns it when a carrier and service can't be quoted for a cart, either because EasyPost returned no rate for it at that destination or because an address is incomplete. The price is deliberately high so customers don't pick that option, without making shipping options fail for the whole cart. Customers can still see it in the option list. A failure of the EasyPost API itself (network, authentication) is not covered by the fallback and still throws.

## Tracking webhook

The consuming app's `POST /webhooks/easypost` route (in this project, `apps/backend/src/api/webhooks/easypost/route.ts`) handles tracking updates. It looks up the fulfillment by `data.easypost_tracking_code`:

- `in_transit` or `out_for_delivery` marks the fulfillment shipped.
- `delivered` marks it delivered.
- `pre_transit` is ignored. EasyPost sends it as soon as a label is bought, before the carrier has the package.

To set it up:

- In the **EasyPost dashboard**, create a webhook that points at `https://<your-backend>/webhooks/easypost`. EasyPost doesn't find the route on its own.
- Set `EASYPOST_WEBHOOK_SECRET` to that webhook's secret. The route reads it from **`process.env.EASYPOST_WEBHOOK_SECRET`** directly, not from this provider's module options. If the variable isn't set, every webhook is rejected with `401`. The route also needs `EASYPOST_API_KEY` to be set: it builds an `EasyPostClient` to check the signature, and without a key it also responds `401`.
- The route checks the `X-Hmac-Signature` header against the raw request body using `EasyPostClient.verifyWebhookSignature`, which this package exports. The route's middleware must set `bodyParser: { preserveRawBody: true }`.

## Returns: not supported in this version

EasyPost return labels are **not supported** in this version. `createReturnFulfillment` needs the customer's address as the return's origin. Medusa core removes `order` from the input before it calls the provider, in every return-creating workflow (return, exchange, claim). There is no way to pass that address in without changing core, which this package intentionally doesn't do.

With no origin address available, `createReturnFulfillment` throws a `NOT_ALLOWED` error saying that EasyPost return labels are not supported in this version, pending a core fix. Use a different fulfillment provider for return shipping options.

Outbound shipping, tracking, and cancelling outbound labels are not affected.

## Tests

```bash
yarn test
```

Tests that call the real EasyPost API only run when `EASYPOST_API_KEY` (a test-mode key) is set. Without it they are **skipped**, as in CI. The fake-client tests always run.
