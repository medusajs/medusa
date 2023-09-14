import IsolateProductDomain from "../../../../loaders/feature-flags/isolate-product-domain"
import { Order } from "../../../../models"
import { OrderService } from "../../../../services"
import { FindParams } from "../../../../types/common"
import { TotalsContext } from "../../../../types/orders"
import { cleanResponseData } from "../../../../utils/clean-response-data"

/**
 * @oas [get] /admin/orders/{id}
 * operationId: "GetOrdersOrder"
 * summary: "Get an Order"
 * description: "Retrieve an Order's details."
 * x-authenticated: true
 * parameters:
 *   - (path) id=* {string} The ID of the Order.
 *   - (query) expand {string} Comma-separated relations that should be expanded in the returned order.
 *   - (query) fields {string} Comma-separated fields that should be included in the returned order.
 * x-codegen:
 *   method: retrieve
 *   queryParams: AdminGetOrdersOrderParams
 * x-codeSamples:
 *   - lang: JavaScript
 *     label: JS Client
 *     source: |
 *       import Medusa from "@medusajs/medusa-js"
 *       const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
 *       // must be previously logged in or use api token
 *       medusa.admin.orders.retrieve(orderId)
 *       .then(({ order }) => {
 *         console.log(order.id);
 *       });
 *   - lang: Shell
 *     label: cURL
 *     source: |
 *       curl '{backend_url}/admin/orders/{id}' \
 *       -H 'Authorization: Bearer {api_token}'
 * security:
 *   - api_token: []
 *   - cookie_auth: []
 * tags:
 *   - Orders
 * responses:
 *   200:
 *     description: OK
 *     content:
 *       application/json:
 *         schema:
 *           $ref: "#/components/schemas/AdminOrdersRes"
 *   "400":
 *     $ref: "#/components/responses/400_error"
 *   "401":
 *     $ref: "#/components/responses/unauthorized"
 *   "404":
 *     $ref: "#/components/responses/not_found_error"
 *   "409":
 *     $ref: "#/components/responses/invalid_state_error"
 *   "422":
 *     $ref: "#/components/responses/invalid_request_error"
 *   "500":
 *     $ref: "#/components/responses/500_error"
 */
export default async (req, res) => {
  const { id } = req.params

  const orderService: OrderService = req.scope.resolve("orderService")
  const featureFlagRouter = req.scope.resolve("featureFlagRouter")

  const isIsolateProductDomain = featureFlagRouter.isFeatureEnabled(
    IsolateProductDomain.key
  )

  let order: Partial<Order>
  if (isIsolateProductDomain) {
    order = await getOrder(req, id, {
      includes: req.includes,
    })
  } else {
    order = await orderService.retrieveWithTotals(id, req.retrieveConfig, {
      includes: req.includes,
    })
    order = cleanResponseData(order, req.allowedProperties)
  }

  res.json({ order })
}

