import { IdMap } from "medusa-test-utils"
import { request } from "../../../../../helpers/test-request"
import { OrderServiceMock } from "../../../../../services/__mocks__/order"

const defaultRelations = [
  "customer",
  "billing_address",
  "shipping_address",
  "discounts",
  "discounts.rule",
  "discounts.rule.valid_for",
  "shipping_methods",
  "payments",
  "fulfillments",
  "fulfillments.tracking_links",
  "fulfillments.items",
  "returns",
  "returns.shipping_method",
  "returns.shipping_method.tax_lines",
  "returns.items",
  "returns.items.reason",
  "gift_cards",
  "gift_card_transactions",
  "claims",
  "claims.return_order",
  "claims.return_order.shipping_method",
  "claims.shipping_methods",
  "claims.shipping_address",
  "claims.additional_items",
  "claims.fulfillments",
  "claims.claim_items",
  "claims.claim_items.item",
  "claims.claim_items.images",
  "swaps",
  "swaps.return_order",
  "swaps.payment",
  "swaps.shipping_methods",
  "swaps.shipping_address",
  "swaps.additional_items",
  "swaps.fulfillments",
]

const defaultFields = [
  "id",
  "status",
  "fulfillment_status",
  "payment_status",
  "display_id",
  "cart_id",
  "draft_order_id",
  "customer_id",
  "email",
  "region_id",
  "currency_code",
  "tax_rate",
  "canceled_at",
  "created_at",
  "updated_at",
  "metadata",
  "items.refundable",
  "swaps.additional_items.refundable",
  "claims.additional_items.refundable",
  "shipping_total",
  "discount_total",
  "tax_total",
  "refunded_total",
  "gift_card_total",
  "subtotal",
  "total",
  "paid_total",
  "refundable_amount",
  "no_notification",
]

describe("GET /admin/orders", () => {
  describe("successfully gets an order", () => {
    let subject

    beforeAll(async () => {
      subject = await request(
        "GET",
        `/admin/orders/${IdMap.getId("test-order")}`,
        {
          adminSession: {
            jwt: {
              userId: IdMap.getId("admin_user"),
            },
          },
        }
      )
    })

    afterAll(() => {
      jest.clearAllMocks()
    })

    it("calls orderService retrieve", () => {
      expect(OrderServiceMock.retrieve).toHaveBeenCalledTimes(1)
      expect(OrderServiceMock.retrieve).toHaveBeenCalledWith(
        IdMap.getId("test-order"),
        {
          select: defaultFields,
          relations: defaultRelations,
        }
      )
    })

    it("returns order", () => {
      expect(subject.status).toEqual(200)
      expect(subject.body.order.id).toEqual(IdMap.getId("test-order"))
    })
  })
})