async function getOrder(req, id: string, context: TotalsContext) {
  const remoteQuery = req.scope.resolve("remoteQuery")

  // TODO: use context
  const variables = {
    id,
    context,
  }

  const expandedVariant = {
    fields: [
      "id",
      "created_at",
      "updated_at",
      "deleted_at",
      "title",
      "product_id",
      "sku",
      "barcode",
      "ean",
      "upc",
      "variant_rank",
      "inventory_quantity",
      "allow_backorder",
      "manage_inventory",
      "hs_code",
      "origin_country",
      "mid_code",
      "material",
      "weight",
      "length",
      "height",
      "width",
      "metadata",
    ],
    product: {
      fields: [
        "id",
        "created_at",
        "updated_at",
        "deleted_at",
        "title",
        "subtitle",
        "description",
        "handle",
        "is_giftcard",
        "status",
        "thumbnail",
        "weight",
        "length",
        "height",
        "width",
        "hs_code",
        "origin_country",
        "mid_code",
        "material",
        "collection_id",
        "type_id",
        "discountable",
        "external_id",
        "metadata",
      ],
      profile: {
        fields: [
          "id",
          "created_at",
          "updated_at",
          "deleted_at",
          "name",
          "type",
          "metadata",
        ],
      },
    },
  }

  const expandedItems = {
    fields: [
      "id",
      "created_at",
      "updated_at",
      "original_item_id",
      "order_edit_id",
      "title",
      "description",
      "thumbnail",
      "is_return",
      "is_giftcard",
      "should_merge",
      "allow_discounts",
      "has_shipping",
      "unit_price",
      "variant_id",
      "quantity",
      "fulfilled_quantity",
      "returned_quantity",
      "shipped_quantity",
      "metadata",
      "product_id",
      "adjustments",
      "refundable",
      "subtotal",
      "discount_total",
      "total",
      "original_total",
      "original_tax_total",
      "tax_total",
    ],
    tax_lines: {
      fields: [
        "id",
        "created_at",
        "updated_at",
        "rate",
        "name",
        "code",
        "metadata",
        "item_id",
      ],
    },
    variant: expandedVariant,
  }

  const expandedShippingMethods = {
    fields: ["id", "shipping_option_id", "price", "data"],
    shipping_option: {
      fields: [
        "id",
        "created_at",
        "updated_at",
        "deleted_at",
        "name",
        "region_id",
        "profile_id",
        "provider_id",
        "price_type",
        "amount",
        "is_return",
        "admin_only",
        "data",
        "metadata",
      ],
    },
    tax_lines: {
      fields: [
        "id",
        "created_at",
        "updated_at",
        "rate",
        "name",
        "code",
        "metadata",
        "shipping_method_id",
      ],
    },
  }

  const expandedShippingAddress = {
    fields: [
      "id",
      "created_at",
      "updated_at",
      "deleted_at",
      "customer_id",
      "company",
      "first_name",
      "last_name",
      "address_1",
      "address_2",
      "city",
      "country_code",
      "province",
      "postal_code",
      "phone",
      "metadata",
    ],
  }

  const expandedFullfilments = {
    fields: [
      "id",
      "no_notification",
      "provider_id",
      "location_id",
      "tracking_numbers",
      "data",
      "shipped_at",
      "canceled_at",
      "metadata",
    ],
    tracking_links: {
      fields: ["id", "url", "tracking_number", "fulfillment_id", "metadata"],
    },
    items: {
      fields: ["fulfillment_id", "item_id", "quantity"],
      item: expandedItems,
    },
    provider: {
      fields: ["id", "is_installed"],
    },
  }

  const expandedGiftCard = {
    fields: [
      "code",
      "value",
      "balance",
      "is_disabled",
      "ends_at",
      "tax_rate",
      "metadata",
    ],
  }

  const expandedPayment = {
    fields: [
      "id",
      "created_at",
      "updated_at",
      "swap_id",
      "cart_id",
      "order_id",
      "amount",
      "currency_code",
      "amount_refunded",
      "provider_id",
      "data,",
      "captured_at",
      "canceled_at",
      "metadata",
    ],
  }

  const expandedReturn = {
    fields: [
      "id",
      "status",
      "location_id",
      "shipping_data",
      "refund_amount",
      "received_at",
      "no_notification",
      "metadata",
    ],
    items: {
      fields: [
        "return_id",
        "item_id",
        "quantity",
        "is_requested",
        "requested_quantity",
        "received_quantity",
        "reason_id",
        "note",
        "metadata",
      ],
      item: expandedItems,
      reason: {
        fields: ["id", "value", "label", "description", "metadata"],
      },
    },
    shipping_method: expandedShippingMethods,
  }

  const query = {
    order: {
      __args: variables,
      fields: [
        "canceled_at",
        "cart_id",
        "created_at",
        "currency_code",
        "customer_id",
        "display_id",
        "draft_order_id",
        "email",
        "fulfillment_status",
        "id",
        "metadata",
        "no_notification",
        "payment_status",
        "region_id",
        "sales_channel_id",
        "status",
        "tax_rate",
        "updated_at",
        "shipping_total",
        "discount_total",
        "tax_total",
        "refunded_total",
        "total",
        "subtotal",
        "paid_total",
        "refundable_amount",
        "gift_card_total",
        "gift_card_tax_total",
      ],
      billing_address: {
        fields: [
          "id",
          "created_at",
          "updated_at",
          "deleted_at",
          "customer_id",
          "company",
          "first_name",
          "last_name",
          "address_1",
          "address_2",
          "city",
          "country_code",
          "province",
          "postal_code",
          "phone",
          "metadata",
        ],
      },
      claims: {
        fields: [
          "id",
          "payment_status",
          "fulfillment_status",
          "reason",
          "type",
          "order_id",
          "shipping_address_id",
          "refund_amount",
          "canceled_at",
          "created_at",
          "updated_at",
          "no_notification",
          "metadata",
          "created_at",
          "updated_at",
        ],
        additional_items: expandedItems,
        shipping_address: expandedShippingAddress,
        shipping_methods: expandedShippingMethods,
        claim_items: {
          fields: ["id", "reason", "note", "quantity"],
          item: expandedItems,
          variant: expandedVariant,
          images: {
            fields: ["id", "url", "metadata", "created_at", "updated_at"],
          },
          tags: {
            fields: ["id", "value", "metadata"],
          },
        },
        fulfillments: expandedFullfilments,
        return_order: expandedReturn,
      },
      customer: {
        fields: [
          "id",
          "created_at",
          "updated_at",
          "deleted_at",
          "email",
          "first_name",
          "last_name",
          "billing_address_id",
          "phone",
          "has_account",
          "metadata",
        ],
      },
      discounts: {
        fields: [
          "id",
          "code",
          "is_dynamic",
          "is_disabled",
          "starts_at",
          "ends_at",
          "valid_duration",
          "usage_limit",
          "usage_count",
          "metadata",
        ],
      },
      fulfillments: expandedFullfilments,
      gift_card_transactions: {
        fields: ["id", "amount", "created_at", "is_taxable", "tax_rate"],
        gift_card: expandedGiftCard,
      },
      gift_cards: expandedGiftCard,
      items: expandedItems,
      payments: expandedPayment,
      refunds: {
        fields: ["amount", "note", "reason", "metadata"],
        payment: expandedPayment,
      },
      region: {
        fields: [
          "id",
          "created_at",
          "updated_at",
          "deleted_at",
          "name",
          "currency_code",
          "tax_rate",
          "tax_code",
          "gift_cards_taxable",
          "automatic_taxes",
          "tax_provider_id",
          "metadata",
        ],
      },
      returns: expandedReturn,
      sales_channel: {
        fields: [
          "id",
          "created_at",
          "updated_at",
          "deleted_at",
          "name",
          "description",
          "is_disabled",
          "metadata",
        ],
      },
      shipping_address: expandedShippingAddress,
      shipping_methods: expandedShippingMethods,
      swaps: {
        fields: [
          "fulfillment_status",
          "payment_status",
          "difference_due",
          "shipping_address_id",
          "cart_id",
          "confirmed_at",
          "canceled_at",
          "no_notification",
          "allow_backorder",
          "metadata",
        ],
        additional_items: expandedItems,
        fulfillments: expandedFullfilments,
        payment: expandedPayment,
        shipping_address: expandedShippingAddress,
        shipping_methods: expandedShippingMethods,
      },
    },
  }

  const orders = await remoteQuery(query)

  return orders?.[0]
}

export class AdminGetOrdersOrderParams extends FindParams {}
